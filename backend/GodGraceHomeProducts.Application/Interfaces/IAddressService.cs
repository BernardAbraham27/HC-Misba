using GodGraceHomeProducts.Application.DTOs.Addresses;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IAddressService
{
    Task<IReadOnlyCollection<AddressResponseDto>> GetAsync(int userId);
    Task<AddressResponseDto> CreateAsync(int userId, AddressRequestDto request);
    Task<AddressResponseDto> UpdateAsync(int userId, int id, AddressRequestDto request);
    Task DeleteAsync(int userId, int id);
    Task<AddressResponseDto> SetDefaultAsync(int userId, int id);
}
