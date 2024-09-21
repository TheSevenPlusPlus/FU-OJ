using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.OJ.Server.Migrations
{
    /// <inheritdoc />
    public partial class updatedatabasemodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Problems",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    code = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    constraints = table.Column<string>(type: "text", nullable: true),
                    example_input = table.Column<string>(type: "text", nullable: true),
                    example_output = table.Column<string>(type: "text", nullable: true),
                    time_limit = table.Column<double>(type: "double precision", nullable: true),
                    memory_limit = table.Column<double>(type: "double precision", nullable: true),
                    create_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: true),
                    test_case_id = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Problems", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    password = table.Column<string>(type: "text", nullable: true),
                    phone = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "TestCases",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    problem_id = table.Column<string>(type: "text", nullable: false),
                    folder_path = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestCases", x => x.id);
                    table.ForeignKey(
                        name: "FK_TestCases_Problems_problem_id",
                        column: x => x.problem_id,
                        principalTable: "Problems",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Contests",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    start_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contests", x => x.id);
                    table.ForeignKey(
                        name: "FK_Contests_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Submissions",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    problem_id = table.Column<string>(type: "text", nullable: true),
                    source_code = table.Column<string>(type: "text", nullable: true),
                    language_name = table.Column<string>(type: "text", nullable: true),
                    submit_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: true),
                    user_name = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<bool>(type: "boolean", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Submissions", x => x.id);
                    table.ForeignKey(
                        name: "FK_Submissions_Problems_problem_id",
                        column: x => x.problem_id,
                        principalTable: "Problems",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Submissions_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "ContestsParticipants",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    Contestid = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<string>(type: "text", nullable: true),
                    contest_id = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContestsParticipants", x => x.id);
                    table.ForeignKey(
                        name: "FK_ContestsParticipants_Contests_Contestid",
                        column: x => x.Contestid,
                        principalTable: "Contests",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_ContestsParticipants_Contests_contest_id",
                        column: x => x.contest_id,
                        principalTable: "Contests",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_ContestsParticipants_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Results",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    Submissionid = table.Column<string>(type: "text", nullable: true),
                    submission_id = table.Column<string>(type: "text", nullable: false),
                    status_description = table.Column<string>(type: "text", nullable: true),
                    time = table.Column<string>(type: "text", nullable: true),
                    memory = table.Column<double>(type: "double precision", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Results", x => x.id);
                    table.ForeignKey(
                        name: "FK_Results_Submissions_Submissionid",
                        column: x => x.Submissionid,
                        principalTable: "Submissions",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Results_Submissions_submission_id",
                        column: x => x.submission_id,
                        principalTable: "Submissions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contests_user_id",
                table: "Contests",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_ContestsParticipants_contest_id",
                table: "ContestsParticipants",
                column: "contest_id");

            migrationBuilder.CreateIndex(
                name: "IX_ContestsParticipants_Contestid",
                table: "ContestsParticipants",
                column: "Contestid");

            migrationBuilder.CreateIndex(
                name: "IX_ContestsParticipants_user_id",
                table: "ContestsParticipants",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Results_submission_id",
                table: "Results",
                column: "submission_id");

            migrationBuilder.CreateIndex(
                name: "IX_Results_Submissionid",
                table: "Results",
                column: "Submissionid");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_problem_id",
                table: "Submissions",
                column: "problem_id");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_user_id",
                table: "Submissions",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_TestCases_problem_id",
                table: "TestCases",
                column: "problem_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContestsParticipants");

            migrationBuilder.DropTable(
                name: "Results");

            migrationBuilder.DropTable(
                name: "TestCases");

            migrationBuilder.DropTable(
                name: "Contests");

            migrationBuilder.DropTable(
                name: "Submissions");

            migrationBuilder.DropTable(
                name: "Problems");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
