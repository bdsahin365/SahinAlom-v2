import React from 'react';

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
}

const stats: StatCard[] = [
  { label: 'Total Revenue', value: '$12,459.80', change: '+12.5%', icon: '💰' },
  { label: 'Orders', value: 284, change: '+8.2%', icon: '🛒' },
  { label: 'Customers', value: 156, change: '+4.1%', icon: '👥' },
  { label: 'Products', value: 42, icon: '📦' },
];

export default function DashboardTab() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                {stat.change && (
                  <p className="text-emerald-500 text-xs mt-2">{stat.change}</p>
                )}
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
          <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
            <span>📊 Chart Placeholder</span>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { icon: '✅', text: 'Order #1234 shipped', time: '2 hours ago' },
              { icon: '👤', text: 'New customer joined', time: '5 hours ago' },
              { icon: '📦', text: 'Product updated', time: '1 day ago' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-200">{item.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
