using System.ComponentModel;

namespace FU.OJ.Server.Infra.Enum{    public enum eStatus_Submission
    {
        [Description("Accept")]
        ac = 0,
        [Description("Wrong Answer")]
        wa = 1,
        [Description("Time limit excess")]
        tle = 2,
        [Description("Memory limit excess")]
        mle = 3,
        [Description("Complier error")]
        ce = 4
    }}