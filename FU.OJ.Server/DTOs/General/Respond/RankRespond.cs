namespace FU.OJ.Server.DTOs.General.Respond
{
    public class UserRankRespond
    {
        public int Rank { get; set; }
        public string UserName { get; set; }
        public int AcProblems { get; set; }
    }

    public class PaginatedRepond<T>
    {
        public int TotalItems { get; set; }
        public List<T> Items { get; set; }
    }

}
