FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY GodGraceHomeProducts.sln ./
COPY Directory.Build.props ./
COPY GodGraceHomeProducts.API/GodGraceHomeProducts.API.csproj GodGraceHomeProducts.API/
COPY GodGraceHomeProducts.Application/GodGraceHomeProducts.Application.csproj GodGraceHomeProducts.Application/
COPY GodGraceHomeProducts.Domain/GodGraceHomeProducts.Domain.csproj GodGraceHomeProducts.Domain/
COPY GodGraceHomeProducts.Infrastructure/GodGraceHomeProducts.Infrastructure.csproj GodGraceHomeProducts.Infrastructure/

RUN dotnet restore GodGraceHomeProducts.sln

COPY . .

RUN dotnet publish GodGraceHomeProducts.API/GodGraceHomeProducts.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "GodGraceHomeProducts.API.dll"]