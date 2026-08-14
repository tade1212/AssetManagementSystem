using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Services;
using AssetManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2. Add Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Register Services
builder.Services.AddScoped<IApplicationDbContext>(
    provider => provider.GetRequiredService<AppDbContext>());

builder.Services.AddScoped<IOrganizationService, OrganizationService>();
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

// 4. Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? "DefaultSecretKeyForDevelopmentOnly123!";

var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),

        ValidateIssuer = true,
        ValidateAudience = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"]
    };
});

// 5. Controllers + Swagger
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Asset Management API",
        Version = "v1"
    });

    // JWT Bearer authentication
    options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Enter your JWT Bearer token."
    });

    // Swagger security requirement for Swashbuckle v10+
    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("bearer", document)] = []
        });
});

var app = builder.Build();

// 6. Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "Asset Management API v1");
    });
}



app.UseCors("AllowAngular");

app.UseHttpsRedirection();
app.UseStaticFiles();
var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");

// Ensure the folder exists so the app doesn't crash
if (!Directory.Exists(uploadsFolderPath)) Directory.CreateDirectory(uploadsFolderPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsFolderPath),
    RequestPath = "/Uploads"
});
app.UseAuthentication();

app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var context =
        scope.ServiceProvider.GetRequiredService<AppDbContext>();

    DbSeeder.Seed(context);
}
//var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "Uploads");
if (!Directory.Exists(uploadsFolderPath)) Directory.CreateDirectory(uploadsFolderPath);

app.MapControllers();

app.Run();