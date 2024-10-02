using FU.OJ.Server.Infra.Models;
using Microsoft.Extensions.Options; // Thêm using này
using System.Net;
using System.Net.Mail;

namespace FU.OJ.Server.Service
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }

    public class EmailSender : IEmailSender
    {
        private readonly EmailSettings _emailSettings;
        private readonly string _clientUrl;

        public EmailSender(IOptions<EmailSettings> emailSettings, IConfiguration configuration) // Thay đổi ở đây
        {
            _emailSettings = emailSettings.Value; // Lấy giá trị cấu hình
            _clientUrl = configuration["ClientUrl"];
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            using (var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort))
            {
                client.Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);
                client.EnableSsl = true;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);
            }
        }
    }
}
