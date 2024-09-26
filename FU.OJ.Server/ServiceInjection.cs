using FU.OJ.Server.Infra.Context; // Đảm bảo lớp ApplicationDbContext nằm trong namespace này
using FU.OJ.Server.Infra.DBInitializer;
using FU.OJ.Server.Infra.Models;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace FU.OJ.Server
{
    public static class ServiceInjection
    {
        public static void AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProblemService, ProblemService>();
            services.AddScoped<ITestcaseService, TestcaseService>();
            services.AddScoped<ISubmissionService, SubmissionService>();
            services.AddScoped<IBlogService, BlogService>();
            services.AddScoped<IGeneralService, GeneralService>();
            services.AddScoped<ITokenService, TokenService>();

            services.AddScoped<IDbInitializer, DbInitializer>();


            // Đảm bảo sử dụng ApplicationDbContext đúng namespace
            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 8;
            }).AddEntityFrameworkStores<ApplicationDbContext>();

            var key = Encoding.UTF8.GetBytes("secretkey_992jeu9h33rnnc800x3n3003nx3033j3k45k6b6b6662sd"); // Thay đổi khóa bí mật của bạn
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = configuration["JWT:Issuer"], // Sử dụng configuration thay vì configuration.Configuration
                    ValidateAudience = true,
                    ValidAudience = configuration["JWT:Audience"], // Sử dụng configuration
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["JWT:SigningKey"]) // Sử dụng configuration
                    )
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ManagerPolicy", policy => policy.RequireRole("Manager"));
            });

            services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });
        }
    }
}
