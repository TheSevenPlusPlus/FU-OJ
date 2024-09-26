using FU.OJ.Server;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.DBInitializer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký dịch vụ
builder.Services.AddServices(builder.Configuration); // Truyền builder.Configuration vào đây

// Thêm chính sách CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", policy =>
    {
        policy.WithOrigins("*") // Có thể thay đổi thành danh sách miền cụ thể
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Thêm các dịch vụ vào container
builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký DbContext với PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Kích hoạt CORS
app.UseCors("CORS");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();
//Seed db
SeedDatabase();
// Fallback to index.html cho single-page applications (SPA)
app.MapFallbackToFile("/index.html");

app.Run();

void SeedDatabase()
{
    using (var scope = app.Services.CreateScope())
    {
        var dbInitializer = scope.ServiceProvider.GetRequiredService<IDbInitializer>();
        dbInitializer.Initialize();
    }
}