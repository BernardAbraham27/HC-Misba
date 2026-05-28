using GodGraceHomeProducts.Application.DTOs.Orders;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class OrderService(IAppDbContext db, ICouponService couponService, IInventoryService inventoryService) : IOrderService
{
    public async Task<OrderResponseDto> CreateOrderAsync(int userId, CreateOrderDto request)
    {
        await using var tx = await db.Database.BeginTransactionAsync();
        var address = await ResolveAddressAsync(userId, request);
        var cartItems = await db.CartItems.Include(x => x.Product).Where(x => x.UserId == userId).ToListAsync();
        if (cartItems.Count == 0) throw new InvalidOperationException("Cart is empty.");
        foreach (var item in cartItems)
        {
            if (item.Product is null || !item.Product.IsActive || item.Product.IsDeleted)
                throw new InvalidOperationException("One or more cart products are unavailable.");
            if (item.Product.StockQuantity < item.Quantity)
                throw new InvalidOperationException($"Insufficient stock for {item.Product.Name}.");
        }

        var subtotal = cartItems.Sum(x => (x.Product!.DiscountPrice ?? x.Product.Price) * x.Quantity);
        var delivery = subtotal >= 500 ? 0m : 50m;
        decimal discount = 0m;
        string? couponCode = null;
        if (!string.IsNullOrWhiteSpace(request.CouponCode))
        {
            var coupon = await couponService.GetValidCouponAsync(request.CouponCode, subtotal);
            discount = couponService.CalculateDiscount(coupon, subtotal);
            couponCode = coupon.Code;
        }

        var order = new Order
        {
            UserId = userId,
            AddressId = address.Id,
            OrderNumber = $"GGP-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(100, 999)}",
            Subtotal = subtotal,
            DeliveryCharge = delivery,
            DiscountAmount = discount,
            GrandTotal = subtotal + delivery - discount,
            CouponCode = couponCode,
            PaymentMethod = request.PaymentMethod,
            Notes = request.Notes?.Trim()
        };

        foreach (var item in cartItems)
        {
            var unit = item.Product!.DiscountPrice ?? item.Product.Price;
            order.Items.Add(new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                Size = item.Size,
                UnitPrice = unit,
                Quantity = item.Quantity,
                TotalPrice = unit * item.Quantity
            });
            var previous = item.Product.StockQuantity;
            item.Product.StockQuantity -= item.Quantity;
            item.Product.UpdatedAt = DateTime.UtcNow;
            await inventoryService.RecordTransactionAsync(item.Product.Id, InventoryTransactionType.Out, -item.Quantity, previous, item.Product.StockQuantity, $"Stock reduced for order {order.OrderNumber}", false);
        }

        db.Orders.Add(order);
        db.CartItems.RemoveRange(cartItems);
        await db.SaveChangesAsync();
        await tx.CommitAsync();
        return await GetOrderByIdAsync(userId, false, order.Id);
    }

    public async Task<GuestOrderResultDto> CreateGuestOrderAsync(CreateGuestOrderDto request)
    {
        ValidateGuestRequest(request);

        await using var tx = await db.Database.BeginTransactionAsync();
        var guestUser = await CreateGuestUserAsync(request);
        var address = await CreateGuestAddressAsync(guestUser.Id, request);
        var products = await db.Products
            .Include(x => x.Sizes)
            .Where(x => request.Items.Select(i => i.ProductId).Contains(x.Id))
            .ToDictionaryAsync(x => x.Id);

        if (products.Count != request.Items.Count)
            throw new InvalidOperationException("One or more products in the cart are unavailable.");

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product) || !product.IsActive || product.IsDeleted)
                throw new InvalidOperationException("One or more products in the cart are unavailable.");
            if (item.Quantity < 1)
                throw new InvalidOperationException("Cart item quantity must be at least 1.");
            if (product.StockQuantity < item.Quantity)
                throw new InvalidOperationException($"Insufficient stock for {product.Name}.");
        }

        var subtotal = request.Items.Sum(item =>
        {
            var product = products[item.ProductId];
            var unit = product.DiscountPrice ?? product.Price;
            return unit * item.Quantity;
        });

        var delivery = subtotal >= 500 ? 0m : 50m;
        decimal discount = 0m;
        string? couponCode = null;
        if (!string.IsNullOrWhiteSpace(request.CouponCode))
        {
            var coupon = await couponService.GetValidCouponAsync(request.CouponCode, subtotal);
            discount = couponService.CalculateDiscount(coupon, subtotal);
            couponCode = coupon.Code;
        }

        var order = new Order
        {
            UserId = guestUser.Id,
            AddressId = address.Id,
            OrderNumber = await GenerateOrderNumberAsync(),
            Subtotal = subtotal,
            DeliveryCharge = delivery,
            DiscountAmount = discount,
            GrandTotal = subtotal + delivery - discount,
            CouponCode = couponCode,
            PaymentMethod = request.PaymentMethod,
            PaymentStatus = PaymentStatus.Pending,
            Status = OrderStatus.Pending,
            Notes = request.Notes?.Trim()
        };

        foreach (var item in request.Items)
        {
            var product = products[item.ProductId];
            var unit = product.DiscountPrice ?? product.Price;
            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Size = item.Size.Trim(),
                UnitPrice = unit,
                Quantity = item.Quantity,
                TotalPrice = unit * item.Quantity
            });

            var previous = product.StockQuantity;
            product.StockQuantity -= item.Quantity;
            product.UpdatedAt = DateTime.UtcNow;
            await inventoryService.RecordTransactionAsync(product.Id, InventoryTransactionType.Out, -item.Quantity, previous, product.StockQuantity, $"Stock reduced for guest order {order.OrderNumber}", false);
        }

        db.Orders.Add(order);
        await db.SaveChangesAsync();
        await tx.CommitAsync();

        return new GuestOrderResultDto
        {
            Success = true,
            OrderNumber = order.OrderNumber,
            Message = "Order placed successfully"
        };
    }

    public async Task<IReadOnlyCollection<OrderResponseDto>> GetMyOrdersAsync(int userId)
        => (await Query().Where(x => x.UserId == userId).OrderByDescending(x => x.CreatedAt).ToListAsync()).Select(Map).ToList();

    public async Task<OrderResponseDto> GetOrderByIdAsync(int requesterId, bool isAdmin, int orderId)
    {
        var order = await Query().FirstOrDefaultAsync(x => x.Id == orderId) ?? throw new KeyNotFoundException("Order not found.");
        if (!isAdmin && order.UserId != requesterId) throw new UnauthorizedAccessException("You do not have permission to view this order.");
        return Map(order);
    }

    public async Task<OrderResponseDto> TrackOrderAsync(string orderNumber, string mobileNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber) || string.IsNullOrWhiteSpace(mobileNumber))
            throw new InvalidOperationException("Order number and mobile number are required.");

        var normalizedMobile = NormalizeMobile(mobileNumber);
        var order = await Query()
            .FirstOrDefaultAsync(x =>
                x.OrderNumber == orderNumber.Trim() &&
                x.Address != null &&
                x.Address.MobileNumber == normalizedMobile)
            ?? throw new KeyNotFoundException("No order found for the given order number and mobile number.");

        return Map(order);
    }

    public async Task<IReadOnlyCollection<OrderResponseDto>> GetAllOrdersAsync()
        => (await Query().OrderByDescending(x => x.CreatedAt).ToListAsync()).Select(Map).ToList();

    public async Task<OrderResponseDto> UpdateOrderStatusAsync(int orderId, OrderStatus status)
    {
        var order = await db.Orders.FirstOrDefaultAsync(x => x.Id == orderId) ?? throw new KeyNotFoundException("Order not found.");
        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return await GetOrderByIdAsync(order.UserId, true, order.Id);
    }

    public async Task<OrderResponseDto> UpdatePaymentStatusAsync(int orderId, PaymentStatus status)
    {
        var order = await db.Orders.FirstOrDefaultAsync(x => x.Id == orderId) ?? throw new KeyNotFoundException("Order not found.");
        order.PaymentStatus = status;
        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return await GetOrderByIdAsync(order.UserId, true, order.Id);
    }

    public async Task<OrderResponseDto> CancelOrderAsync(int requesterId, bool isAdmin, int orderId)
    {
        await using var tx = await db.Database.BeginTransactionAsync();
        var order = await db.Orders.Include(x => x.Items).FirstOrDefaultAsync(x => x.Id == orderId) ?? throw new KeyNotFoundException("Order not found.");
        if (!isAdmin && order.UserId != requesterId) throw new UnauthorizedAccessException("You do not have permission to cancel this order.");
        if (order.Status is OrderStatus.Shipped or OrderStatus.OutForDelivery or OrderStatus.Delivered)
            throw new InvalidOperationException("Order cannot be cancelled after shipping.");
        if (order.Status == OrderStatus.Cancelled) return await GetOrderByIdAsync(order.UserId, true, order.Id);

        var productIds = order.Items.Select(x => x.ProductId).ToList();
        var products = await db.Products.Where(x => productIds.Contains(x.Id)).ToDictionaryAsync(x => x.Id);
        foreach (var item in order.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product)) continue;
            var previous = product.StockQuantity;
            product.StockQuantity += item.Quantity;
            product.UpdatedAt = DateTime.UtcNow;
            await inventoryService.RecordTransactionAsync(product.Id, InventoryTransactionType.Restored, item.Quantity, previous, product.StockQuantity, $"Stock restored for cancelled order {order.OrderNumber}", false);
        }

        order.Status = OrderStatus.Cancelled;
        if (order.PaymentStatus == PaymentStatus.Paid) order.PaymentStatus = PaymentStatus.Refunded;
        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        await tx.CommitAsync();
        return await GetOrderByIdAsync(order.UserId, true, order.Id);
    }

    public async Task<InvoiceDto> GetInvoiceAsync(int requesterId, bool isAdmin, int orderId)
    {
        var order = await db.Orders.Include(x => x.User).Include(x => x.Address).Include(x => x.Items).FirstOrDefaultAsync(x => x.Id == orderId)
            ?? throw new KeyNotFoundException("Order not found.");
        if (!isAdmin && order.UserId != requesterId) throw new UnauthorizedAccessException("You do not have permission to view this invoice.");
        return new InvoiceDto
        {
            OrderNumber = order.OrderNumber,
            CustomerName = order.User?.FullName ?? string.Empty,
            CustomerEmail = order.User?.Email ?? string.Empty,
            DeliveryAddress = $"{order.Address?.AddressLine1}, {order.Address?.AddressLine2}, {order.Address?.City}, {order.Address?.State} - {order.Address?.Pincode}",
            OrderDate = order.CreatedAt,
            GrandTotal = order.GrandTotal,
            Items = order.Items.Select(MapItem).ToList()
        };
    }

    private async Task<Address> ResolveAddressAsync(int userId, CreateOrderDto request)
    {
        if (request.AddressId.HasValue)
        {
            return await db.Addresses.FirstOrDefaultAsync(x => x.Id == request.AddressId.Value && x.UserId == userId)
                ?? throw new InvalidOperationException("Selected address was not found.");
        }

        if (string.IsNullOrWhiteSpace(request.FullName) ||
            string.IsNullOrWhiteSpace(request.MobileNumber) ||
            string.IsNullOrWhiteSpace(request.AddressLine1) ||
            string.IsNullOrWhiteSpace(request.City) ||
            string.IsNullOrWhiteSpace(request.State) ||
            string.IsNullOrWhiteSpace(request.Pincode))
        {
            throw new InvalidOperationException("Delivery address details are required.");
        }

        var hasDefault = await db.Addresses.AnyAsync(x => x.UserId == userId && x.IsDefault);
        var address = new Address
        {
            UserId = userId,
            FullName = request.FullName.Trim(),
            MobileNumber = request.MobileNumber.Trim(),
            AddressLine1 = request.AddressLine1.Trim(),
            AddressLine2 = request.AddressLine2?.Trim(),
            City = request.City.Trim(),
            State = request.State.Trim(),
            Pincode = request.Pincode.Trim(),
            Landmark = request.Landmark?.Trim(),
            IsDefault = !hasDefault
        };

        db.Addresses.Add(address);
        await db.SaveChangesAsync();
        return address;
    }

    private static void ValidateGuestRequest(CreateGuestOrderDto request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName))
            throw new InvalidOperationException("Customer name is required.");
        if (string.IsNullOrWhiteSpace(request.MobileNumber) || NormalizeMobile(request.MobileNumber).Length < 10)
            throw new InvalidOperationException("A valid mobile number is required.");
        if (string.IsNullOrWhiteSpace(request.AddressLine1) ||
            string.IsNullOrWhiteSpace(request.City) ||
            string.IsNullOrWhiteSpace(request.State) ||
            string.IsNullOrWhiteSpace(request.Pincode))
        {
            throw new InvalidOperationException("Complete delivery address is required.");
        }
        if (!request.Items.Any())
            throw new InvalidOperationException("Cart is empty.");
    }

    private async Task<User> CreateGuestUserAsync(CreateGuestOrderDto request)
    {
        var email = string.IsNullOrWhiteSpace(request.Email)
            ? $"guest-{Guid.NewGuid():N}@guest.godgracehomeproducts.local"
            : request.Email.Trim().ToLowerInvariant();

        var existing = await db.Users.FirstOrDefaultAsync(x => x.Email == email);
        if (existing is not null)
        {
            existing.FullName = request.CustomerName.Trim();
            existing.MobileNumber = NormalizeMobile(request.MobileNumber);
            existing.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return existing;
        }

        var user = new User
        {
            FullName = request.CustomerName.Trim(),
            Email = email,
            MobileNumber = NormalizeMobile(request.MobileNumber),
            PasswordHash = Guid.NewGuid().ToString("N"),
            Role = UserRole.Customer,
            IsActive = true,
            IsBlocked = false
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    private async Task<Address> CreateGuestAddressAsync(int userId, CreateGuestOrderDto request)
    {
        var address = new Address
        {
            UserId = userId,
            FullName = request.CustomerName.Trim(),
            MobileNumber = NormalizeMobile(request.MobileNumber),
            AddressLine1 = request.AddressLine1.Trim(),
            AddressLine2 = request.AddressLine2?.Trim(),
            City = request.City.Trim(),
            State = request.State.Trim(),
            Pincode = request.Pincode.Trim(),
            Landmark = request.Landmark?.Trim(),
            IsDefault = false
        };

        db.Addresses.Add(address);
        await db.SaveChangesAsync();
        return address;
    }

    private async Task<string> GenerateOrderNumberAsync()
    {
        string orderNumber;
        do
        {
            var count = await db.Orders.CountAsync(x => x.CreatedAt.Year == DateTime.UtcNow.Year);
            orderNumber = $"GGHP-{DateTime.UtcNow:yyyy}-{count + 1:0000}";
        } while (await db.Orders.AnyAsync(x => x.OrderNumber == orderNumber));

        return orderNumber;
    }

    private static string NormalizeMobile(string mobileNumber)
        => new(mobileNumber.Where(char.IsDigit).ToArray());

    private IQueryable<Order> Query() => db.Orders
        .Include(x => x.User)
        .Include(x => x.Address)
        .Include(x => x.Items)
        .ThenInclude(x => x.Product);

    private static OrderResponseDto Map(Order x) => new()
    {
        Id = x.Id,
        OrderNumber = x.OrderNumber,
        CustomerName = x.User?.FullName ?? string.Empty,
        CustomerMobileNumber = x.Address?.MobileNumber ?? x.User?.MobileNumber ?? string.Empty,
        Subtotal = x.Subtotal,
        DeliveryCharge = x.DeliveryCharge,
        DiscountAmount = x.DiscountAmount,
        GrandTotal = x.GrandTotal,
        CouponCode = x.CouponCode,
        Status = x.Status,
        PaymentStatus = x.PaymentStatus,
        PaymentMethod = x.PaymentMethod,
        Notes = x.Notes,
        OrderDate = x.CreatedAt,
        CreatedAt = x.CreatedAt,
        Address = x.Address is null ? null : new OrderAddressDto
        {
            Id = x.Address.Id,
            FullName = x.Address.FullName,
            MobileNumber = x.Address.MobileNumber,
            AddressLine1 = x.Address.AddressLine1,
            AddressLine2 = x.Address.AddressLine2,
            City = x.Address.City,
            State = x.Address.State,
            Pincode = x.Address.Pincode,
            Landmark = x.Address.Landmark
        },
        Items = x.Items.Select(MapItem).ToList()
    };

    private static OrderItemDto MapItem(OrderItem x) => new()
    {
        ProductId = x.ProductId,
        ProductName = x.ProductName,
        ProductImageUrl = x.Product?.ImageUrl ?? string.Empty,
        Size = x.Size,
        UnitPrice = x.UnitPrice,
        Quantity = x.Quantity,
        TotalPrice = x.TotalPrice
    };
}
