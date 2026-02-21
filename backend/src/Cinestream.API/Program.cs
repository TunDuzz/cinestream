using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Cinestream.Infrastructure.Data;
using Cinestream.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});



// Configure JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = System.Text.Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(secretKey)
    };
});

// Configure Custom Services
builder.Services.Configure<Cinestream.Application.DTOs.MovieApi.MovieApiSettings>(builder.Configuration.GetSection("MovieApi"));
builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();

// Repositories
builder.Services.AddScoped<Cinestream.Application.Interfaces.Repositories.IUserRepository, Cinestream.Infrastructure.Repositories.UserRepository>();
builder.Services.AddScoped<Cinestream.Application.Interfaces.Repositories.IFavoriteRepository, Cinestream.Infrastructure.Repositories.FavoriteRepository>();
builder.Services.AddScoped<Cinestream.Application.Interfaces.Repositories.IWatchHistoryRepository, Cinestream.Infrastructure.Repositories.WatchHistoryRepository>();

// Common / Utilities
builder.Services.AddScoped<Cinestream.Application.Interfaces.Common.IJwtTokenGenerator, Cinestream.Infrastructure.Common.JwtTokenGenerator>();
builder.Services.AddScoped<Cinestream.Application.Interfaces.Common.IPasswordHasher, Cinestream.Infrastructure.Common.PasswordHasher>();

// Application Services
builder.Services.AddScoped<Cinestream.Application.Interfaces.Services.IMovieService, Cinestream.Infrastructure.ExternalServices.MovieService>();
builder.Services.AddScoped<Cinestream.Application.Interfaces.Services.ICloudinaryService, Cinestream.Infrastructure.ExternalServices.CloudinaryService>();
builder.Services.AddScoped<Cinestream.Application.Interfaces.Services.IAuthService, Cinestream.Infrastructure.Services.AuthService>();
builder.Services.AddScoped<Cinestream.Application.Interfaces.Services.IWatchHistoryService, Cinestream.Infrastructure.Services.WatchHistoryService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
