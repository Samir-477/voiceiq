'use client';

import type { DemandedProduct } from '@/types';

interface TopDemandedProductsProps {
  data: DemandedProduct[];
}

export function TopDemandedProducts({ data }: TopDemandedProductsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <h3 className="text-base font-bold text-gray-900 mb-6">Top Demanded Products</h3>

      <div className="flex flex-col gap-5 flex-1">
        {data.map((product) => (
          <div key={product.id} className="group">
            {/* Top row: name + requests count */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                {product.name}
              </span>
              <span className="text-xs font-medium text-gray-500 shrink-0 ml-4">
                {product.requests} requests
              </span>
            </div>

            {/* Progress bar + percentage */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${product.fulfillmentPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-red-600 w-8 text-right shrink-0">
                {product.fulfillmentPct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
