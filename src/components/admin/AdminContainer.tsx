'use client';

import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import DashboardTab from './tabs/DashboardTab';
import ProductsTab from './tabs/ProductsTab';
import OrdersTab from './tabs/OrdersTab';
import CustomersTab from './tabs/CustomersTab';
import BlogTab from './tabs/BlogTab';

export default function AdminContainer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'products':
        return <ProductsTab />;
      case 'orders':
        return <OrdersTab />;
      case 'customers':
        return <CustomersTab />;
      case 'blog':
        return <BlogTab />;
      case 'pages':
        return <div className="text-slate-400">Pages management coming soon...</div>;
      case 'resume':
        return <div className="text-slate-400">Resume editor coming soon...</div>;
      case 'messages':
        return <div className="text-slate-400">Messages inbox coming soon...</div>;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </AdminLayout>
  );
}
