using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Contest.Response
{
    public class ContestProblemView
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ProblemId { get; set; } = null!;
        public string ProblemCode { get; set; } = null!;
        public string? Title { get; set; }
        public double? TimeLimit { get; set; }
        public double? MemoryLimit { get; set; }
        public int Order { get; set; }
        public double Point { get; set; }
        public int TotalTests { get; set; }
        public string? Difficulty { get; set; }
        public int PassedTestCount { get; set; }
    }
}
