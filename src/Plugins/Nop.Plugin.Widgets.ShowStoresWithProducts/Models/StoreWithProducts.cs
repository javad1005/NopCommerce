using Nop.Core.Domain.Catalog;
using Nop.Web.Framework.Models;
using Nop.Web.Models.Catalog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nop.Plugin.Widgets.ShowStoresWithProducts.Models
{
    public record StoreWithProducts : BaseNopModel
    {
        public int StoreId { get; set; }
        public string StoreName { get; set; }

        public string StoreUrl { get; set; }
        public IList<ProductOverviewModel> StoreProducts { get; set; }
    }
}
