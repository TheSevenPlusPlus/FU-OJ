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
            services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));

            // Thêm các dịch vụ của bạn vào DI container
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProblemService, ProblemService>();
            services.AddScoped<ITestcaseService, TestcaseService>();
            services.AddScoped<ISubmissionService, SubmissionService>();
            services.AddScoped<IBlogService, BlogService>();
            services.AddScoped<IGeneralService, GeneralService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IBlogCommentService, BlogCommentService>();
            services.AddScoped<IDbInitializer, DbInitializer>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddScoped<IContestService, ContestService>();
            services.AddIdentity<User, IdentityRole>(options =>
            {
                // Thay đổi thời gian hết hạn của reset token
                options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultEmailProvider; // Sử dụng EmailProvider cho Password Reset
                options.Password.RequireDigit = false; // Yêu cầu phải có số
                options.Password.RequiredLength = 8;   // Độ dài tối thiểu của mật khẩu
                options.Password.RequireNonAlphanumeric = false; // Yêu cầu có ký tự đặc biệt
                options.Password.RequireUppercase = false; // Yêu cầu chữ in hoa
                options.Password.RequireLowercase = false; // Yêu cầu chữ thường
                options.Password.RequiredUniqueChars = 0;  // Yêu cầu số ký tự độc nhất
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            // Thiết lập thời gian sống cho token xác thực
            services.Configure<DataProtectionTokenProviderOptions>(o =>
            {
                o.TokenLifespan = TimeSpan.FromHours(1); // Đặt thời gian sống cho token là 1 giờ
            });

            // Cấu hình Authentication & Authorization
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = configuration["JWT:Issuer"], // Sử dụng configuration 
                        ValidateAudience = true,
                        ValidAudience = configuration["JWT:Audience"], // Sử dụng configuration
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(configuration["JWT:SigningKey"]) // Sử dụng configuration
                        ),
                        ValidateLifetime = true
                    };
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ManagerPolicy", policy => policy.RequireRole("Manager"));
            });

            services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "FU.OJ Server API", Version = "v1" });

                // Thêm định nghĩa cho JWT Bearer
                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Vui lòng nhập token theo định dạng Bearer {token}",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT"
                });

                // Thêm yêu cầu security
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
        }
    }
}
