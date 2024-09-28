namespace FU.OJ.Server.Infra.Const
{
    public class ErrorMessage
    {
        // Judge
        public const string NotFound = "Không tìm thấy dữ liệu";

        // Problem
        public const string CodeExisted = "Mã bài đã tồn tại";
        public const string NoVietnameseNoWhiteSpace = "Mã bài không được có dấu tiếng Việt hoặc khoảng trắng";

        // Submission
        public const string NotHaveTest = "Bài tập này chưa được khởi tạo bộ test. Vui lòng thử lại sau";
        public const string UserNotFound = "Không tìm thấy người dùng";
    }
}