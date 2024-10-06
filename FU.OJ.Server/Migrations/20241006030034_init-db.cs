using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FU.OJ.Server.Migrations
{
    /// <inheritdoc />
    public partial class initdb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: true),
                    City = table.Column<string>(type: "text", nullable: true),
                    School = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    FacebookLink = table.Column<string>(type: "text", nullable: true),
                    GithubLink = table.Column<string>(type: "text", nullable: true),
                    AvatarUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Blogs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false, comment: "Tiêu đề"),
                    Content = table.Column<string>(type: "text", nullable: false, comment: "Nội dung"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, comment: "Ngày tạo"),
                    UserId = table.Column<string>(type: "text", nullable: false, comment: "Người tạo")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Blogs_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Contests",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false, comment: "Mã contest"),
                    Name = table.Column<string>(type: "text", nullable: false, comment: "Tên contest"),
                    Description = table.Column<string>(type: "text", nullable: true, comment: "Chú thích"),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, comment: "Thời gian bắt đầu"),
                    EndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, comment: "Thời gian kết thúc"),
                    OrganizationId = table.Column<string>(type: "text", nullable: false, comment: "ID người tổ chức contest"),
                    OrganizationName = table.Column<string>(type: "text", nullable: false, comment: "Tên Người tổ chức contest"),
                    Rules = table.Column<string>(type: "text", nullable: true, comment: "Luật lệ"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, comment: "Thời gian tạo")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contests_AspNetUsers_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Problems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Constraints = table.Column<string>(type: "text", nullable: true),
                    Input = table.Column<string>(type: "text", nullable: true),
                    Output = table.Column<string>(type: "text", nullable: true),
                    ExampleInput = table.Column<string>(type: "text", nullable: true),
                    ExampleOutput = table.Column<string>(type: "text", nullable: true),
                    TimeLimit = table.Column<double>(type: "double precision", nullable: true),
                    MemoryLimit = table.Column<double>(type: "double precision", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    TotalTests = table.Column<int>(type: "integer", nullable: false),
                    AcQuantity = table.Column<int>(type: "integer", nullable: true),
                    Difficulty = table.Column<string>(type: "text", nullable: true),
                    HasSolution = table.Column<string>(type: "text", nullable: true),
                    TestCasePath = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Problems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Problems_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogComments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    BlogId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlogComments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BlogComments_Blogs_BlogId",
                        column: x => x.BlogId,
                        principalTable: "Blogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContestParticipants",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true, comment: "Id người tham gia"),
                    ContestId = table.Column<string>(type: "text", nullable: true, comment: "Id contest"),
                    ContestCode = table.Column<string>(type: "text", nullable: true, comment: "Mã contest"),
                    Score = table.Column<double>(type: "double precision", nullable: false, comment: "Điểm của người tham gia")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContestParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContestParticipants_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContestParticipants_Contests_ContestId",
                        column: x => x.ContestId,
                        principalTable: "Contests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContestProblems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    ContestId = table.Column<string>(type: "text", nullable: true, comment: "Id contest"),
                    ContestCode = table.Column<string>(type: "text", nullable: true, comment: "Mã bài tập"),
                    ProblemId = table.Column<string>(type: "text", nullable: false, comment: "Id bài tập"),
                    ProblemCode = table.Column<string>(type: "text", nullable: false, comment: "Mã bài tập"),
                    Order = table.Column<int>(type: "integer", nullable: false, comment: "Điểm của người tham gia"),
                    MaximumSubmission = table.Column<int>(type: "integer", nullable: false, comment: "Số lần nộp tối đa"),
                    Point = table.Column<double>(type: "double precision", nullable: false, comment: "Điểm của bài tập")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContestProblems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContestProblems_Contests_ContestId",
                        column: x => x.ContestId,
                        principalTable: "Contests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContestProblems_Problems_ProblemId",
                        column: x => x.ProblemId,
                        principalTable: "Problems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProblemUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ProblemId = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: true),
                    PassedTestCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProblemUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProblemUsers_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProblemUsers_Problems_ProblemId",
                        column: x => x.ProblemId,
                        principalTable: "Problems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Submissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    ProblemId = table.Column<string>(type: "text", nullable: false),
                    ProblemCode = table.Column<string>(type: "text", nullable: true),
                    SourceCode = table.Column<string>(type: "text", nullable: true),
                    LanguageName = table.Column<string>(type: "text", nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Submissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Submissions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Submissions_Problems_ProblemId",
                        column: x => x.ProblemId,
                        principalTable: "Problems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContestParticipantProblems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    ContestParticipantId = table.Column<string>(type: "text", nullable: false, comment: "Id của người tham gia contest"),
                    ContestProblemId = table.Column<string>(type: "text", nullable: false, comment: "Id của bài trong contest"),
                    ContestProblemCode = table.Column<string>(type: "text", nullable: false, comment: "Mã của bài trong contest"),
                    SubmissionCount = table.Column<int>(type: "integer", nullable: false, comment: "Số lần nộp một bài của một người tham gia contest")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContestParticipantProblems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContestParticipantProblems_ContestParticipants_ContestParti~",
                        column: x => x.ContestParticipantId,
                        principalTable: "ContestParticipants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContestParticipantProblems_ContestProblems_ContestProblemId",
                        column: x => x.ContestProblemId,
                        principalTable: "ContestProblems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Results",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    SubmissionId = table.Column<string>(type: "text", nullable: false),
                    StatusDescription = table.Column<string>(type: "text", nullable: true),
                    Time = table.Column<string>(type: "text", nullable: true),
                    Memory = table.Column<double>(type: "double precision", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Results", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Results_Submissions_SubmissionId",
                        column: x => x.SubmissionId,
                        principalTable: "Submissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_BlogId",
                table: "BlogComments",
                column: "BlogId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_UserId",
                table: "BlogComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_UserId",
                table: "Blogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestParticipantProblems_ContestParticipantId",
                table: "ContestParticipantProblems",
                column: "ContestParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestParticipantProblems_ContestProblemId",
                table: "ContestParticipantProblems",
                column: "ContestProblemId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestParticipants_ContestId",
                table: "ContestParticipants",
                column: "ContestId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestParticipants_UserId",
                table: "ContestParticipants",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestProblems_ContestId",
                table: "ContestProblems",
                column: "ContestId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestProblems_ProblemId",
                table: "ContestProblems",
                column: "ProblemId");

            migrationBuilder.CreateIndex(
                name: "IX_Contests_OrganizationId",
                table: "Contests",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Problems_UserId",
                table: "Problems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProblemUsers_ProblemId",
                table: "ProblemUsers",
                column: "ProblemId");

            migrationBuilder.CreateIndex(
                name: "IX_ProblemUsers_UserId",
                table: "ProblemUsers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Results_SubmissionId",
                table: "Results",
                column: "SubmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_ProblemId",
                table: "Submissions",
                column: "ProblemId");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_UserId",
                table: "Submissions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "BlogComments");

            migrationBuilder.DropTable(
                name: "ContestParticipantProblems");

            migrationBuilder.DropTable(
                name: "ProblemUsers");

            migrationBuilder.DropTable(
                name: "Results");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Blogs");

            migrationBuilder.DropTable(
                name: "ContestParticipants");

            migrationBuilder.DropTable(
                name: "ContestProblems");

            migrationBuilder.DropTable(
                name: "Submissions");

            migrationBuilder.DropTable(
                name: "Contests");

            migrationBuilder.DropTable(
                name: "Problems");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
