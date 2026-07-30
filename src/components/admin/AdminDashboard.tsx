/**
 * Admin Dashboard - Main container component
 * Manages tab navigation and orchestrates all admin sections
 * 
 * Refactored from 8600-line monolith into modular sections
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  ShoppingBag,
  Receipt,
  StickyNote,
  Wrench,
  MessageSquare,
  Settings as SettingsIcon,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/UIContext';

type AdminTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'customers'
  | 'blog'
  | 'notes'
  | 'maintenance'
  | 'pages'
  | 'posts'
  | 'resume'
  | 'messages'
  | 'settings';

interface AdminTab {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
}

const ADMIN_TABS: AdminTab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'products', label: 'Products', icon: <ShoppingBag size={20} /> },
  { id: 'orders', label: 'Orders', icon: <Receipt size={20} /> },
  { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
  { id: 'blog', label: 'Blog', icon: <BookOpen size={20} /> },
  { id: 'notes', label: 'Office Notes', icon: <StickyNote size={20} /> },
  { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={20} /> },
  { id: 'pages', label: 'Pages', icon: <FileText size={20} /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
];

export interface AdminDashboardProps {
  onNavigate?: (view: string) => void;
}

/**
 * Main Admin Dashboard Container
 * Handles tab switching and renders appropriate sections
 */
export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (typeof localStorage === 'undefined') return 'dashboard';
    const saved = localStorage.getItem('sahin_admin_active_tab');
    if (saved && ADMIN_TABS.some(t => t.id === saved)) {
      return saved as AdminTab;
    }
    return 'dashboard';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { showToast } = useToast();

  // Persist tab selection
  useEffect(() => {
    localStorage.setItem('sahin_admin_active_tab', activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950' : 'bg-white'}`}>
      {/* Admin Header */}
      <header
        className={`border-b ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard
              size={24}
              className={darkMode ? 'text-amber-500' : 'text-blue-600'}
            />
            <h1
              className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Admin Panel
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 ${
            darkMode
              ? 'bg-zinc-900 border-r border-zinc-800'
              : 'bg-gray-50 border-r border-gray-200'
          } p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto`}
        >
          {ADMIN_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? darkMode
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                  : darkMode
                  ? 'text-gray-400 hover:bg-zinc-800/50'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <main
          className={`flex-1 p-4 md:p-8 overflow-auto max-h-[calc(100vh-80px)] ${
            darkMode ? 'bg-zinc-950' : 'bg-white'
          }`}
        >
          {/* Tab content will be rendered here */}
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'blog' && <BlogTab />}
          {activeTab === 'notes' && <NotesTab />}
          {activeTab === 'maintenance' && <MaintenanceTab />}
          {activeTab === 'pages' && <PagesTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

// Placeholder tab components - will be extracted to separate files
function DashboardTab() {
  return <div className="text-gray-500">Dashboard coming soon...</div>;
}

function ProductsTab() {
  return <div className="text-gray-500">Products tab coming soon...</div>;
}

function OrdersTab() {
  return <div className="text-gray-500">Orders tab coming soon...</div>;
}

function CustomersTab() {
  return <div className="text-gray-500">Customers tab coming soon...</div>;
}

function BlogTab() {
  return <div className="text-gray-500">Blog tab coming soon...</div>;
}

function NotesTab() {
  return <div className="text-gray-500">Notes tab coming soon...</div>;
}

function MaintenanceTab() {
  return <div className="text-gray-500">Maintenance tab coming soon...</div>;
}

function PagesTab() {
  return <div className="text-gray-500">Pages tab coming soon...</div>;
}

function MessagesTab() {
  return <div className="text-gray-500">Messages tab coming soon...</div>;
}

function SettingsTab() {
  return <div className="text-gray-500">Settings tab coming soon...</div>;
}

export default AdminDashboard;
