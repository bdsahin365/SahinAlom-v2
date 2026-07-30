import React, { useState } from 'react';
import { Input, Button } from '@/components/shared';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
}

const mockProducts: Product[] = [
  { id: '1', name: 'Premium Template', price: 99, stock: 15, status: 'active' },
  { id: '2', name: 'Design System', price: 149, stock: 8, status: 'active' },
  { id: '3', name: 'Development Course', price: 199, stock: 0, status: 'active' },
  { id: '4', name: 'Consultation Package', price: 299, stock: 20, status: 'draft' },
];

export default function ProductsTab() {
  const [products] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
          />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Product</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Price</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Stock</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 text-slate-200">{product.name}</td>
                  <td className="px-6 py-4 text-slate-200">${product.price}</td>
                  <td className="px-6 py-4 text-slate-200">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : product.status === 'draft'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                      <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400">No products found</div>
        )}
      </div>
    </div>
  );
}
