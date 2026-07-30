import React, { useState, useMemo } from 'react';
import { OrderInvoice } from '@/types';
import { Button, Input, Card, Alert } from '@/shared';
import { formatDate, formatCurrency } from '@/utils/formatters';

interface AdminOrdersProps {
  orders: OrderInvoice[];
  onUpdate: (order: OrderInvoice) => void;
  onDelete: (id: string) => void;
}

export function AdminOrders({ orders, onUpdate, onDelete }: AdminOrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredOrders = useMemo(() => {
    let result = orders.filter((order) => {
      const matchesSearch =
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    } else {
      result.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
    }

    return result;
  }, [orders, searchTerm, filterStatus, sortBy]);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  };

  const handleStatusChange = (orderId: string, newStatus: 'pending' | 'completed') => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      onUpdate({ ...order, status: newStatus });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="search"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'date'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Date
          </button>
          <button
            onClick={() => setSortBy('amount')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'amount'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Amount
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2 hidden sm:table-cell">Customer</th>
                <th className="text-right px-4 py-2 hidden md:table-cell">Amount</th>
                <th className="text-center px-4 py-2">Status</th>
                <th className="text-left px-4 py-2 hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 font-mono text-sm">{order.id?.slice(0, 8)}</td>
                  <td className="px-4 py-2 hidden sm:table-cell">
                    <div className="text-sm font-medium">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-4 py-2 hidden md:table-cell text-right font-medium">
                    {formatCurrency(order.totalAmount || 0)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusChange(order.id!, e.target.value as any)}
                      className={`text-sm px-2 py-1 rounded font-medium border-0 ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 hidden lg:table-cell text-sm">
                    {order.date ? formatDate(new Date(order.date)) : 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleDelete(order.id!)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </Card>
    </div>
  );
}
