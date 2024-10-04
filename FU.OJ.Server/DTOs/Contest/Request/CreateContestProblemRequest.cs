namespace FU.OJ.Server.DTOs.Contest.Request
{
    public class CreateContestProblemRequest
    {
        public string ProblemId { get; set; } = null!;
        public string ProblemCode { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public int Order { get; set; }
        public double Point { get; set; }
    }
}
