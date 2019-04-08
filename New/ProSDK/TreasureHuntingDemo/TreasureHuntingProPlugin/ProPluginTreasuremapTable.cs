using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArcGIS.Core.Data;
using ArcGIS.Core.Data.PluginDatastore;
using ArcGIS.Core.Geometry;

namespace TreasureHuntingProPlugin
{
	public class ProPluginTreasuremapTable : PluginTableTemplate
	{
		private ProPluginTreasuremapCursor _tressuremapCursor = null;
		private TreasuremapRouteCollection _tressuremapItems = null;

		public ProPluginTreasuremapTable(Treasuremap treasuremap)
		{
			_tressuremapItems = treasuremap.Route;
			Coordinate2D startPoint = new Coordinate2D(treasuremap.X, treasuremap.Y);
			_tressuremapCursor = new ProPluginTreasuremapCursor(treasuremap.Route.GetEnumerator(), startPoint);
		}

		public override IReadOnlyList<PluginField> GetFields()
		{
			//plugin table/object
			var pluginFields = new List<PluginField>();
			
			// Add fields
			pluginFields.Add(new PluginField() { Name = "OID", AliasName = "OID", FieldType = FieldType.OID });
			pluginFields.Add(new PluginField() { Name = "NAME", AliasName = "NAME", FieldType = FieldType.String });
			pluginFields.Add(new PluginField() { Name = "GEOMETRY", AliasName = "GEOMETRY", FieldType = FieldType.Geometry });

			return pluginFields;
		}

		public override string GetName()
		{
			return "Json demo file.";
		}

		public override PluginCursorTemplate Search(QueryFilter queryFilter)
		{
			// Reset Cursor
			_tressuremapCursor.Reset();

			// Do search, for demo not implemented. 
					   
			// Return cursor. 					   
			return _tressuremapCursor;
		}

		public override PluginCursorTemplate Search(SpatialQueryFilter spatialQueryFilter)
		{
			// Reset Cursor
			_tressuremapCursor.Reset();

			// Do search, for demo not implemented. 

			// Return cursor. 					   
			return _tressuremapCursor;
		}

		public override GeometryType GetShapeType()
		{
			// We import data that contains polylines.
			return GeometryType.Polyline;
		}
	}
}
