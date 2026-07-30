'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'orders', label: 'Orders', icon: '🛒' },
  { id: 'customers', label: 'Customers', icon: '👥' },
  { id: 'blog', label: 'Blog', icon: '✍️' },
  { id: 'pages', label: 'Pages', icon: '📄' },
  { id: 'resume', label: 'Resume', icon: '📋' },
  { id: 'messages', label: 'Messages', icon: '💬' },
];

export default function AdminLayout({
  children,
  activeTab,
  onTabChange,
}: AdminLayoutProps) {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-950 dark:bg-slate-950">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 dark:bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-white font-display">Admin</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 dark:bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-800'
              }`}
              title={tab.label}
            >
              <span className="text-lg">{tab.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{tab.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-900 border-b border-slate-800 px-8 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white font-display">
              {tabs.find((t) => t.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" aria-label="Search">
                🔍
              </button>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" aria-label="Settings">
                ⚙️
              </button>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                SA
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
