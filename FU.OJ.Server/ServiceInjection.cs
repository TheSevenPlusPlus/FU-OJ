using FU.OJ.Server.Service;

namespace FU.OJ.Server
{
    public static class ServiceInjection
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<IProblemService, ProblemService>();
            services.AddScoped<ITestcaseService, TestcaseService>();
            services.AddScoped<ISubmissionService, SubmissionService>();
        }
    }
}
