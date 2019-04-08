using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArcGIS.Core.Data;
using ArcGIS.Core.Data.PluginDatastore;
using ArcGIS.Core.Geometry;
using Newtonsoft.Json;

namespace TreasureHuntingProPlugin
{
	public class ProPluginTreasuremapDatasource : PluginDatasourceTemplate
	{
		private ProPluginTreasuremapTable _tressureMapTable = null;

		public override void Open(Uri connectionPath)
		{
			if (connectionPath.IsFile)
			{
				if (File.Exists(connectionPath.LocalPath))
				{
					string jsonDataString = File.ReadAllText(connectionPath.LocalPath);

					Treasuremap treasuremap = JsonConvert.DeserializeObject<Treasuremap>(jsonDataString);
					
					_tressureMapTable = new ProPluginTreasuremapTable(treasuremap);
				    }
			}
		}

		public override void Close()
		{
			// Clear the data
			_tressureMapTable = null;
		}

		public override PluginTableTemplate OpenTable(string name)
		{
			// Return the data source. 
			// In this demo we have only one table, therefore name is not used.
			return _tressureMapTable;
		}

		public override IReadOnlyList<string> GetTableNames()
		{
			var tableNames = new List<string>();

			tableNames.Add("Treasure hunting map");

			return tableNames;
		}

		public override bool IsQueryLanguageSupported()
		{
			//default is false
			return base.IsQueryLanguageSupported();
		}
	}
}
