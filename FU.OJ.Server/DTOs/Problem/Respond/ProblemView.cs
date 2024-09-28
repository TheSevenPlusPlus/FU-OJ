namespace FU.OJ.Server.DTOs.Problem.Respond
{
    public class ProblemView
    {
        public string Code { get; set; } = null!;
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Constraints { get; set; }
        public string? ExampleInput { get; set; }
        public string? ExampleOutput { get; set; }
        public double? TimeLimit { get; set; }
        public double? MemoryLimit { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UserId { get; set; }
        public string? TestCaseId { get; set; }
        public int? AcQuantity { get; set; }
        public string? Difficulty { get; set; }
        public string? HasSolution { get; set; }
    }
}
