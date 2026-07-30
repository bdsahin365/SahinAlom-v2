/**
 * Centralized Data Service Layer
 * Handles all API communication with standardized request/response patterns
 * Provides CRUD operations for all entities
 */

import { Product, OrderInvoice, Customer, BlogPost, CaseStudy } from '@/types';
import { fetchWithErrorHandling } from '@/utils/api';
import { API_ENDPOINTS } from '@/config';

/**
 * Generic API service for CRUD operations
 */
export class DataService {
  /**
   * Fetch all products
   */
  static async getProducts(): Promise<Product[]> {
    const response = await fetchWithErrorHandling<Product[]>(
      API_ENDPOINTS.PRODUCTS
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch products');
    }
    return response.data || [];
  }

  /**
   * Get single product by ID
   */
  static async getProduct(id: string): Promise<Product | null> {
    const response = await fetchWithErrorHandling<Product>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch product');
    }
    return response.data || null;
  }

  /**
   * Create new product
   */
  static async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await fetchWithErrorHandling<Product>(
      API_ENDPOINTS.PRODUCTS,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to create product');
    }
    return response.data as Product;
  }

  /**
   * Update existing product
   */
  static async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await fetchWithErrorHandling<Product>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to update product');
    }
    return response.data as Product;
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string): Promise<void> {
    const response = await fetchWithErrorHandling(
      `${API_ENDPOINTS.PRODUCTS}/${id}`,
      { method: 'DELETE' }
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete product');
    }
  }

  /**
   * Fetch all orders
   */
  static async getOrders(): Promise<OrderInvoice[]> {
    const response = await fetchWithErrorHandling<OrderInvoice[]>(
      API_ENDPOINTS.ORDERS
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch orders');
    }
    return response.data || [];
  }

  /**
   * Get single order by ID
   */
  static async getOrder(id: string): Promise<OrderInvoice | null> {
    const response = await fetchWithErrorHandling<OrderInvoice>(
      `${API_ENDPOINTS.ORDERS}/${id}`
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch order');
    }
    return response.data || null;
  }

  /**
   * Create new order
   */
  static async createOrder(data: Partial<OrderInvoice>): Promise<OrderInvoice> {
    const response = await fetchWithErrorHandling<OrderInvoice>(
      API_ENDPOINTS.ORDERS,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to create order');
    }
    return response.data as OrderInvoice;
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    id: string,
    status: 'pending' | 'completed'
  ): Promise<OrderInvoice> {
    return this.updateOrder(id, { status });
  }

  /**
   * Update existing order
   */
  static async updateOrder(id: string, data: Partial<OrderInvoice>): Promise<OrderInvoice> {
    const response = await fetchWithErrorHandling<OrderInvoice>(
      `${API_ENDPOINTS.ORDERS}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to update order');
    }
    return response.data as OrderInvoice;
  }

  /**
   * Delete order
   */
  static async deleteOrder(id: string): Promise<void> {
    const response = await fetchWithErrorHandling(
      `${API_ENDPOINTS.ORDERS}/${id}`,
      { method: 'DELETE' }
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete order');
    }
  }

  /**
   * Fetch all customers
   */
  static async getCustomers(): Promise<Customer[]> {
    const response = await fetchWithErrorHandling<Customer[]>(
      API_ENDPOINTS.CUSTOMERS
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch customers');
    }
    return response.data || [];
  }

  /**
   * Get single customer by ID
   */
  static async getCustomer(id: string): Promise<Customer | null> {
    const response = await fetchWithErrorHandling<Customer>(
      `${API_ENDPOINTS.CUSTOMERS}/${id}`
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch customer');
    }
    return response.data || null;
  }

  /**
   * Create new customer
   */
  static async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const response = await fetchWithErrorHandling<Customer>(
      API_ENDPOINTS.CUSTOMERS,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to create customer');
    }
    return response.data as Customer;
  }

  /**
   * Update existing customer
   */
  static async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const response = await fetchWithErrorHandling<Customer>(
      `${API_ENDPOINTS.CUSTOMERS}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to update customer');
    }
    return response.data as Customer;
  }

  /**
   * Delete customer
   */
  static async deleteCustomer(id: string): Promise<void> {
    const response = await fetchWithErrorHandling(
      `${API_ENDPOINTS.CUSTOMERS}/${id}`,
      { method: 'DELETE' }
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete customer');
    }
  }

  /**
   * Fetch all blog posts
   */
  static async getBlogPosts(): Promise<BlogPost[]> {
    const response = await fetchWithErrorHandling<BlogPost[]>(
      API_ENDPOINTS.BLOG
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch blog posts');
    }
    return response.data || [];
  }

  /**
   * Get single blog post by ID or slug
   */
  static async getBlogPost(idOrSlug: string): Promise<BlogPost | null> {
    const response = await fetchWithErrorHandling<BlogPost>(
      `${API_ENDPOINTS.BLOG}/${idOrSlug}`
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch blog post');
    }
    return response.data || null;
  }

  /**
   * Fetch all case studies
   */
  static async getCaseStudies(): Promise<CaseStudy[]> {
    const response = await fetchWithErrorHandling<CaseStudy[]>(
      API_ENDPOINTS.CASE_STUDIES
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch case studies');
    }
    return response.data || [];
  }

  /**
   * Get single case study by ID or slug
   */
  static async getCaseStudy(idOrSlug: string): Promise<CaseStudy | null> {
    const response = await fetchWithErrorHandling<CaseStudy>(
      `${API_ENDPOINTS.CASE_STUDIES}/${idOrSlug}`
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch case study');
    }
    return response.data || null;
  }

  /**
   * Search products by query
   */
  static async searchProducts(query: string): Promise<Product[]> {
    const response = await fetchWithErrorHandling<Product[]>(
      `${API_ENDPOINTS.PRODUCTS}/search?q=${encodeURIComponent(query)}`
    );
    if (!response.success) {
      throw new Error(response.error || 'Search failed');
    }
    return response.data || [];
  }

  /**
   * Bulk delete products
   */
  static async bulkDeleteProducts(ids: string[]): Promise<void> {
    const response = await fetchWithErrorHandling(
      `${API_ENDPOINTS.PRODUCTS}/bulk-delete`,
      {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.success) {
      throw new Error(response.error || 'Bulk delete failed');
    }
  }

  /**
   * Export data to CSV
   */
  static async exportToCSV(
    type: 'products' | 'orders' | 'customers'
  ): Promise<Blob> {
    const endpoint =
      type === 'products'
        ? `${API_ENDPOINTS.PRODUCTS}/export`
        : type === 'orders'
        ? `${API_ENDPOINTS.ORDERS}/export`
        : `${API_ENDPOINTS.CUSTOMERS}/export`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to export ${type}`);
    }
    return response.blob();
  }
}

export default DataService;
