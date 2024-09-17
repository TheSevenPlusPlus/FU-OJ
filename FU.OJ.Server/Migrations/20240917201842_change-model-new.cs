using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.OJ.Server.Migrations
{
    /// <inheritdoc />
    public partial class changemodelnew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "input",
                table: "TestCases");

            migrationBuilder.DropColumn(
                name: "output",
                table: "TestCases");

            migrationBuilder.AddColumn<string>(
                name: "folder_path",
                table: "TestCases",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<double>(
                name: "time_limit",
                table: "Problems",
                type: "double precision",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<double>(
                name: "memory_limit",
                table: "Problems",
                type: "double precision",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "folder_path",
                table: "TestCases");

            migrationBuilder.AddColumn<string>(
                name: "input",
                table: "TestCases",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "output",
                table: "TestCases",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "time_limit",
                table: "Problems",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "memory_limit",
                table: "Problems",
                type: "real",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldNullable: true);
        }
    }
}
