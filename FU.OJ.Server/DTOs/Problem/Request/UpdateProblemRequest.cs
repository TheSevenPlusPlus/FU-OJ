namespace FU.OJ.Server.DTOs.Problem.Request
{
    public class UpdateProblemRequest
    {
        public string? Code { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Constraints { get; set; }
        public string? ExampleInput { get; set; }
        public string? ExampleOutput { get; set; }
        public double? TimeLimit { get; set; } = 1;
        public float? MemoryLimit { get; set; } = 256 * 1024;
        public string? Difficulty { get; set; }
    }
}
