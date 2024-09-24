using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.OJ.Server.Migrations
{
    /// <inheritdoc />
    public partial class addPropertiesToProblem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ac_quantity",
                table: "Problems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "difficulty",
                table: "Problems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "hasSolution",
                table: "Problems",
                type: "boolean",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ac_quantity",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "difficulty",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "hasSolution",
                table: "Problems");
        }
    }
}
