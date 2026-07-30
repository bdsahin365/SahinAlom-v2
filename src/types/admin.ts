/**
 * Type definitions for admin dashboard
 * Ensures type safety across all components
 */

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = 'active' | 'draft' | 'archived';

// Order Types
export interface Order {
  id: string;
  customerId: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'completed' | 'shipped' | 'cancelled';

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
  lastOrderDate?: string;
  status: CustomerStatus;
}

export type CustomerStatus = 'active' | 'inactive' | 'blocked';

// Dashboard Types
export interface DashboardStats {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
}

export interface Activity {
  id: string;
  icon: string;
  text: string;
  time: string;
  type: ActivityType;
}

export type ActivityType = 'order' | 'customer' | 'product' | 'system';

// Blog Types (for future use)
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter and Sort Types
export interface FilterOptions {
  status?: string | string[];
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  [key: string]: any;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Form State Types
export interface FormState<T> {
  data: Partial<T>;
  isSubmitting: boolean;
  error: string | null;
  touched: Set<keyof T>;
}

// Hook Return Types
export interface UseDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

export interface UseFormReturn<T> {
  formState: FormState<T>;
  setValue: (field: keyof T, value: any) => void;
  setTouched: (field: keyof T) => void;
  handleSubmit: (onSubmit: (data: T) => Promise<void>) => Promise<void>;
  reset: () => void;
  errors: Record<keyof T, string | undefined>;
}

// Type Guards
export function isProduct(value: any): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.price === 'number' &&
    typeof value.stock === 'number'
  );
}

export function isOrder(value: any): value is Order {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.customer === 'string' &&
    typeof value.total === 'number' &&
    typeof value.date === 'string'
  );
}

export function isCustomer(value: any): value is Customer {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string'
  );
}

export function isProductStatus(value: any): value is ProductStatus {
  return ['active', 'draft', 'archived'].includes(value);
}

export function isOrderStatus(value: any): value is OrderStatus {
  return ['pending', 'completed', 'shipped', 'cancelled'].includes(value);
}

export function isCustomerStatus(value: any): value is CustomerStatus {
  return ['active', 'inactive', 'blocked'].includes(value);
}

// Array type guards
export function isProductArray(value: any): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

export function isOrderArray(value: any): value is Order[] {
  return Array.isArray(value) && value.every(isOrder);
}

export function isCustomerArray(value: any): value is Customer[] {
  return Array.isArray(value) && value.every(isCustomer);
}
