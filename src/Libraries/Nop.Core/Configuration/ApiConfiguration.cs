//NopComment add IDisposable interface 

namespace Nop.Core.Configuration
{
    public partial class ApiConfiguration : IConfig
    {
        public int AllowedClockSkewInMinutes { get; set; } = 5;

        public string SecurityKey { get; set; } = "NowIsTheTimeForAllGoodMenToComeToTheAideOfTheirCountry";
        
    }
}
