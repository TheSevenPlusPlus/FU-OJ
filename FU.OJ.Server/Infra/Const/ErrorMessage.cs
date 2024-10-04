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
    }
}