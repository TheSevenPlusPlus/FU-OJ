namespace FU.OJ.Server.Infra.Const{    public class ErrorMessage
    {
        // Judge
        public const string NotFound = "Không tìm thấy dữ liệu";
        // Problem
        public const string CodeExisted = "Mã bài đã tồn tại";
        public const string NoVietnameseNoWhiteSpace = "Mã bài không được có dấu tiếng Việt hoặc khoảng trắng";
        // Submission
        public const string NotHaveTest = "Bài tập này chưa được khởi tạo bộ test. Vui lòng thử lại sau";
        public const string UserNotFound = "Không tìm thấy người dùng";

        // Contest
        public const string ContestCodeExisted = "Mã cuộc thi đã tồn tại";
        public const string StartTimeGreaterThanEndTime = "Thời gian bắt đầu cuộc thi đang được thiết lập lớn hơn thời gian kết thúc. Vui lòng kiểm tra lại";
        public const string ContestEnded = "Cuộc thi đã kết thúc";
        public const string MaxSubmissionReached = "Đã đạt đến giới hạn số lần nộp bài";
        public const string AlreadyRegistered = "Người dùng đã tham gia cuộc thi";
        public const string NotRegistered = "Người dùng chưa tham gia cuộc thi";
        public const string ContestNotStarted = "Contest chưa được khởi động";
    }
}