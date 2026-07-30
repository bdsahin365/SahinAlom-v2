/**
 * Utilities barrel export - single import point for all utilities
 */

// API & HTTP
export { fetchWithErrorHandling, fetchMultiple, delay, type ApiResponse } from './api';

// Validators
export {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUrl,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
  validateMin,
  validateMax,
  validateForm,
  hasFormErrors,
  validateImageFile,
  validateSlug,
  generateSlug,
  type ValidationResult,
} from './validators';

// Formatters
export {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  formatPhone,
  capitalize,
  camelCaseToTitle,
  truncate,
  getInitials,
  formatName,
  formatDuration,
  getStatusColor,
} from './formatters';

// Storage
export {
  StorageManager,
  SessionStorageManager,
} from './storage';

// Hooks
export {
  useFetch,
  useLocalStorage,
  useResponsive,
  useDebounce,
  useThrottle,
  useClickOutside,
  usePrevious,
  useMount,
  useUnmount,
  type UseFetchOptions,
} from './hooks';

// Async Operations
export {
  useAsync,
  useAsyncAPI,
  useAsyncSubmit,
  type UseAsyncOptions,
} from './useAsync';

// Error Handling
export {
  ErrorBoundary,
  AppError,
  ValidationError,
  NetworkError,
  AuthError,
  PermissionError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServerError,
  logError,
  createErrorFromStatus,
  getErrorMessage,
  isRecoverableError,
  retry,
  assert,
  ensure,
  safeJsonParse,
  safeJsonStringify,
  type ErrorLog,
  type ErrorInfo,
} from './errors';

// Type Guards
export {
  isCaseStudy,
  isContactMessage,
  isProfileData,
  isHomepageContent,
  isAppSettings,
  isBlogPost,
  isCustomer,
  isProductItem,
  isOrderItem,
  isOrderInvoice,
  isOfficeNote,
  isMaintenanceLog,
  isQuickFieldNote,
  validateArray,
  safeTypecast,
} from './typeGuards';

// Image utilities (existing)
export {
  compressAndResizeImage,
  safeLocalStorageSetItem,
} from './imageUtils';
