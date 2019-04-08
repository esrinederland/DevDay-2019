using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace TreasureHuntingProPlugin
{
	public class TreasuremapRouteCollection : ICollection<TreasuremapRouteItem>
	{
		private List<TreasuremapRouteItem> tressureMapItems = new List<TreasuremapRouteItem>();

		public int Count => tressureMapItems.Count();

		public bool IsReadOnly => false;

		public void Add(TreasuremapRouteItem item)
		{
			tressureMapItems.Add(item);
		}

		public void Clear()
		{
			tressureMapItems.Clear();
		}

		public bool Contains(TreasuremapRouteItem item)
		{
			return tressureMapItems.Contains(item);
		}

		public void CopyTo(TreasuremapRouteItem[] array, int arrayIndex)
		{
			tressureMapItems.CopyTo(array, arrayIndex);
		}

		public IEnumerator<TreasuremapRouteItem> GetEnumerator()
		{
			return tressureMapItems.GetEnumerator();
		}

		public bool Remove(TreasuremapRouteItem item)
		{
			return tressureMapItems.Remove(item);
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			return GetEnumerator();
		}
	}
}
