using FU.OJ.Server;
using FU.OJ.Server.Infra.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddServices();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",  // Change policy name as needed
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        });
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Enable CORS
app.UseCors("AllowAllOrigins");

// Enable Swagger (optional: limit to development environment)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// Fallback to index.html for single-page applications (SPA)
app.MapFallbackToFile("/index.html");

app.Run();
