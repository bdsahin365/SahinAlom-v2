/**
 * Validation schemas for admin dashboard data types
 * Ensures type safety and runtime validation of all data
 */

// Product Validation
export interface ProductInput {
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
}

export function validateProductInput(data: any): ProductInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Product data must be an object');
  }

  const { name, price, stock, status } = data;

  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Product name is required and must be a string');
  }

  if (typeof price !== 'number' || price < 0) {
    throw new Error('Product price must be a positive number');
  }

  if (typeof stock !== 'number' || stock < 0) {
    throw new Error('Product stock must be a non-negative number');
  }

  const validStatuses = ['active', 'draft', 'archived'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Product status must be one of: ${validStatuses.join(', ')}`);
  }

  return { name: name.trim(), price, stock, status: status as ProductInput['status'] };
}

// Order Validation
export interface OrderInput {
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
  notes?: string;
}

export function validateOrderInput(data: any): OrderInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Order data must be an object');
  }

  const { customerId, items, notes } = data;

  if (typeof customerId !== 'string' || customerId.trim().length === 0) {
    throw new Error('Customer ID is required');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order must have at least one item');
  }

  for (const item of items) {
    if (typeof item.productId !== 'string' || item.productId.trim().length === 0) {
      throw new Error('Each item must have a valid product ID');
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new Error('Item quantity must be a positive number');
    }
  }

  return {
    customerId: customerId.trim(),
    items,
    notes: notes ? String(notes).trim() : undefined,
  };
}

// Customer Validation
export interface CustomerInput {
  name: string;
  email: string;
  phone?: string;
}

export function validateCustomerInput(data: any): CustomerInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Customer data must be an object');
  }

  const { name, email, phone } = data;

  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Customer name is required');
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    throw new Error('Valid email address is required');
  }

  if (phone && typeof phone !== 'string') {
    throw new Error('Phone number must be a string');
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : undefined,
  };
}

// Search Query Validation
export interface SearchQuery {
  query: string;
  limit?: number;
  offset?: number;
}

export function validateSearchQuery(data: any): SearchQuery {
  if (!data || typeof data !== 'object') {
    throw new Error('Search query must be an object');
  }

  let { query, limit = 50, offset = 0 } = data;

  if (typeof query !== 'string') {
    throw new Error('Search query must be a string');
  }

  query = query.trim();

  if (query.length === 0) {
    throw new Error('Search query cannot be empty');
  }

  if (typeof limit !== 'number' || limit < 1 || limit > 1000) {
    throw new Error('Limit must be between 1 and 1000');
  }

  if (typeof offset !== 'number' || offset < 0) {
    throw new Error('Offset must be a non-negative number');
  }

  return { query, limit, offset };
}

// Bulk Operation Validation
export interface BulkDeleteInput {
  ids: string[];
  type: 'product' | 'order' | 'customer';
}

export function validateBulkDeleteInput(data: any): BulkDeleteInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Bulk delete data must be an object');
  }

  const { ids, type } = data;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('IDs array must not be empty');
  }

  for (const id of ids) {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('All IDs must be non-empty strings');
    }
  }

  const validTypes = ['product', 'order', 'customer'];
  if (!validTypes.includes(type)) {
    throw new Error(`Type must be one of: ${validTypes.join(', ')}`);
  }

  return { ids: ids.map(id => id.trim()), type: type as BulkDeleteInput['type'] };
}

// Export Validation
export interface ExportInput {
  type: 'product' | 'order' | 'customer';
  format: 'csv' | 'json';
  filters?: Record<string, any>;
}

export function validateExportInput(data: any): ExportInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Export data must be an object');
  }

  const { type, format, filters } = data;

  const validTypes = ['product', 'order', 'customer'];
  if (!validTypes.includes(type)) {
    throw new Error(`Export type must be one of: ${validTypes.join(', ')}`);
  }

  const validFormats = ['csv', 'json'];
  if (!validFormats.includes(format)) {
    throw new Error(`Export format must be one of: ${validFormats.join(', ')}`);
  }

  return {
    type: type as ExportInput['type'],
    format: format as ExportInput['format'],
    filters: filters ? (typeof filters === 'object' ? filters : {}) : undefined,
  };
}

// Combined validation wrapper
export function validateAdminInput(
  dataType: string,
  data: any
): any {
  switch (dataType) {
    case 'product':
      return validateProductInput(data);
    case 'order':
      return validateOrderInput(data);
    case 'customer':
      return validateCustomerInput(data);
    case 'search':
      return validateSearchQuery(data);
    case 'bulkDelete':
      return validateBulkDeleteInput(data);
    case 'export':
      return validateExportInput(data);
    default:
      throw new Error(`Unknown data type: ${dataType}`);
  }
}
