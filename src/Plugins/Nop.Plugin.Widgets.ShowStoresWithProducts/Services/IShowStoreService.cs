using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nop.Core.Domain.Catalog;

namespace Nop.Plugin.Widgets.ShowStoresWithProducts.Services
{
    public interface IShowStoreService
    {
        /// <summary>
        /// Gets all products displayed on the home page by store
        /// </summary>
        /// <returns>
        /// A task that represents the asynchronous operation
        /// The task result contains the products
        /// </returns>
        Task<IList<Product>> GetProductsDisplayedOnHomepageByStoreAsync(int storeId = 0);
    }
}
