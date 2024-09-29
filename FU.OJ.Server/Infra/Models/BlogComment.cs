using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;using System.ComponentModel.DataAnnotations;using System.ComponentModel.DataAnnotations.Schema;namespace FU.OJ.Server.Infra.Models{
    public class BlogComment : BlogCommentProperties
    {
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        [ForeignKey("BlogId")]
        public Blog Blog { get; set; } = null!;
    }

    public class BlogCommentProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? UserId { get; set; }
        public string? BlogId { get; set; }
    }

    public class BlogCommentConfiguration : IEntityTypeConfiguration<BlogComment>
    {
        public void Configure(EntityTypeBuilder<BlogComment> builder)
        {
            //builder.HasKey(s => s.Id);

            //builder.HasOne(e => e.User)
            //       .WithMany()
            //       .HasForeignKey(e => e.UserId);

            //builder.HasOne(e => e.Blog)
            //       .WithMany()
            //       .HasForeignKey(e => e.BlogId);
        }
    }}