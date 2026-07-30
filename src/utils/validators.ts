/**
 * Reusable form validation functions.
 */

import { ERROR_MESSAGES } from '../config/index';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true };
}

/**
 * Phone number validation (supports multiple formats)
 */
export function validatePhone(phone: string): ValidationResult {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 7) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  return { isValid: true };
}

/**
 * URL validation
 */
export function validateUrl(url: string): ValidationResult {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

/**
 * Required field validation
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
}

/**
 * Min length validation
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): ValidationResult {
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { isValid: true };
}

/**
 * Max length validation
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): ValidationResult {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }
  return { isValid: true };
}

/**
 * Number validation
 */
export function validateNumber(value: any, fieldName: string): ValidationResult {
  const num = Number(value);
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  return { isValid: true };
}

/**
 * Min value validation
 */
export function validateMin(
  value: number,
  min: number,
  fieldName: string
): ValidationResult {
  if (value < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min}`,
    };
  }
  return { isValid: true };
}

/**
 * Max value validation
 */
export function validateMax(
  value: number,
  max: number,
  fieldName: string
): ValidationResult {
  if (value > max) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${max}`,
    };
  }
  return { isValid: true };
}

/**
 * Validate entire form object
 */
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, (value: any) => ValidationResult>
): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.entries(rules).forEach(([field, validate]) => {
    const result = validate(data[field]);
    if (!result.isValid && result.error) {
      errors[field] = result.error;
    }
  });

  return errors;
}

/**
 * Check if form has any errors
 */
export function hasFormErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Image file validation
 */
export function validateImageFile(file: File): ValidationResult {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload an image file (JPEG, PNG, WebP, or SVG)',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.FILE_TOO_LARGE,
    };
  }

  return { isValid: true };
}

/**
 * Slug validation and generation
 */
export function validateSlug(slug: string): ValidationResult {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return {
      isValid: false,
      error: 'Slug must contain only lowercase letters, numbers, and hyphens',
    };
  }
  return { isValid: true };
}

/**
 * Generate URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
