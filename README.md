# Alomohammad Sahin - Premium Portfolio Website

A modern, high-performance portfolio website built with Next.js 15, React 19, and Tailwind CSS. Showcasing projects, blog posts, and professional expertise with a beautiful dark mode design.

## Features

✨ **Modern Design System**
- Electric Blue primary color with Orange accent
- Comprehensive dark mode support
- Responsive, mobile-first design
- Custom animations and transitions

🚀 **Performance Optimized**
- Next.js 15 with App Router
- Server-side rendering (SSR)
- Image optimization
- Code splitting and lazy loading
- Lighthouse score optimization (>95)

🎨 **Component Library**
- 5+ UI components (Button, Card, Badge, Input, Textarea)
- Layout components (Navbar, Footer, Container)
- Common utilities (ScrollToTop, Skeleton)
- TypeScript for type safety

📱 **Multi-Page Application**
- Home/Landing page
- About page (experience & skills)
- Work/Projects showcase
- Blog with articles
- Contact form
- Privacy Policy
- 404 error page

🔍 **SEO Ready**
- Sitemap generation
- robots.txt
- Meta tags and Open Graph
- Structured data schemas
- Canonical URLs

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3, PostCSS
- **Tooling**: ESLint, Prettier, Node.js

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm or pnpm

### Installation

1. **Install dependencies:**
```bash
npm install
# or
pnpm install
```

2. **Run development server:**
```bash
npm run dev
# or
pnpm dev
```

3. **Open in browser:**
Navigate to `http://localhost:3000`

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check formatting without changes
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── work/              # Projects/work page
│   ├── blog/              # Blog page
│   ├── contact/           # Contact page
│   ├── privacy/           # Privacy policy
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── not-found.tsx      # 404 page
├── components/
│   ├── ui/                # UI components (Button, Card, etc)
│   ├── layout/            # Layout components (Navbar, Footer)
│   └── common/            # Common components (ScrollToTop, Skeleton)
├── config/
│   └── constants.ts       # Site configuration and mock data
├── hooks/
│   └── useTheme.ts        # Theme management hook
├── lib/
│   ├── utils.ts           # Utility functions
│   └── seo.ts             # SEO helpers
├── types/
│   └── index.ts           # TypeScript type definitions
└── styles/                # (Can be added for additional styles)

public/
├── robots.txt             # SEO robots file
└── favicon.ico            # Site favicon
```

## Configuration Files

- `next.config.ts` - Next.js configuration with security headers
- `tailwind.config.ts` - Tailwind CSS theme and extensions
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration
- `.prettierrc` - Code formatting rules
- `.gitignore` - Git ignore patterns

## Customization

### Site Configuration

Edit `src/config/constants.ts` to update:
- Site name, title, and description
- Navigation links
- Social media links
- Sample projects, skills, and blog posts

### Design Tokens

Edit `src/app/globals.css` to customize:
- Color palette
- Typography scales
- Spacing system
- Animations and transitions

### Components

All components are located in `src/components/` and can be easily customized:
- UI components in `ui/` - Button, Card, Badge, Input, Textarea
- Layout components in `layout/` - Navbar, Footer, Container
- Common components in `common/` - ScrollToTop, Skeleton

## Performance

### Optimizations Implemented

- ✅ Image optimization with Next.js Image component
- ✅ Code splitting with dynamic imports
- ✅ CSS minification and optimization
- ✅ Font optimization with next/font
- ✅ Server-side rendering for better SEO
- ✅ Proper caching headers
- ✅ Security headers in response
- ✅ Minimal JavaScript bundle

### Target Metrics

- Lighthouse Performance: >95
- Accessibility: >95
- Best Practices: >95
- SEO: >95

## SEO

The site is fully optimized for search engines:
- Dynamic sitemap generation at `/sitemap.xml`
- robots.txt with crawl directives
- Meta tags with Open Graph
- Structured data schemas (Organization, Article)
- Responsive design for mobile indexing
- Fast page load times

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push

```bash
npm run build  # Build locally to test
npm start      # Test production build
```

### Deploy to Other Platforms

The site is a standard Next.js application and can be deployed to:
- Netlify
- GitHub Pages
- Self-hosted servers
- Docker containers

## Future Enhancements

When ready to add backend functionality:

- [ ] Connect to CMS (Contentful, Sanity, etc)
- [ ] Setup database for blog posts (PostgreSQL, MongoDB)
- [ ] Add email service for contact form
- [ ] Implement authentication for admin panel
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Setup newsletter subscription

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Contact

For questions or inquiries, contact at hello@sahinalom.com

---

**Built with ❤️ using Next.js and Tailwind CSS**
