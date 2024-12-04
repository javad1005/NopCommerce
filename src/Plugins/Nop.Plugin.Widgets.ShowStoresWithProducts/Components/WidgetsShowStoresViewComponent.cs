using Microsoft.AspNetCore.Mvc;
using Nop.Core.Caching;
using Nop.Core;
using Nop.Services.Configuration;
using Nop.Services.Media;
using Nop.Web.Framework.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nop.Plugin.Widgets.ShowStoresWithProducts.Models;
using Nop.Core.Domain.Stores;
using Nop.Data;
using Nop.Services.Stores;
using Nop.Services.Catalog;
using Nop.Web.Factories;
using Nop.Plugin.Widgets.ShowStoresWithProducts.Services;

namespace Nop.Plugin.Widgets.ShowStoresWithProducts.Components
{
    public class WidgetsShowStoresViewComponent : NopViewComponent
    {

        private readonly IStoreService _storeService;
        private readonly IProductModelFactory _productModelFactory;
        private readonly IShowStoreService _showStoreService;

        public WidgetsShowStoresViewComponent(IStoreService storeService, IProductModelFactory productModelFactory, IShowStoreService showStoreService)
        {
            _storeService = storeService;
            _productModelFactory = productModelFactory;
            _showStoreService = showStoreService;
        }

        /// <returns>A task that represents the asynchronous operation</returns>
        public async Task<IViewComponentResult> InvokeAsync(string widgetZone, object additionalData)
        {
            var stores = await _storeService.GetAllStoresAsync();
            var model = new List<StoreWithProducts>();
            foreach (var store in stores) {
                var storeWithProducts = new StoreWithProducts();
                storeWithProducts.StoreId = store.Id;
                storeWithProducts.StoreName = store.Name;
                storeWithProducts.StoreUrl = store.Url;
                storeWithProducts.StoreProducts = (await _productModelFactory.PrepareProductOverviewModelsAsync(await _showStoreService.GetProductsDisplayedOnHomepageByStoreAsync(store.Id), true, true)).ToList(); 
                model.Add(storeWithProducts);
            }
            return View("~/Plugins/Widgets.ShowStoresWithProducts/Views/ShowStores.cshtml", model);
        }
    }
}
