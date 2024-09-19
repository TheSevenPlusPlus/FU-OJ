namespace FU.OJ.Server.DTOs.Problem.Request
{
    public class UpdateProblemRequest
    {
        public string? title { get; set; }
        public string? description { get; set; }
        public string? constraints { get; set; }
        public string? example_input { get; set; }
        public string? example_output { get; set; }
        public double time_limit { get; set; } = 1;
        public float memory_limit { get; set; } = 256 * 1024;

    }
}
