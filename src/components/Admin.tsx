'use client';

import React from 'react';
import { AdminContainer } from './admin';

/**
 * Main Admin Component - Modern Dashboard
 * 
 * This is a complete redesign of the admin panel with:
 * - Clean, modern UI with professional dark theme
 * - Collapsible sidebar navigation
 * - Modular tab-based architecture
 * - Responsive grid layouts
 * - Real-time data management
 * - Dark mode support
 * 
 * The component is split into:
 * - AdminLayout: Main container with sidebar and header
 * - Individual tab components for each section
 * - Reusable UI components from shared library
 */
export default function Admin() {
  return <AdminContainer />;
}
