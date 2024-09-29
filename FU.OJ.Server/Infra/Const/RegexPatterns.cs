namespace FU.OJ.Server.Infra.Const{    public static class RegexPatterns
    {
        public const string EnglishAlphabet = @"^[a-zA-Z]+$";
        public const string VietnameseAlphabet = @"^[a-zA-ZàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ\s]+$";
        public const string NumberString = @"^\d+$";
        public const string Password = @"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W\_])[a-zA-Z0-9\W\_]{8,15}$";
        public const string NoWhiteSpace = @"^\S*$";
        public const string CCCD = @"0[0-9]{11}$";
        public const string NoVietnameseAlphabetNoWhiteSpace = @"^[^àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ\s]+$";
        public const string TaxCode = @"^\d{10}(-\d{3})?$";
    }}