import React, { useState } from 'react';
import { Button, Input, Modal } from '../../shared';
import { Product } from '@/types/admin';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Partial<Product>) => Promise<void>;
  initialData?: Product;
  isLoading?: boolean;
}

export function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || { name: '', price: 0, stock: 0, status: 'active' }
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validation
      if (!formData.name?.trim()) {
        throw new Error('Product name is required');
      }
      if ((formData.price || 0) < 0) {
        throw new Error('Price must be non-negative');
      }
      if ((formData.stock || 0) < 0) {
        throw new Error('Stock must be non-negative');
      }

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Product' : 'Add Product'}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Product Name *
          </label>
          <Input
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter product name"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Price ($) *
            </label>
            <Input
              type="number"
              value={formData.price || 0}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              placeholder="0.00"
              disabled={isSubmitting}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Stock *
            </label>
            <Input
              type="number"
              value={formData.stock || 0}
              onChange={(e) => handleChange('stock', parseInt(e.target.value))}
              placeholder="0"
              disabled={isSubmitting}
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Status
          </label>
          <select
            value={formData.status || 'active'}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
