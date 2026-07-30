/**
 * Runtime Validation Schemas
 * Type-safe validation for all data models using runtime type guards
 */

import { Product, OrderInvoice, Customer, BlogPost, CaseStudy } from '@/types';

/**
 * Base schema validator with error collection
 */
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Generic schema validator
 */
export abstract class Schema<T> {
  abstract validate(data: unknown): ValidationResult;
  abstract parse(data: unknown): T;
}

/**
 * Product Schema
 */
export class ProductSchema extends Schema<Product> {
  validate(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        errors: [{ field: 'root', message: 'Data must be an object' }],
      };
    }

    const obj = data as Record<string, unknown>;

    if (!obj.id || typeof obj.id !== 'string') {
      errors.push({ field: 'id', message: 'ID must be a non-empty string' });
    }

    if (!obj.name || typeof obj.name !== 'string') {
      errors.push({ field: 'name', message: 'Name must be a non-empty string' });
    } else if (obj.name.length > 200) {
      errors.push({ field: 'name', message: 'Name must be less than 200 characters' });
    }

    if (obj.description && typeof obj.description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    }

    if (obj.category && typeof obj.category !== 'string') {
      errors.push({ field: 'category', message: 'Category must be a string' });
    }

    if (obj.image && typeof obj.image !== 'string') {
      errors.push({ field: 'image', message: 'Image must be a string URL' });
    }

    if (obj.featured && typeof obj.featured !== 'boolean') {
      errors.push({ field: 'featured', message: 'Featured must be a boolean' });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  parse(data: unknown): Product {
    const result = this.validate(data);
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.errors.map((e) => e.message).join(', ')}`);
    }
    return data as Product;
  }
}

/**
 * OrderInvoice Schema
 */
export class OrderInvoiceSchema extends Schema<OrderInvoice> {
  validate(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        errors: [{ field: 'root', message: 'Data must be an object' }],
      };
    }

    const obj = data as Record<string, unknown>;

    if (!obj.id || typeof obj.id !== 'string') {
      errors.push({ field: 'id', message: 'Order ID is required' });
    }

    if (!obj.customerName || typeof obj.customerName !== 'string') {
      errors.push({ field: 'customerName', message: 'Customer name is required' });
    }

    if (!obj.customerEmail || typeof obj.customerEmail !== 'string') {
      errors.push({ field: 'customerEmail', message: 'Customer email is required' });
    }

    if (typeof obj.totalAmount !== 'number' || obj.totalAmount < 0) {
      errors.push({ field: 'totalAmount', message: 'Total amount must be a non-negative number' });
    }

    if (obj.status && !['pending', 'completed'].includes(obj.status as string)) {
      errors.push({ field: 'status', message: 'Status must be "pending" or "completed"' });
    }

    if (obj.date && isNaN(Date.parse(obj.date as string))) {
      errors.push({ field: 'date', message: 'Date must be a valid ISO date' });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  parse(data: unknown): OrderInvoice {
    const result = this.validate(data);
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.errors.map((e) => e.message).join(', ')}`);
    }
    return data as OrderInvoice;
  }
}

/**
 * Customer Schema
 */
export class CustomerSchema extends Schema<Customer> {
  validate(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        errors: [{ field: 'root', message: 'Data must be an object' }],
      };
    }

    const obj = data as Record<string, unknown>;

    if (!obj.id || typeof obj.id !== 'string') {
      errors.push({ field: 'id', message: 'Customer ID is required' });
    }

    if (!obj.name || typeof obj.name !== 'string') {
      errors.push({ field: 'name', message: 'Customer name is required' });
    } else if (obj.name.length > 200) {
      errors.push({ field: 'name', message: 'Name must be less than 200 characters' });
    }

    if (obj.email) {
      if (typeof obj.email !== 'string') {
        errors.push({ field: 'email', message: 'Email must be a string' });
      } else if (!this.isValidEmail(obj.email)) {
        errors.push({ field: 'email', message: 'Email must be a valid email address' });
      }
    }

    if (obj.phone && typeof obj.phone !== 'string') {
      errors.push({ field: 'phone', message: 'Phone must be a string' });
    }

    if (obj.address && typeof obj.address !== 'string') {
      errors.push({ field: 'address', message: 'Address must be a string' });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  parse(data: unknown): Customer {
    const result = this.validate(data);
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.errors.map((e) => e.message).join(', ')}`);
    }
    return data as Customer;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/**
 * BlogPost Schema
 */
export class BlogPostSchema extends Schema<BlogPost> {
  validate(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        errors: [{ field: 'root', message: 'Data must be an object' }],
      };
    }

    const obj = data as Record<string, unknown>;

    if (!obj.id || typeof obj.id !== 'string') {
      errors.push({ field: 'id', message: 'Post ID is required' });
    }

    if (!obj.title || typeof obj.title !== 'string') {
      errors.push({ field: 'title', message: 'Title is required' });
    }

    if (!obj.content || typeof obj.content !== 'string') {
      errors.push({ field: 'content', message: 'Content is required' });
    }

    if (!obj.slug || typeof obj.slug !== 'string') {
      errors.push({ field: 'slug', message: 'Slug is required' });
    }

    if (obj.published && typeof obj.published !== 'boolean') {
      errors.push({ field: 'published', message: 'Published must be a boolean' });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  parse(data: unknown): BlogPost {
    const result = this.validate(data);
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.errors.map((e) => e.message).join(', ')}`);
    }
    return data as BlogPost;
  }
}

/**
 * CaseStudy Schema
 */
export class CaseStudySchema extends Schema<CaseStudy> {
  validate(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        errors: [{ field: 'root', message: 'Data must be an object' }],
      };
    }

    const obj = data as Record<string, unknown>;

    if (!obj.id || typeof obj.id !== 'string') {
      errors.push({ field: 'id', message: 'Case study ID is required' });
    }

    if (!obj.title || typeof obj.title !== 'string') {
      errors.push({ field: 'title', message: 'Title is required' });
    }

    if (!obj.description || typeof obj.description !== 'string') {
      errors.push({ field: 'description', message: 'Description is required' });
    }

    if (!obj.challenge || typeof obj.challenge !== 'string') {
      errors.push({ field: 'challenge', message: 'Challenge is required' });
    }

    if (!obj.solution || typeof obj.solution !== 'string') {
      errors.push({ field: 'solution', message: 'Solution is required' });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  parse(data: unknown): CaseStudy {
    const result = this.validate(data);
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.errors.map((e) => e.message).join(', ')}`);
    }
    return data as CaseStudy;
  }
}

// Schema instances
export const productSchema = new ProductSchema();
export const orderInvoiceSchema = new OrderInvoiceSchema();
export const customerSchema = new CustomerSchema();
export const blogPostSchema = new BlogPostSchema();
export const caseStudySchema = new CaseStudySchema();

/**
 * Validate array of items
 */
export function validateArray<T>(
  items: unknown,
  schema: Schema<T>
): ValidationResult & { items?: T[] } {
  if (!Array.isArray(items)) {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Must be an array' }],
    };
  }

  const errors: ValidationError[] = [];
  const validItems: T[] = [];

  items.forEach((item, index) => {
    const result = schema.validate(item);
    if (!result.valid) {
      errors.push(
        ...result.errors.map((e) => ({
          ...e,
          field: `[${index}].${e.field}`,
        }))
      );
    } else {
      validItems.push(item as T);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    items: errors.length === 0 ? validItems : undefined,
  };
}
