using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.OJ.Server.Migrations
{
    /// <inheritdoc />
    public partial class changerelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Submissionid",
                table: "Results",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Results_Submissionid",
                table: "Results",
                column: "Submissionid");

            migrationBuilder.AddForeignKey(
                name: "FK_Results_Submissions_Submissionid",
                table: "Results",
                column: "Submissionid",
                principalTable: "Submissions",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Results_Submissions_Submissionid",
                table: "Results");

            migrationBuilder.DropIndex(
                name: "IX_Results_Submissionid",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "Submissionid",
                table: "Results");
        }
    }
}
