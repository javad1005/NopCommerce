using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nop.Core.Caching;
using Nop.Core;
using Nop.Core.Domain.Catalog;
using Nop.Core.Domain.Discounts;
using Nop.Core.Domain.Localization;
using Nop.Core.Domain.Shipping;
using Nop.Data;
using Nop.Services.Catalog;
using Nop.Services.Customers;
using Nop.Services.Localization;
using Nop.Services.Security;
using Nop.Services.Shipping.Date;
using Nop.Services.Stores;
using DocumentFormat.OpenXml.Vml.Spreadsheet;

namespace Nop.Plugin.Widgets.ShowStoresWithProducts.Services
{
    public class ShowStoreService : IShowStoreService
    {
        #region Fields

        protected readonly IRepository<Product> _productRepository;
        protected readonly IStoreMappingService _storeMappingService;

        #endregion

        #region Ctor

        public ShowStoreService(IRepository<Product> productRepository, IStoreMappingService storeMappingService)
        {
            _productRepository = productRepository;
            _storeMappingService = storeMappingService;
        }

        #endregion


        #region Methods
        public async Task<IList<Product>> GetProductsDisplayedOnHomepageByStoreAsync(int storeId = 0)
        {
            var productsQuery = _productRepository.Table;

            if (storeId > 0)
            {
                //apply store mapping constraints
                productsQuery = await _storeMappingService.ApplyStoreMapping(productsQuery, storeId);
            }
            productsQuery = productsQuery.Where(p => p.Published == true && !p.Deleted && p.ShowOnHomepage);

            return productsQuery.ToList();
        }


        #endregion
    }
}
