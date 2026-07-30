/**
 * Global Data Context
 * Manages shared application state for products, orders, customers
 * Provides centralized caching and state management
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, OrderInvoice, Customer } from '@/types';
import { DataService } from '@/services/dataService';

interface DataContextType {
  // Products
  products: Product[];
  loadingProducts: boolean;
  errorProducts: Error | null;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Orders
  orders: OrderInvoice[];
  loadingOrders: boolean;
  errorOrders: Error | null;
  refreshOrders: () => Promise<void>;
  addOrder: (order: OrderInvoice) => void;
  updateOrder: (order: OrderInvoice) => void;
  deleteOrder: (id: string) => void;

  // Customers
  customers: Customer[];
  loadingCustomers: boolean;
  errorCustomers: Error | null;
  refreshCustomers: () => Promise<void>;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;

  // Refresh all data
  refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Data Provider - Wraps the app to provide centralized data management
 */
export function DataProvider({ children }: { children: React.ReactNode }) {
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState<Error | null>(null);

  // Orders state
  const [orders, setOrders] = useState<OrderInvoice[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState<Error | null>(null);

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [errorCustomers, setErrorCustomers] = useState<Error | null>(null);

  // Product operations
  const refreshProducts = useCallback(async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const data = await DataService.getProducts();
      setProducts(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setErrorProducts(err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? product : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Order operations
  const refreshOrders = useCallback(async () => {
    setLoadingOrders(true);
    setErrorOrders(null);
    try {
      const data = await DataService.getOrders();
      setOrders(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setErrorOrders(err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const addOrder = useCallback((order: OrderInvoice) => {
    setOrders((prev) => [...prev, order]);
  }, []);

  const updateOrder = useCallback((order: OrderInvoice) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? order : o))
    );
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  // Customer operations
  const refreshCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    setErrorCustomers(null);
    try {
      const data = await DataService.getCustomers();
      setCustomers(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setErrorCustomers(err);
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  const addCustomer = useCallback((customer: Customer) => {
    setCustomers((prev) => [...prev, customer]);
  }, []);

  const updateCustomer = useCallback((customer: Customer) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? customer : c))
    );
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshProducts(),
      refreshOrders(),
      refreshCustomers(),
    ]);
  }, [refreshProducts, refreshOrders, refreshCustomers]);

  const value: DataContextType = {
    products,
    loadingProducts,
    errorProducts,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,

    orders,
    loadingOrders,
    errorOrders,
    refreshOrders,
    addOrder,
    updateOrder,
    deleteOrder,

    customers,
    loadingCustomers,
    errorCustomers,
    refreshCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,

    refreshAll,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * Hook to use data context
 */
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

/**
 * Hook to use only product data
 */
export function useProducts() {
  const context = useData();
  return {
    products: context.products,
    loading: context.loadingProducts,
    error: context.errorProducts,
    refresh: context.refreshProducts,
    add: context.addProduct,
    update: context.updateProduct,
    delete: context.deleteProduct,
  };
}

/**
 * Hook to use only order data
 */
export function useOrders() {
  const context = useData();
  return {
    orders: context.orders,
    loading: context.loadingOrders,
    error: context.errorOrders,
    refresh: context.refreshOrders,
    add: context.addOrder,
    update: context.updateOrder,
    delete: context.deleteOrder,
  };
}

/**
 * Hook to use only customer data
 */
export function useCustomers() {
  const context = useData();
  return {
    customers: context.customers,
    loading: context.loadingCustomers,
    error: context.errorCustomers,
    refresh: context.refreshCustomers,
    add: context.addCustomer,
    update: context.updateCustomer,
    delete: context.deleteCustomer,
  };
}
