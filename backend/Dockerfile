FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["GodGraceHomeProducts.sln", "./"]
COPY ["Directory.Build.props", "./"]
COPY ["GodGraceHomeProducts.API/GodGraceHomeProducts.API.csproj", "GodGraceHomeProducts.API/"]
COPY ["GodGraceHomeProducts.Application/GodGraceHomeProducts.Application.csproj", "GodGraceHomeProducts.Application/"]
COPY ["GodGraceHomeProducts.Domain/GodGraceHomeProducts.Domain.csproj", "GodGraceHomeProducts.Domain/"]
COPY ["GodGraceHomeProducts.Infrastructure/GodGraceHomeProducts.Infrastructure.csproj", "GodGraceHomeProducts.Infrastructure/"]

RUN dotnet restore "GodGraceHomeProducts.sln"

COPY . .

RUN dotnet publish "GodGraceHomeProducts.API/GodGraceHomeProducts.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

ENV PORT=10000
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "GodGraceHomeProducts.API.dll"]
