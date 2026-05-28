# God Grace Home Products Backend

## Projects

- `GodGraceHomeProducts.API`
- `GodGraceHomeProducts.Application`
- `GodGraceHomeProducts.Domain`
- `GodGraceHomeProducts.Infrastructure`

## Setup

1. Update `GodGraceHomeProducts.API/appsettings.json` with your PostgreSQL connection string.
2. Run `dotnet restore GodGraceHomeProducts.sln`
3. Run `dotnet build GodGraceHomeProducts.sln`
4. Run:
   - `dotnet ef migrations add InitialCreate --project .\GodGraceHomeProducts.Infrastructure\GodGraceHomeProducts.Infrastructure.csproj --startup-project .\GodGraceHomeProducts.API\GodGraceHomeProducts.API.csproj --output-dir Migrations`
   - `dotnet ef database update --project .\GodGraceHomeProducts.Infrastructure\GodGraceHomeProducts.Infrastructure.csproj --startup-project .\GodGraceHomeProducts.API\GodGraceHomeProducts.API.csproj`
5. Start the API with `dotnet run --project .\GodGraceHomeProducts.API\GodGraceHomeProducts.API.csproj`

## Default Admin

- Email: `admin@mispa.com`
- Password: `Admin@123`
