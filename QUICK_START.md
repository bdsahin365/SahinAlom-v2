# Quick Start Guide - Premium Portfolio

## One Command Away From Launch

Your portfolio website is fully built and ready to run. Get started in seconds.

## 🚀 Start Development

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

## 🌐 Pages Available

- **Home** - `http://localhost:3000/`
- **About** - `http://localhost:3000/about`
- **Work** - `http://localhost:3000/work`
- **Blog** - `http://localhost:3000/blog`
- **Contact** - `http://localhost:3000/contact`
- **Privacy** - `http://localhost:3000/privacy`

## 🎨 First Things To Customize

### 1. Update Site Info (5 minutes)
Edit `src/config/constants.ts`:
```ts
export const SITE_CONFIG = {
  name: 'Your Name',
  title: 'Your Title',
  url: 'https://yoursite.com',
  links: {
    email: 'your@email.com',
    github: 'https://github.com/yourname',
    // ... other links
  },
};
```

### 2. Add Your Projects (10 minutes)
Edit the `PROJECTS` array in `src/config/constants.ts`:
```ts
export const PROJECTS = [
  {
    id: 'project-1',
    title: 'Your Project Name',
    description: 'What the project does',
    tags: ['React', 'TypeScript', 'Design'],
    // ... more fields
  },
];
```

### 3. Update Skills (5 minutes)
Edit the `SKILLS` array in `src/config/constants.ts`:
```ts
export const SKILLS = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  // ... more categories
];
```

### 4. Add Experience (5 minutes)
Edit the `EXPERIENCE` array in `src/config/constants.ts`:
```ts
export const EXPERIENCE = [
  {
    role: 'Your Role',
    company: 'Company Name',
    period: '2023 - Present',
    description: 'What you did',
    achievements: ['Achievement 1', 'Achievement 2'],
  },
];
```

## 🎯 Build & Deploy

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Deploy with one click

```bash
# Or deploy from CLI
npm install -g vercel
vercel
```

### Deploy to Other Platforms
Works with any Node.js host:
- Netlify
- GitHub Pages
- Railway
- Render
- Self-hosted server

## 🔧 Useful Commands

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Check for errors
npm run type-check  # Check TypeScript
npm run format      # Format code
```

## 🎨 Customize Colors

Edit `src/app/globals.css` to change the color theme:
```css
:root {
  --primary: #3b82f6;      /* Electric Blue */
  --accent: #f97316;       /* Orange */
  --secondary: #64748b;    /* Navy */
  /* ... more colors */
}
```

Or edit `tailwind.config.ts` for Tailwind colors.

## 🌙 Dark Mode

Already fully supported! The theme toggle is in the navbar. Users can select:
- Light mode
- Dark mode  
- System preference (default)

## 📱 Responsive Design

The site is mobile-first and responsive. No additional work needed.

## ✅ Pre-Built Features

- Dark mode with persistence
- Responsive design
- Smooth animations
- Scroll-to-top button
- Contact form with validation
- SEO optimization
- Sitemap and robots.txt
- Security headers
- TypeScript type safety

## 📊 What's Already Done

✅ Design system created  
✅ 13 components built  
✅ 7 pages implemented  
✅ Dark mode enabled  
✅ Mobile responsive  
✅ SEO optimized  
✅ Performance tuned  
✅ Type safe  
✅ Production ready  

**Just update the content and deploy!**

## 🚫 What's NOT Included (Yet)

These are intentionally left for later when you're ready to add backend:

- Database/CMS connection
- Email service for contact form
- Authentication/Admin panel
- Blog post management
- Dynamic project loading

When ready, these can be added without changing the frontend structure.

## 📖 Full Documentation

For detailed information, see:
- `README.md` - Comprehensive guide
- `PROJECT_SUMMARY.md` - What was built
- Code comments in components

## 💡 Tips

1. **Customize font** - Edit `src/app/layout.tsx` to use different Google Fonts
2. **Change Navbar links** - Edit `NAVIGATION` in `src/config/constants.ts`
3. **Modify colors** - All colors in `tailwind.config.ts`
4. **Add new pages** - Create files in `src/app/` (Next.js auto-routes them)
5. **Add components** - Create in `src/components/` and import

## 🎉 You're All Set!

1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000
4. Customize the content
5. Deploy!

That's it. Enjoy your new portfolio! 🚀

---

**Questions?** Check the README.md or code comments for more details.
