import React from 'react';

/**
 * Loading skeleton components for smooth loading states
 */

export function StatCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-slate-700 rounded w-24 mb-3" />
          <div className="h-8 bg-slate-700 rounded w-20" />
          <div className="h-3 bg-slate-700 rounded w-16 mt-2" />
        </div>
        <div className="w-12 h-12 bg-slate-700 rounded" />
      </div>
    </div>
  );
}

export function StatGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-32 mb-6" />
      <div className="h-64 bg-slate-800 rounded flex items-center justify-center">
        <div className="space-y-4 w-full">
          <div className="h-4 bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-700 rounded w-3/4" />
          <div className="h-4 bg-slate-700 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-800 animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-24" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-20" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-16" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-20" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-16" /></td>
    </tr>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="text-left px-6 py-3"><div className="h-4 bg-slate-700 rounded w-20" /></th>
              <th className="text-left px-6 py-3"><div className="h-4 bg-slate-700 rounded w-20" /></th>
              <th className="text-left px-6 py-3"><div className="h-4 bg-slate-700 rounded w-20" /></th>
              <th className="text-left px-6 py-3"><div className="h-4 bg-slate-700 rounded w-20" /></th>
              <th className="text-left px-6 py-3"><div className="h-4 bg-slate-700 rounded w-20" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ActivityListSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-32 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-slate-700 rounded flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-slate-700 rounded w-48 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
