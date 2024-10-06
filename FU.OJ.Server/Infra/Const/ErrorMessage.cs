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

        public const string BlogNotFound = "Không tìm thấy blog";
        public const string NoCommentsFound = "Không tìm thấy comment";

        public const string InvalidInput = "Dữ liệu đầu vào không hợp lệ.";
        public const string Unauthorized = "Bạn không có quyền thực hiện hành động này.";
        public const string Forbidden = "Truy cập tài nguyên này bị cấm.";
        public const string InternalServerError = "Đã xảy ra lỗi hệ thống.";
        public const string BadRequest = "Yêu cầu không hợp lệ hoặc thiếu thông tin cần thiết.";
        public const string Conflict = "Có sự xung đột với trạng thái hiện tại của tài nguyên.";
        public const string InvalidRole = "Role không hợp lệ";

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