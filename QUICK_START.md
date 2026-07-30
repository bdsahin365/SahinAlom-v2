# Quick Start Guide - Refactored Codebase

## What You Need to Know

This codebase has been refactored into a modern, type-safe, extensible architecture. Here's what's available:

## 🚀 Use These

### Configuration
```typescript
import { API_ENDPOINTS, FEATURES, COLORS, ERROR_MESSAGES } from '@/config';
```

### Utilities
```typescript
import { 
  fetchWithErrorHandling,      // API with retry & error handling
  validateEmail,               // Form validators
  formatDate,                  // Formatters
  StorageManager,              // Persistent storage with TTL
  useFetch, useLocalStorage,   // Custom hooks
  ErrorBoundary,               // Error handling
  isCaseStudy,                 // Type guards
} from '@/utils';
```

### Components
```typescript
import { 
  Button, 
  Input, 
  Textarea, 
  Select, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Alert, 
  Spinner, 
  Skeleton, 
  EmptyState, 
  LoadingBar,
  Modal,
  ModalFooter,
} from '@/components/shared';
```

### Contexts
```typescript
import { useTheme } from '@/context/ThemeContext';
import { useUI, useToast } from '@/context/UIContext';
```

## 📚 Learn More

| Want to... | Read... |
|-----------|---------|
| Use the new system | `DEVELOPER_GUIDE.md` |
| See what to build next | `IMPLEMENTATION_ROADMAP.md` |
| Understand progress | `COMPLETION_SUMMARY.md` |
| Check status | `REFACTOR_PROGRESS.md` |

## 🔧 Common Patterns

### Fetch with Error Handling
```typescript
const { data, error, success } = await fetchWithErrorHandling('/api/data');
```

### Form with Validation
```typescript
const { values, errors, handleChange, handleSubmit } = useForm(initialData, onSubmit);
<Input name="email" value={values.email} error={errors.email} onChange={handleChange} />
```

### Responsive Layout
```typescript
const { isMobile, isTablet } = useResponsive();
return isMobile ? <MobileLayout /> : <DesktopLayout />;
```

### Safe Data Fetching
```typescript
const { data, loading, error } = useFetch('/api/case-studies');
if (!validateArray(data, isCaseStudy)) return <EmptyState />;
```

### Show Notifications
```typescript
const { success, error } = useToast();
success('Saved!');
error('Failed to save');
```

## ✅ What Works Out of the Box

- ✅ Dark/light mode toggle
- ✅ Centralized configuration
- ✅ Type-safe data handling
- ✅ Error boundaries
- ✅ Loading states
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ Form validation
- ✅ Local storage with versioning

## 🚧 What's Next

See `IMPLEMENTATION_ROADMAP.md` for:
- Phase 3: Refactor Admin (largest component)
- Phase 4: Error handling integration
- Phase 5: API standardization
- Phase 6: Type safety verification
- Phase 7: Complete dashboard features
- Phase 8: Polish & documentation

## 🎯 Design Principles

These principles guide all new code:

1. **No Hardcoded Strings** - Use config
2. **Type Safe** - Use type guards
3. **Reusable** - Use shared components
4. **Accessible** - WCAG AA ready
5. **Responsive** - Mobile-first
6. **Documented** - Comments & examples
7. **Tested** - Unit test ready
8. **Modular** - <400 lines per file

## 🛠️ Commands

```bash
npm run dev      # Start dev server
npm run lint     # TypeScript check
npm run build    # Build for production
npm run preview  # Preview built app
```

## 📁 File Structure

```
src/
├── config/           # All configuration
├── utils/            # Reusable utilities
├── components/
│   ├── shared/      # Reusable UI
│   └── [other]      # Page components
├── context/         # Global state
└── types.ts         # Type definitions
```

## 💡 Pro Tips

1. Always check `config/index.ts` before hardcoding values
2. Use `useResponsive()` for breakpoint logic
3. Wrap components in `ErrorBoundary`
4. Use type guards before accessing typed data
5. Import from barrel exports (`@/utils`, `@/components/shared`)

## 🆘 Troubleshooting

### Component not updating?
- Check `useEffect` dependencies
- Don't mutate state directly
- Use proper hooks

### Type errors?
- Use type guards from `@/utils`
- Check if API response matches expected type
- Run `npm run lint`

### Styling issues?
- Use shared components instead of inline Tailwind
- Check dark mode support
- Reference `src/index.css` for themes

### Network errors?
- Use `fetchWithErrorHandling()` not `fetch()`
- Check `ERROR_MESSAGES` config
- Errors auto-retry with backoff

## 📞 Resources

- **Utilities**: `src/utils/index.ts` (what's available)
- **Components**: `src/components/shared/index.ts` (what's available)
- **Config**: `src/config/index.ts` (central values)
- **Types**: `src/types.ts` (all models)
- **Hooks**: `src/utils/hooks.ts` (all hooks)

## ✨ Example: Complete Feature

Combine utilities to build features:

```typescript
import { useForm, useFetch } from '@/utils/hooks';
import { validateEmail } from '@/utils';
import { useToast } from '@/context/UIContext';
import { Button, Input, Alert } from '@/components/shared';

export function SubscribeForm() {
  const { success, error } = useToast();
  const { values, errors, handleSubmit } = useForm(
    { email: '' },
    async (data) => {
      const result = await fetchWithErrorHandling('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (result.success) {
        success('Subscribed!');
      } else {
        error(result.error);
      }
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        error={errors.email}
        placeholder="your@email.com"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
```

---

**Ready to build?** Start with `DEVELOPER_GUIDE.md`
**Questions?** Check `IMPLEMENTATION_ROADMAP.md` for patterns
