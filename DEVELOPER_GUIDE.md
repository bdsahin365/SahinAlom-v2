# Developer Guide - Refactored Architecture

This guide explains how to use the new architecture, utilities, and components for maximum productivity and consistency.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Configuration System](#configuration-system)
3. [Utilities](#utilities)
4. [Shared Components](#shared-components)
5. [Context & State Management](#context--state-management)
6. [Data Fetching](#data-fetching)
7. [Error Handling](#error-handling)
8. [Type Safety](#type-safety)
9. [Best Practices](#best-practices)
10. [Common Patterns](#common-patterns)

---

## Quick Start

### Install & Understand the Architecture

```
src/
├── config/           # All configuration in one place
│   └── index.ts
├── utils/            # Reusable utilities
│   ├── api.ts       # Fetch wrapper
│   ├── validators.ts # Form validation
│   ├── formatters.ts # String/date formatting
│   ├── storage.ts   # LocalStorage manager
│   ├── hooks.ts     # Custom React hooks
│   ├── errors.ts    # Error classes
│   ├── typeGuards.ts # Type validation
│   └── index.ts     # Barrel export
├── components/
│   ├── shared/      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Alert.tsx
│   │   └── index.ts
│   └── [other pages]
├── context/         # Global state
│   ├── ThemeContext.tsx
│   └── UIContext.tsx
└── types.ts        # All TypeScript interfaces
```

---

## Configuration System

### Overview
All app configuration is centralized in `src/config/index.ts`. No hardcoded strings in components.

### API Endpoints
```typescript
import { API_ENDPOINTS } from '@/config';

// Use instead of hardcoding URLs
const response = await fetch(API_ENDPOINTS.CASE_STUDIES);
```

### Feature Flags
```typescript
import { FEATURES } from '@/config';

{FEATURES.BLOG_SYSTEM && <BlogSection />}
```

### Storage Keys
```typescript
import { STORAGE_KEYS } from '@/config';

// Never hardcode localStorage keys
StorageManager.setItem(STORAGE_KEYS.CASE_STUDIES, data);
```

### Error Messages
```typescript
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config';

showToast({ 
  type: 'error', 
  message: ERROR_MESSAGES.NETWORK_ERROR 
});
```

### Color Tokens
```typescript
import { COLORS } from '@/config';

// Access colors programmatically
const bgColor = COLORS.dark.background;
```

---

## Utilities

### API Wrapper with Error Handling

```typescript
import { fetchWithErrorHandling } from '@/utils';

// Automatic retry, timeout, error handling
const { data, error, success } = await fetchWithErrorHandling('/api/data');

if (success) {
  // Use data safely
} else {
  console.error('Failed:', error);
}
```

### Form Validation

```typescript
import { validateEmail, validateForm, hasFormErrors } from '@/utils';

// Single field validation
const emailResult = validateEmail(email);
if (!emailResult.isValid) {
  setErrors({ email: emailResult.error });
}

// Entire form validation
const errors = validateForm(formData, {
  email: (v) => validateEmail(v),
  password: (v) => validatePassword(v),
  message: (v) => validateRequired(v, 'Message'),
});

if (hasFormErrors(errors)) {
  return; // Don't submit
}
```

### Formatting

```typescript
import {
  formatDate,
  formatCurrency,
  formatPhone,
  truncate,
  formatRelativeTime,
} from '@/utils';

// Dates
<span>{formatDate('2024-01-15')}</span> // "January 15, 2024"
<span>{formatRelativeTime('2024-01-15')}</span> // "2 months ago"

// Money
<span>{formatCurrency(1500)}</span> // "$1,500.00"

// Phone
<span>{formatPhone('1234567890')}</span> // "(123) 456-7890"

// Text
<span>{truncate('Long text...', 50)}</span> // "Long text..."
```

### Local Storage with Versioning

```typescript
import { StorageManager } from '@/utils';

// Set with version
StorageManager.setItem('myData', data, { version: 1, ttl: 24*60*60*1000 });

// Get and validate version
const data = StorageManager.getItem('myData', { version: 1 });

// Clear expired items
StorageManager.clearExpiredItems();
```

### Type Guards & Runtime Validation

```typescript
import { isCaseStudy, isCustomer, validateArray } from '@/utils';

// Validate single item
const item = apiResponse;
if (isCaseStudy(item)) {
  // TypeScript knows item is CaseStudy now
  console.log(item.slug);
}

// Validate array
const items: any[] = apiResponse;
if (validateArray(items, isCaseStudy)) {
  // Safe to use as CaseStudy[]
  items.forEach(cs => console.log(cs.slug));
}

// Safe casting with fallback
const customer = safeTypecast(data, isCustomer, DEFAULT_CUSTOMER);
```

---

## Shared Components

### Button

```typescript
import { Button } from '@/components/shared';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Ghost</Button>

// With loading state
<Button loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>

// With icon
import { Save } from 'lucide-react';
<Button icon={<Save size={16} />}>Save Changes</Button>
```

### Input Fields

```typescript
import { Input, Textarea, Select } from '@/components/shared';

// Text input with validation
<Input
  label="Email"
  type="email"
  error={errors.email}
  helperText="We'll never share your email"
  required
  placeholder="name@example.com"
/>

// Textarea
<Textarea
  label="Message"
  error={errors.message}
  rows={5}
  placeholder="Type your message..."
/>

// Select
<Select
  label="Category"
  options={[
    { value: 'tech', label: 'Technology' },
    { value: 'business', label: 'Business' },
  ]}
  placeholder="Choose category..."
/>
```

### Cards

```typescript
import { Card, CardHeader, CardBody, CardFooter } from '@/components/shared';

<Card variant="elevated" hover>
  <CardHeader 
    title="Project Details" 
    subtitle="Last updated 2 hours ago"
    action={<Button>Edit</Button>}
  />
  <CardBody>
    {/* Your content */}
  </CardBody>
  <CardFooter>
    <Button>Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

### Alerts

```typescript
import { Alert, Spinner, Skeleton, EmptyState } from '@/components/shared';

// Alert notifications
<Alert type="error" title="Error" message="Something went wrong" closeable />
<Alert type="success" message="Changes saved successfully" />

// Loading spinner
<Spinner size="lg" text="Loading..." />

// Skeleton loader (while loading)
<Skeleton width="100%" height="1rem" count={3} />

// Empty state
<EmptyState
  icon={<FileText size={48} />}
  title="No projects found"
  description="Create your first project to get started"
  action={<Button>Create Project</Button>}
/>
```

### Modal

```typescript
import { Modal, ModalFooter } from '@/components/shared';
import { useUI } from '@/context/UIContext';

const { openModal, closeModal, isModalOpen } = useUI();

<Modal 
  isOpen={isModalOpen('confirmDelete')}
  onClose={() => closeModal('confirmDelete')}
  title="Confirm Delete"
  size="md"
>
  <p>Are you sure you want to delete this item?</p>
  <ModalFooter>
    <Button onClick={() => closeModal('confirmDelete')}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </ModalFooter>
</Modal>
```

---

## Context & State Management

### Theme Management

```typescript
import { useTheme } from '@/context/ThemeContext';

export function MyComponent() {
  const { darkMode, toggleDarkMode, setDarkMode } = useTheme();

  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
```

### UI State & Notifications

```typescript
import { useUI, useToast } from '@/context/UIContext';

export function MyComponent() {
  const { isLoading, setIsLoading } = useUI();
  const { success, error, warning, info } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveData();
      success('Data saved successfully!');
    } catch (err) {
      error('Failed to save data');
    } finally {
      setIsLoading(false);
    }
  };

  return <Button onClick={handleSave} loading={isLoading}>Save</Button>;
}
```

### Wrap App with Providers

```typescript
// In main App component
import { ThemeProvider } from '@/context/ThemeContext';
import { UIProvider } from '@/context/UIContext';

export function App() {
  return (
    <ThemeProvider>
      <UIProvider>
        {/* Your app routes */}
      </UIProvider>
    </ThemeProvider>
  );
}
```

---

## Data Fetching

### With Custom Hook

```typescript
import { useFetch } from '@/utils/hooks';

export function CaseStudiesList() {
  const { data, loading, error, refetch } = useFetch('/api/case-studies');

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!data?.length) return <EmptyState title="No case studies" />;

  return (
    <div>
      {data.map(cs => <CaseStudyCard key={cs.slug} study={cs} />)}
      <Button onClick={refetch}>Refresh</Button>
    </div>
  );
}
```

### With Type Validation

```typescript
import { useFetch } from '@/utils/hooks';
import { isCaseStudy, validateArray } from '@/utils';

export function CaseStudiesList() {
  const { data, loading, error } = useFetch('/api/case-studies');

  // Validate data type
  if (!validateArray(data, isCaseStudy)) {
    return <Alert type="error" message="Invalid data format" />;
  }

  // TypeScript knows data is CaseStudy[]
  return data.map(cs => <div key={cs.slug}>{cs.title}</div>);
}
```

---

## Error Handling

### Error Boundary (Wrap Components)

```typescript
import { ErrorBoundary } from '@/utils/errors';

export function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Try-Catch with Error Classes

```typescript
import { 
  NetworkError, 
  ValidationError, 
  retry,
  getErrorMessage 
} from '@/utils/errors';

try {
  const result = await retry(
    () => fetchWithErrorHandling('/api/data'),
    3, // max attempts
    1000 // base delay ms
  );
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network issue:', error.message);
  } else {
    console.error('Error:', getErrorMessage(error));
  }
}
```

---

## Type Safety

### Always Use Type Guards

```typescript
// ❌ DON'T - Unsafe
const caseStudy = apiResponse as CaseStudy;

// ✅ DO - Safe with validation
if (isCaseStudy(apiResponse)) {
  const caseStudy: CaseStudy = apiResponse;
}
```

### Form Type Safety

```typescript
interface FormData {
  email: string;
  message: string;
}

const { values, handleChange, handleSubmit } = useForm<FormData>(
  { email: '', message: '' },
  async (values) => {
    // values is typed as FormData
    console.log(values.email);
  }
);
```

---

## Best Practices

### 1. Always use shared components
```typescript
// ❌ DON'T
<button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
  Click me
</button>

// ✅ DO
<Button>Click me</Button>
```

### 2. Use config for constants
```typescript
// ❌ DON'T
const apiUrl = '/api/case-studies';

// ✅ DO
import { API_ENDPOINTS } from '@/config';
const apiUrl = API_ENDPOINTS.CASE_STUDIES;
```

### 3. Validate API responses
```typescript
// ❌ DON'T
const data = await response.json();
setCaseStudies(data);

// ✅ DO
const data = await response.json();
if (validateArray(data, isCaseStudy)) {
  setCaseStudies(data);
} else {
  showError('Invalid data format');
}
```

### 4. Handle errors consistently
```typescript
// ✅ DO
const { data, error } = await fetchWithErrorHandling(url);
if (!data) {
  const { error: errorMsg } = useToast();
  error(ERROR_MESSAGES.FETCH_ERROR);
  return;
}
```

### 5. Use type guards in conditionals
```typescript
// ✅ DO - TypeScript narrows type in conditional
const item = getData();
if (isCaseStudy(item)) {
  // item is now typed as CaseStudy
  console.log(item.slug);
}
```

---

## Common Patterns

### Complete Form with Validation

```typescript
import { useForm } from '@/utils/hooks';
import { validateForm, validateEmail, validateRequired } from '@/utils';
import { useToast } from '@/context/UIContext';
import { Input, Button } from '@/components/shared';

export function ContactForm() {
  const { success, error } = useToast();
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: '', message: '' },
    async (formData) => {
      // Validate
      const errors = validateForm(formData, {
        email: validateEmail,
        message: (v) => validateRequired(v, 'Message'),
      });

      if (Object.keys(errors).length > 0) return;

      // Submit
      const response = await fetchWithErrorHandling('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.success) {
        success('Message sent!');
        handleReset();
      }
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        name="message"
        label="Message"
        as="textarea"
        value={values.message}
        onChange={handleChange}
        error={errors.message}
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
```

### Responsive Component

```typescript
import { useResponsive } from '@/utils/hooks';

export function ResponsiveGrid() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const columns = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {/* Content */}
    </div>
  );
}
```

### Data with Caching & Sync

```typescript
const [data, setData] = useLocalStorage('myData', []);

useEffect(() => {
  const loadData = async () => {
    // API call (with fallback to cache)
    const { data: fresh } = await fetchWithErrorHandling('/api/data');
    if (fresh) {
      setData(fresh);
    }
  };

  loadData();
}, []);
```

---

## Troubleshooting

### Component not updating after state change?
- Use useEffect dependencies correctly
- Ensure you're not mutating state directly
- Check if useToggle/useCounter hooks are being used

### API errors not showing?
- Wrap components in ErrorBoundary
- Use fetchWithErrorHandling() instead of fetch()
- Check ERROR_MESSAGES config

### Type errors?
- Use type guards before using data
- Check if API response matches expected interface
- Run `npm run lint` to catch TypeScript errors

### Storage quota exceeded?
- StorageManager auto-clears expired items
- Call StorageManager.clearExpiredItems() manually
- Reduce stored data size

---

## Next Steps

1. Review existing components and refactor to use shared library
2. Replace all hardcoded fetch calls with fetchWithErrorHandling()
3. Add type guards to all API response handling
4. Integrate ErrorBoundary at page level
5. Use useResponsive for mobile-first layouts
6. Add useToast notifications for all user actions

