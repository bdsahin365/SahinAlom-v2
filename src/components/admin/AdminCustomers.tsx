import React, { useState, useMemo } from 'react';
import { Customer } from '@/types';
import { Button, Input, Card, Alert, Modal } from '@/shared';
import { formatDate } from '@/utils/formatters';

interface AdminCustomersProps {
  customers: Customer[];
  onAdd: (customer: Customer) => void;
  onUpdate: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function AdminCustomers({
  customers,
  onAdd,
  onUpdate,
  onDelete,
}: AdminCustomersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [error, setError] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    let result = customers.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
    );

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [customers, searchTerm, sortBy]);

  const stats = {
    total: customers.length,
    withOrders: customers.filter(c => c.orders && c.orders.length > 0).length,
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({});
    setIsAddModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData(customer);
    setIsAddModalOpen(true);
  };

  const handleSave = () => {
    try {
      if (!formData.name) {
        setError('Customer name is required');
        return;
      }

      if (editingId) {
        onUpdate(formData as Customer);
      } else {
        onAdd({
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date(),
        } as Customer);
      }

      setIsAddModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Customers</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">With Orders</div>
          <div className="text-2xl font-bold text-blue-600">{stats.withOrders}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Conversion</div>
          <div className="text-2xl font-bold">
            {stats.total > 0 ? Math.round((stats.withOrders / stats.total) * 100) : 0}%
          </div>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          type="search"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Customer
        </Button>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy('name')}
          className={`px-3 py-1 rounded text-sm ${
            sortBy === 'name'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Name
        </button>
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
      </div>

      {/* Customers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-2 hidden md:table-cell">Phone</th>
                <th className="text-center px-4 py-2 hidden lg:table-cell">Orders</th>
                <th className="text-left px-4 py-2 hidden xl:table-cell">Joined</th>
                <th className="text-right px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 font-medium truncate">{customer.name}</td>
                  <td className="px-4 py-2 hidden sm:table-cell text-sm truncate">{customer.email}</td>
                  <td className="px-4 py-2 hidden md:table-cell text-sm">{customer.phone || 'N/A'}</td>
                  <td className="px-4 py-2 hidden lg:table-cell text-center">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                      {customer.orders?.length || 0}
                    </span>
                  </td>
                  <td className="px-4 py-2 hidden xl:table-cell text-sm">
                    {customer.createdAt ? formatDate(new Date(customer.createdAt)) : 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="text-blue-600 hover:text-blue-800 text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
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

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No customers found
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingId ? 'Edit Customer' : 'Add Customer'}
      >
        <div className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
