/**
 * Centralized configuration for the entire application.
 * This is the single source of truth for app metadata, endpoints, and settings.
 */

// Feature flags
export const FEATURES = {
  DARK_MODE: true,
  ADMIN_PANEL: true,
  CASE_STUDIES: true,
  BLOG_SYSTEM: true,
  TOOLS: true,
  CONTACT_FORM: true,
  DAILY_CHECK: true,
  OFFLINE_MODE: false,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  HOMEPAGE: '/api/homepage',
  CASE_STUDIES: '/api/case-studies',
  BLOG_POSTS: '/api/blog-posts',
  SETTINGS: '/api/settings',
  PROFILE: '/api/profile',
  PRODUCTS: '/api/products',
  CUSTOMERS: '/api/customers',
  ORDERS: '/api/orders',
  OFFICE_NOTES: '/api/office-notes',
  MAINTENANCE_LOGS: '/api/maintenance-logs',
  FIELD_NOTES: '/api/field-notes',
  CONTACT_MESSAGES: '/api/contact-messages',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  CASE_STUDIES: 'sahin_case_studies',
  HOMEPAGE_CONTENT: 'sahin_homepage_content',
  PORTFOLIO_SETTINGS: 'sahin_portfolio_settings',
  PROFILE_DATA: 'sahin_profile_data',
  BLOG_POSTS: 'sahin_blog_posts',
  PRODUCTS: 'sahin_products',
  CUSTOMERS: 'sahin_customers',
  ORDERS: 'sahin_orders',
  OFFICE_NOTES: 'sahin_office_notes',
  MAINTENANCE_LOGS: 'sahin_maintenance_logs',
  FIELD_NOTES: 'sahin_field_notes',
  MESSAGES: 'sahin_portfolio_messages',
  THEME: 'sahin_theme',
} as const;

// Color tokens for theming
export const COLORS = {
  light: {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#ec4899',
    muted: '#f3f4f6',
    mutedForeground: '#6b7280',
    border: '#e5e7eb',
    ring: '#3b82f6',
    destructive: '#ef4444',
  },
  dark: {
    background: '#0f172a',
    foreground: '#f8fafc',
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#ec4899',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    border: '#334155',
    ring: '#3b82f6',
    destructive: '#ef4444',
  },
} as const;

// Spacing scale (4px base)
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Navigation menu structure
export const NAVIGATION = [
  { id: 'home', label: 'Home', view: 'home', icon: 'Home' },
  { id: 'case-studies', label: 'Case Studies', view: 'case-studies', icon: 'Briefcase' },
  { id: 'blogs', label: 'Blogs', view: 'blogs', icon: 'BookOpen' },
  { id: 'tools', label: 'Tools', view: 'tools', icon: 'Zap' },
  { id: 'resume', label: 'Resume', view: 'resume', icon: 'FileText' },
  { id: 'biodata', label: 'Biodata', view: 'biodata', icon: 'User' },
  { id: 'contact', label: 'Contact', view: 'home', section: 'contact', icon: 'Mail' },
] as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  FETCH_ERROR: 'Failed to fetch data. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SAVE_ERROR: 'Failed to save changes. Please try again.',
  DELETE_ERROR: 'Failed to delete item. Please try again.',
  INVALID_FORM: 'Please fill in all required fields.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 5MB.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  SERVER_ERROR: 'Server error. Please contact support.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Changes saved successfully.',
  DELETE_SUCCESS: 'Item deleted successfully.',
  CREATE_SUCCESS: 'Item created successfully.',
  UPLOAD_SUCCESS: 'File uploaded successfully.',
  FORM_SUBMITTED: 'Your message has been sent successfully.',
} as const;

// Form configurations
export const FORM_DEFAULTS = {
  DEBOUNCE_MS: 300,
  VALIDATION_TIMEOUT_MS: 5000,
  SUBMIT_TIMEOUT_MS: 10000,
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT_MS: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

// Image configuration
export const IMAGE_CONFIG = {
  MAX_SIZE_MB: 5,
  MAX_WIDTH_PX: 1200,
  MAX_HEIGHT_PX: 1200,
  QUALITY: 0.78,
  FORMATS: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
} as const;

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
} as const;
