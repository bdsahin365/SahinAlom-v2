import React, { useState } from 'react';
import { Input, Button } from '../../shared';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  status: 'published' | 'draft';
  date: string;
}

const mockPosts: BlogPost[] = [
  { id: '1', title: 'Getting Started with React', author: 'You', status: 'published', date: '2024-01-10' },
  { id: '2', title: 'Advanced TypeScript Patterns', author: 'You', status: 'published', date: '2024-01-05' },
  { id: '3', title: 'Dashboard Design Best Practices', author: 'You', status: 'draft', date: '2024-01-15' },
];

export default function BlogTab() {
  const [posts] = useState<BlogPost[]>(mockPosts);
  const [search, setSearch] = useState('');

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
          />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + New Post
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                <p className="text-slate-400 text-sm mt-2">By {post.author} • {post.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    post.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {post.status}
                </span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">No posts found</div>
      )}
    </div>
  );
}
