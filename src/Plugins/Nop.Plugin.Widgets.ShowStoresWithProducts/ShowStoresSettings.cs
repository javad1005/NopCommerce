using DocumentFormat.OpenXml.Wordprocessing;
using Nop.Core.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nop.Plugin.Widgets.ShowStoresWithProducts
{
    public class ShowStoresSettings : ISettings
    {
        public List<int> AllowedStoresToShow { get; set; }
    }
}
