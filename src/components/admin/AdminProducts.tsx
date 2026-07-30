import React, { useState, useMemo } from 'react';
import { Product, CaseStudy } from '@/types';
import { Button, Input, Card, Alert, Modal } from '@/shared';
import { formatDate } from '@/utils/formatters';
import { validateRequired } from '@/utils/validators';

interface AdminProductsProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function AdminProducts({
  products,
  onAdd,
  onUpdate,
  onDelete,
}: AdminProductsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [products, searchTerm, sortBy]);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({});
    setIsAddModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsAddModalOpen(true);
  };

  const handleSave = () => {
    try {
      if (!formData.name) {
        setError('Product name is required');
        return;
      }

      if (editingId) {
        onUpdate(formData as Product);
      } else {
        onAdd({
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date(),
        } as Product);
      }

      setIsAddModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Product
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

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-2 hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 font-medium truncate">{product.name}</td>
                  <td className="px-4 py-2 hidden sm:table-cell text-sm">{product.category || 'N/A'}</td>
                  <td className="px-4 py-2 hidden md:table-cell text-sm">
                    {product.createdAt ? formatDate(new Date(product.createdAt)) : 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingId ? 'Edit Product' : 'Add Product'}
      >
        <div className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Product category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              rows={3}
              placeholder="Product description"
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
