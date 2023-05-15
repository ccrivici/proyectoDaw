#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Servicios.api.Puerto.csproj", "."]
RUN dotnet restore "./Servicios.api.Puerto.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "Servicios.api.Puerto.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Servicios.api.Puerto.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Servicios.api.Puerto.dll"]