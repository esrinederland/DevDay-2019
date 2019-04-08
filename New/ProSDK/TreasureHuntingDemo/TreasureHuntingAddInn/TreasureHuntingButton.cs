using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArcGIS.Core.CIM;
using ArcGIS.Core.Data;
using ArcGIS.Core.Data.PluginDatastore;
using ArcGIS.Core.Geometry;
using ArcGIS.Desktop.Catalog;
using ArcGIS.Desktop.Core;
using ArcGIS.Desktop.Editing;
using ArcGIS.Desktop.Extensions;
using ArcGIS.Desktop.Framework;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.Dialogs;
using ArcGIS.Desktop.Framework.Threading.Tasks;
using ArcGIS.Desktop.Mapping;

namespace TreasureHuntingAddInn
{
    internal class TreasureHuntingButton : Button
    {
        protected async override void OnClick()
        {
            await QueuedTask.Run(() =>
            {
                //Uri pluginUri = new Uri(@"D:\GisTech\TreasureHuntingDemo\TestData.json", UriKind.Absolute);
                Uri pluginUri = new Uri(@"D:\Esri Nederland\DevTeam - DevDay\2019\Demos\WhatsNew\ProSDK\TreasureHuntingDemo\TestData.json", UriKind.Absolute);


                PluginDatasourceConnectionPath pluginDataSource = new PluginDatasourceConnectionPath("TreasureHuntingProPlugin_Datasource", pluginUri);

                using (var pluginDataStore = new PluginDatastore(pluginDataSource))
                {
                    foreach (var tableName in pluginDataStore.GetTableNames())
                    {
                        using (var table = pluginDataStore.OpenTable(tableName))
                        {
                            //Add as a layer to the active map or scene
                            LayerFactory.Instance.CreateFeatureLayer((FeatureClass)table, MapView.Active.Map);
                        }
                    }
                }
            });
        }
    }
}