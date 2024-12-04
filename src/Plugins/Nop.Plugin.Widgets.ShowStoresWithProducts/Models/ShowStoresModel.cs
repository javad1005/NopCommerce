using Nop.Web.Framework.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nop.Plugin.Widgets.ShowStoresWithProducts.Models
{
    public record ShowStoresModel : BaseNopModel
    {
        public List<int> AllowedStoresToShow { get; set; }
    }
}
