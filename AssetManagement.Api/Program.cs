using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Services;
using AssetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IApplicationDbContext>(provider =>
    provider.GetRequiredService<AppDbContext>());

builder.Services.AddScoped<IOrganizationService, OrganizationService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAssetService, AssetService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbSeeder.Seed(context);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();    // Add this
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // enables serving files from wwwroot
app.UseAuthorization();
app.MapControllers();
app.Run();