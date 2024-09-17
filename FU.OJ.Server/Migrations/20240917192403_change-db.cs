using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.OJ.Server.Migrations
{
    /// <inheritdoc />
    public partial class changedb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "test_case_id",
                table: "Problems",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "code",
                table: "Problems",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "constraints",
                table: "Problems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "example_input",
                table: "Problems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "example_output",
                table: "Problems",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "code",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "constraints",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "example_input",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "example_output",
                table: "Problems");

            migrationBuilder.AlterColumn<int>(
                name: "test_case_id",
                table: "Problems",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
