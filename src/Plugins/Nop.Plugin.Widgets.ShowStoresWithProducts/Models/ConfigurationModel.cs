using Nop.Web.Framework.Models;
using System.Collections.Generic;
using Nop.Web.Framework.Mvc.ModelBinding;

namespace Nop.Plugin.Widgets.ShowStoresWithProducts.Models
{
    public record ConfigurationModel : BaseNopModel
    {
        public int ActiveStoreScopeConfiguration { get; set; }

        [NopResourceDisplayName("Plugins.Widgets.ShowStoresWithProducts.AllowedStoresToShow")]
        public List<int> AllowedStoresToShow { get; set; }
        public bool AllowedStoresToShow_OverrideForStore { get; set; }
        
    }
}
