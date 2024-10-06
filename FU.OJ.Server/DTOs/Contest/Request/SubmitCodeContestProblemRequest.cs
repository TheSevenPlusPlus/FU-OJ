using FU.OJ.Server.DTOs.Submission.Request;

namespace FU.OJ.Server.DTOs.Contest.Request
{
    public class SubmitCodeContestProblemRequest : CreateSubmissionRequest
    {
        public string ContestCode { get; set; } = null!;
    }
}
