import React, { useState } from 'react';
import { Input, Button } from '@/components/shared';

interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'pending' | 'completed' | 'shipped' | 'cancelled';
  date: string;
}

const mockOrders: Order[] = [
  { id: '#ORD001', customer: 'John Doe', total: 299.99, status: 'completed', date: '2024-01-15' },
  { id: '#ORD002', customer: 'Jane Smith', total: 149.99, status: 'shipped', date: '2024-01-14' },
  { id: '#ORD003', customer: 'Bob Johnson', total: 449.99, status: 'pending', date: '2024-01-13' },
  { id: '#ORD004', customer: 'Alice Brown', total: 99.99, status: 'completed', date: '2024-01-12' },
];

export default function OrdersTab() {
  const [orders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');

  const filtered = orders.filter(
    (o) =>
      o.id.includes(search) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
          />
        </div>
        <select className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
          <option>All Status</option>
          <option>Pending</option>
          <option>Shipped</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Order ID</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Customer</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Total</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Date</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{order.id}</td>
                  <td className="px-6 py-4 text-slate-200">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-200">${order.total}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : order.status === 'shipped'
                          ? 'bg-blue-500/20 text-blue-300'
                          : order.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{order.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400">No orders found</div>
        )}
      </div>
    </div>
  );
}
