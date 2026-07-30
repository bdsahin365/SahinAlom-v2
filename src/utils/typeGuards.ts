/**
 * Type guards and runtime validators for all application types.
 * Ensures data from API/storage is valid at runtime.
 */

import type {
  CaseStudy,
  ContactMessage,
  ProfileData,
  HomepageContent,
  AppSettings,
  BlogPost,
  Customer,
  ProductItem,
  OrderItem,
  OrderInvoice,
  OfficeNote,
  MaintenanceLog,
  QuickFieldNote,
} from '../types';

/**
 * Case Study type guard
 */
export function isCaseStudy(value: unknown): value is CaseStudy {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.category === 'string' &&
    Array.isArray(obj.tags) &&
    typeof obj.shortDesc === 'string' &&
    typeof obj.problem === 'string' &&
    typeof obj.solution === 'string' &&
    Array.isArray(obj.results)
  );
}

/**
 * Contact Message type guard
 */
export function isContactMessage(value: unknown): value is ContactMessage {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.message === 'string' &&
    typeof obj.date === 'string'
  );
}

/**
 * Profile Data type guard
 */
export function isProfileData(value: unknown): value is ProfileData {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.name === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.phone === 'string' &&
    Array.isArray(obj.experience) &&
    Array.isArray(obj.education) &&
    typeof obj.personalDetails === 'object'
  );
}

/**
 * Homepage Content type guard
 */
export function isHomepageContent(value: unknown): value is HomepageContent {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.heroTagline === 'string' &&
    typeof obj.heroHeading === 'string' &&
    typeof obj.heroSubheading === 'string' &&
    typeof obj.expertiseTagline === 'string' &&
    typeof obj.journalTagline === 'string'
  );
}

/**
 * App Settings type guard
 */
export function isAppSettings(value: unknown): value is AppSettings {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.showBottomNav === 'boolean' &&
    (obj.defaultTheme === 'dark' || obj.defaultTheme === 'light')
  );
}

/**
 * Blog Post type guard
 */
export function isBlogPost(value: unknown): value is BlogPost {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.readTime === 'string' &&
    typeof obj.summary === 'string' &&
    typeof obj.content === 'string' &&
    Array.isArray(obj.tags) &&
    typeof obj.published === 'boolean'
  );
}

/**
 * Customer type guard
 */
export function isCustomer(value: unknown): value is Customer {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.phone === 'string' &&
    typeof obj.address === 'string' &&
    typeof obj.totalOrders === 'number'
  );
}

/**
 * Product Item type guard
 */
export function isProductItem(value: unknown): value is ProductItem {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.unit === 'string' &&
    typeof obj.stockStatus === 'string'
  );
}

/**
 * Order Item type guard
 */
export function isOrderItem(value: unknown): value is OrderItem {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.productId === 'string' &&
    typeof obj.productName === 'string' &&
    typeof obj.quantity === 'number' &&
    typeof obj.unit === 'string' &&
    typeof obj.pricePerUnit === 'number' &&
    typeof obj.totalPrice === 'number'
  );
}

/**
 * Order Invoice type guard
 */
export function isOrderInvoice(value: unknown): value is OrderInvoice {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.invoiceNo === 'string' &&
    typeof obj.customerName === 'string' &&
    typeof obj.date === 'string' &&
    Array.isArray(obj.items) &&
    typeof obj.subtotal === 'number' &&
    typeof obj.grandTotal === 'number'
  );
}

/**
 * Office Note type guard
 */
export function isOfficeNote(value: unknown): value is OfficeNote {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.priority === 'string' &&
    typeof obj.isCompleted === 'boolean'
  );
}

/**
 * Maintenance Log type guard
 */
export function isMaintenanceLog(value: unknown): value is MaintenanceLog {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.equipmentName === 'string' &&
    typeof obj.location === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.lastServiceDate === 'string'
  );
}

/**
 * Quick Field Note type guard
 */
export function isQuickFieldNote(value: unknown): value is QuickFieldNote {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.author === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.status === 'string'
  );
}

/**
 * Validate array of items with type guard
 */
export function validateArray<T>(
  value: unknown,
  typeGuard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(typeGuard);
}

/**
 * Safe type casting with fallback
 */
export function safeTypecast<T>(
  value: unknown,
  typeGuard: (item: unknown) => item is T,
  fallback: T
): T {
  return typeGuard(value) ? value : fallback;
}
