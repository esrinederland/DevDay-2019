using System;
using System.Collections.Generic;
using ArcGIS.Core.Data.PluginDatastore;
using ArcGIS.Core.Geometry;

namespace TreasureHuntingProPlugin
{
	public class ProPluginTreasuremapCursor : PluginCursorTemplate
	{
		private IEnumerator<TreasuremapRouteItem> _enumerator = null;
		private Coordinate2D _lastEndPoint;
		private Coordinate2D _startingPoint;

		public ProPluginTreasuremapCursor(IEnumerator<TreasuremapRouteItem> enumerator, Coordinate2D startingPoint)
		{
			_lastEndPoint = _startingPoint = startingPoint;
			_enumerator = enumerator;
		}
		
		/// <summary>
		/// Do some treasurehunting
		/// </summary>
		/// <returns></returns>
		public override PluginRow GetCurrentRow()
		{
			if (_enumerator.Current != null)
			{
				// Take the last endpoint as startpoint for the next route. 
				// Calculate line from data
				Coordinate2D start = _lastEndPoint;

				// Average step is 73 cm.
				double distance = (_enumerator.Current.Steps * 0.73);

				// Calculate end point
				Coordinate2D end = new Coordinate2D();
				end.X = start.X - (distance * (Math.Cos(((_enumerator.Current.Course + 90) % 360) * (Math.PI / 180))));
				end.Y = start.Y + (distance * (Math.Sin(((_enumerator.Current.Course + 90) % 360) * (Math.PI / 180))));

				// Create line with builder
				PolylineBuilder lineBuilder = new PolylineBuilder(new List<Coordinate2D>() { start, end, }, new SpatialReferenceBuilder(28992).ToSpatialReference());

				// Create datarow
				var listOfRowValues = new List<object>();

				// "OID"
				listOfRowValues.Add(_enumerator.Current.OId);

				// "NAME"
				listOfRowValues.Add(_enumerator.Current.Name);

				// "GEOMETRY"
				listOfRowValues.Add(lineBuilder.ToGeometry());

				_lastEndPoint = end;

				return new PluginRow(listOfRowValues);
			}
			else
			{
				return null;
			}			
		}

		public void Reset()
		{
			_lastEndPoint = _startingPoint;
			_enumerator.Reset();
		}

		public override bool MoveNext()
		{
			return _enumerator.MoveNext();
		}
	}
}
