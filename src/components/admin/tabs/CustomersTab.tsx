import React, { useState } from 'react';
import { Input } from '@/components/shared';

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', orders: 5, totalSpent: 899.99, joinDate: '2023-06-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', orders: 3, totalSpent: 449.99, joinDate: '2023-08-20' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', orders: 1, totalSpent: 99.99, joinDate: '2024-01-10' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', orders: 7, totalSpent: 1299.99, joinDate: '2023-05-01' },
];

export default function CustomersTab() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
          />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + Add Customer
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Orders</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Total Spent</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Join Date</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{customer.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{customer.email}</td>
                  <td className="px-6 py-4 text-slate-200">{customer.orders}</td>
                  <td className="px-6 py-4 text-slate-200 font-medium">${customer.totalSpent}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{customer.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                      <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400">No customers found</div>
        )}
      </div>
    </div>
  );
}
