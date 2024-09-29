namespace FU.OJ.Server.DTOs.General.Response
{
    public class UserRankResponse
    {
        public int Rank { get; set; }
        public string UserName { get; set; }
        public int AcProblems { get; set; }
    }

    public class PaginatedResponse<T>
    {
        public int TotalItems { get; set; }
        public List<T> Items { get; set; } = new List<T>();
    }
}
