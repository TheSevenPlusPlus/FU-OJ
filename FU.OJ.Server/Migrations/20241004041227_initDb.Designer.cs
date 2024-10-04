﻿// <auto-generated />
using System;
using FU.OJ.Server.Infra.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FU.OJ.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241004041227_initDb")]
    partial class initDb
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Blog", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasComment("Nội dung");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasComment("Ngày tạo");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasComment("Tiêu đề");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasComment("Người tạo");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Blogs");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.BlogComment", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("BlogId")
                        .HasColumnType("text");

                    b.Property<string>("Content")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("BlogId");

                    b.HasIndex("UserId");

                    b.ToTable("BlogComments");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Contest", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .HasColumnType("text")
                        .HasComment("Chú thích");

                    b.Property<int>("Duration")
                        .HasColumnType("integer")
                        .HasComment("Diễn ra trong bao lâu: phút");

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("timestamp with time zone")
                        .HasComment("Thời gian kết thúc");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasComment("Tên contest");

                    b.Property<string>("Rules")
                        .HasColumnType("text")
                        .HasComment("Luật lệ");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("timestamp with time zone")
                        .HasComment("Thời gian bắt đầu");

                    b.Property<string>("UserId")
                        .HasColumnType("text")
                        .HasComment("Người tổ chức contest");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Contests");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.ContestParticipant", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ContestId")
                        .HasColumnType("text")
                        .HasComment("Id contest");

                    b.Property<double>("Score")
                        .HasColumnType("double precision")
                        .HasComment("Điểm của người tham gia");

                    b.Property<string>("UserId")
                        .HasColumnType("text")
                        .HasComment("Id người tham gia");

                    b.HasKey("Id");

                    b.HasIndex("ContestId");

                    b.HasIndex("UserId");

                    b.ToTable("ContestParticipants");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.ContestParticipantProblem", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ContestParticipantId")
                        .HasColumnType("text")
                        .HasComment("Id của người tham gia contest");

                    b.Property<string>("ContestProblemId")
                        .HasColumnType("text")
                        .HasComment("Id của bài trong contest");

                    b.Property<int>("SubmissionCount")
                        .HasColumnType("integer")
                        .HasComment("Số lần nộp một bài của một người tham gia contest");

                    b.HasKey("Id");

                    b.HasIndex("ContestParticipantId");

                    b.HasIndex("ContestProblemId");

                    b.ToTable("ContestParticipantProblems");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.ContestProblem", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ContestId")
                        .HasColumnType("text")
                        .HasComment("Id người tham gia");

                    b.Property<int>("MaximumSubmission")
                        .HasColumnType("integer")
                        .HasComment("Số lần nộp tối đa");

                    b.Property<int>("Order")
                        .HasColumnType("integer")
                        .HasComment("Điểm của người tham gia");

                    b.Property<double>("Point")
                        .HasColumnType("double precision")
                        .HasComment("Điểm của bài");

                    b.Property<string>("ProblemId")
                        .HasColumnType("text")
                        .HasComment("Id contest");

                    b.HasKey("Id");

                    b.HasIndex("ContestId");

                    b.HasIndex("ProblemId");

                    b.ToTable("ContestProblems");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Problem", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int?>("AcQuantity")
                        .HasColumnType("integer");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Constraints")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Difficulty")
                        .HasColumnType("text");

                    b.Property<string>("ExampleInput")
                        .HasColumnType("text");

                    b.Property<string>("ExampleOutput")
                        .HasColumnType("text");

                    b.Property<string>("HasSolution")
                        .HasColumnType("text");

                    b.Property<string>("Input")
                        .HasColumnType("text");

                    b.Property<double?>("MemoryLimit")
                        .HasColumnType("double precision");

                    b.Property<string>("Output")
                        .HasColumnType("text");

                    b.Property<string>("TestCasePath")
                        .HasColumnType("text");

                    b.Property<double?>("TimeLimit")
                        .HasColumnType("double precision");

                    b.Property<string>("Title")
                        .HasColumnType("text");

                    b.Property<int>("TotalTests")
                        .HasColumnType("integer");

                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Problems");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.ProblemUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("PassedTestCount")
                        .HasColumnType("integer");

                    b.Property<string>("ProblemId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Status")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ProblemId");

                    b.HasIndex("UserId");

                    b.ToTable("ProblemUsers");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Result", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<double?>("Memory")
                        .HasColumnType("double precision");

                    b.Property<string>("StatusDescription")
                        .HasColumnType("text");

                    b.Property<string>("SubmissionId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Time")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("SubmissionId");

                    b.ToTable("Results");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Submission", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("LanguageName")
                        .HasColumnType("text");

                    b.Property<string>("ProblemCode")
                        .HasColumnType("text");

                    b.Property<string>("ProblemId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SourceCode")
                        .HasColumnType("text");

                    b.Property<string>("Status")
                        .HasColumnType("text");

                    b.Property<DateTime>("SubmittedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserName")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ProblemId");

                    b.HasIndex("UserId");

                    b.ToTable("Submissions");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("AvatarUrl")
                        .HasColumnType("text");

                    b.Property<string>("City")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<DateTime?>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("FacebookLink")
                        .HasColumnType("text");

                    b.Property<string>("FullName")
                        .HasColumnType("text");

                    b.Property<string>("GithubLink")
                        .HasColumnType("text");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("School")
                        .HasColumnType("text");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .HasColumnType("text");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Blog", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.User", "User")
                        .WithMany("Blogs")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.BlogComment", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.Blog", "Blog")
                        .WithMany("Comments")
                        .HasForeignKey("BlogId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("FU.OJ.Server.Infra.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Blog");

                    b.Navigation("User");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Contest", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("User");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.ContestParticipant", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.Contest", "Contest")
                        .WithMany("ContestParticipants")
                        .HasForeignKey("ContestId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("FU.OJ.Server.Infra.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Contest");

                    b.Navigation("User");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.ContestParticipantProblem", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.ContestParticipant", "ContestParticipant")
                        .WithMany()
                        .HasForeignKey("ContestParticipantId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("FU.OJ.Server.Infra.Models.ContestProblem", "ContestProblem")
                        .WithMany()
                        .HasForeignKey("ContestProblemId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("ContestParticipant");

                    b.Navigation("ContestProblem");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.ContestProblem", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.Contest", "Contest")
                        .WithMany()
                        .HasForeignKey("ContestId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("FU.OJ.Server.Infra.Models.Problem", "Problem")
                        .WithMany()
                        .HasForeignKey("ProblemId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Contest");

                    b.Navigation("Problem");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Problem", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.User", "User")
                        .WithMany("Problems")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("User");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.ProblemUser", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.Problem", "Problem")
                        .WithMany("ProblemUsers")
                        .HasForeignKey("ProblemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FU.OJ.Server.Infra.Models.User", "User")
                        .WithMany("ProblemsUsers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Problem");

                    b.Navigation("User");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Result", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.Submission", "Submission")
                        .WithMany("Results")
                        .HasForeignKey("SubmissionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Submission");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Submission", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.Problem", "Problem")
                        .WithMany("Submissions")
                        .HasForeignKey("ProblemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FU.OJ.Server.Infra.Models.User", "User")
                        .WithMany("Submissions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Problem");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FU.OJ.Server.Infra.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("FU.OJ.Server.Infra.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Blog", b =>
                {
                    b.Navigation("Comments");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Contest", b =>
                {
                    b.Navigation("ContestParticipants");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Problem", b =>
                {
                    b.Navigation("ProblemUsers");

                    b.Navigation("Submissions");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.Submission", b =>
                {
                    b.Navigation("Results");
                });

            modelBuilder.Entity("FU.OJ.Server.Infra.Models.User", b =>
                {
                    b.Navigation("Blogs");

                    b.Navigation("Problems");

                    b.Navigation("ProblemsUsers");

                    b.Navigation("Submissions");
                });
#pragma warning restore 612, 618
        }
    }
}
