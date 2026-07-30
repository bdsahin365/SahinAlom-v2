/**
 * Admin Dashboard Data Service
 * Centralized API calls for all dashboard operations
 * Handles: products, orders, customers, blog posts, etc.
 */

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
}

interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'pending' | 'completed' | 'shipped' | 'cancelled';
  date: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
}

interface DashboardStats {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
}

interface Activity {
  icon: string;
  text: string;
  time: string;
}

// Mock data service - replace with actual API calls
class AdminDataService {
  private baseUrl = '/api';

  /**
   * Dashboard APIs
   */
  async getStats(): Promise<DashboardStats> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.baseUrl}/dashboard/stats`);
    // return response.json();
    return {
      revenue: 12459.80,
      orders: 284,
      customers: 156,
      products: 42,
    };
  }

  async getActivities(): Promise<Activity[]> {
    // TODO: Replace with actual API call
    return [
      { icon: '✅', text: 'Order #1234 shipped', time: '2 hours ago' },
      { icon: '👤', text: 'New customer joined', time: '5 hours ago' },
      { icon: '📦', text: 'Product updated', time: '1 day ago' },
    ];
  }

  /**
   * Product APIs
   */
  async getProducts(): Promise<Product[]> {
    // TODO: Replace with actual API call
    return [
      { id: '1', name: 'Premium Template', price: 99, stock: 15, status: 'active' },
      { id: '2', name: 'Design System', price: 149, stock: 8, status: 'active' },
      { id: '3', name: 'Development Course', price: 199, stock: 0, status: 'active' },
      { id: '4', name: 'Consultation Package', price: 299, stock: 20, status: 'draft' },
    ];
  }

  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    // TODO: Replace with actual API call
    return { id: Date.now().toString(), ...data };
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    // TODO: Replace with actual API call
    const products = await this.getProducts();
    return { ...products.find(p => p.id === id)!, ...data } as Product;
  }

  async deleteProduct(id: string): Promise<void> {
    // TODO: Replace with actual API call
    console.log(`Deleted product ${id}`);
  }

  /**
   * Order APIs
   */
  async getOrders(): Promise<Order[]> {
    // TODO: Replace with actual API call
    return [
      { id: '#ORD001', customer: 'John Doe', total: 299.99, status: 'completed', date: '2024-01-15' },
      { id: '#ORD002', customer: 'Jane Smith', total: 149.99, status: 'shipped', date: '2024-01-14' },
      { id: '#ORD003', customer: 'Bob Johnson', total: 449.99, status: 'pending', date: '2024-01-13' },
      { id: '#ORD004', customer: 'Alice Brown', total: 99.99, status: 'completed', date: '2024-01-12' },
    ];
  }

  async getOrderById(id: string): Promise<Order | null> {
    // TODO: Replace with actual API call
    const orders = await this.getOrders();
    return orders.find(o => o.id === id) || null;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    // TODO: Replace with actual API call
    const order = await this.getOrderById(id);
    if (!order) throw new Error('Order not found');
    return { ...order, status };
  }

  /**
   * Customer APIs
   */
  async getCustomers(): Promise<Customer[]> {
    // TODO: Replace with actual API call
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com', orders: 5, totalSpent: 899.99, joinDate: '2023-06-15' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', orders: 3, totalSpent: 449.99, joinDate: '2023-08-20' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', orders: 1, totalSpent: 99.99, joinDate: '2024-01-10' },
      { id: '4', name: 'Alice Brown', email: 'alice@example.com', orders: 7, totalSpent: 1299.99, joinDate: '2023-05-01' },
    ];
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    // TODO: Replace with actual API call
    const customers = await this.getCustomers();
    return customers.find(c => c.id === id) || null;
  }

  async deleteCustomer(id: string): Promise<void> {
    // TODO: Replace with actual API call
    console.log(`Deleted customer ${id}`);
  }

  /**
   * Search/Filter APIs
   */
  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async searchOrders(query: string): Promise<Order[]> {
    const orders = await this.getOrders();
    return orders.filter(o =>
      o.id.includes(query) || o.customer.toLowerCase().includes(query.toLowerCase())
    );
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const customers = await this.getCustomers();
    return customers.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Bulk Operations
   */
  async deleteMultipleProducts(ids: string[]): Promise<void> {
    // TODO: Replace with actual API call
    console.log(`Deleted products: ${ids.join(', ')}`);
  }

  async updateMultipleOrdersStatus(ids: string[], status: Order['status']): Promise<void> {
    // TODO: Replace with actual API call
    console.log(`Updated orders ${ids.join(', ')} to ${status}`);
  }

  /**
   * Export APIs
   */
  async exportProducts(format: 'csv' | 'json' = 'csv'): Promise<string> {
    const products = await this.getProducts();
    if (format === 'json') {
      return JSON.stringify(products, null, 2);
    }
    // CSV format
    const headers = ['ID', 'Name', 'Price', 'Stock', 'Status'];
    const rows = products.map(p => [p.id, p.name, p.price, p.stock, p.status]);
    return [headers, ...rows].map(r => r.join(',')).join('\n');
  }

  async exportOrders(format: 'csv' | 'json' = 'csv'): Promise<string> {
    const orders = await this.getOrders();
    if (format === 'json') {
      return JSON.stringify(orders, null, 2);
    }
    // CSV format
    const headers = ['ID', 'Customer', 'Total', 'Status', 'Date'];
    const rows = orders.map(o => [o.id, o.customer, o.total, o.status, o.date]);
    return [headers, ...rows].map(r => r.join(',')).join('\n');
  }
}

// Export singleton instance
export const adminDataService = new AdminDataService();

// Export types
export type { Product, Order, Customer, DashboardStats, Activity };
