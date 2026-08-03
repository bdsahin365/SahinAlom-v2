export const SITE_CONFIG = {
  name: 'Alomohammad Sahin',
  title: 'Full Stack Engineer & Designer',
  description: 'Premium portfolio showcasing full-stack engineering projects, design work, and creative solutions.',
  url: 'https://sahinalom.com',
  ogImage: 'https://sahinalom.com/og-image.png',
  links: {
    twitter: 'https://twitter.com/sahinalom',
    github: 'https://github.com/bdsahin365',
    linkedin: 'https://linkedin.com/in/sahinalom',
    email: 'hello@sahinalom.com',
  },
};

export const NAVIGATION = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const PROJECTS = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with real-time inventory management and payment processing.',
    image: '/projects/ecommerce.png',
    category: 'Full Stack',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    link: '#',
    featured: true,
  },
  {
    id: 'project-2',
    title: 'Design System',
    description: 'Enterprise-grade design system with 50+ components and comprehensive documentation.',
    image: '/projects/design-system.png',
    category: 'Design System',
    tags: ['React', 'Tailwind CSS', 'Storybook'],
    link: '#',
    featured: true,
  },
  {
    id: 'project-3',
    title: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard with interactive charts and data visualization.',
    image: '/projects/analytics.png',
    category: 'Frontend',
    tags: ['React', 'D3.js', 'WebSocket'],
    link: '#',
    featured: false,
  },
];

export const SKILLS = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'shadcn/ui'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL', 'Prisma'],
  },
  {
    category: 'Tools & DevOps',
    items: ['Git', 'Docker', 'GitHub Actions', 'Vercel', 'AWS', 'Linux'],
  },
  {
    category: 'Design',
    items: ['Figma', 'UI Design', 'UX Design', 'Design Systems', 'Prototyping'],
  },
];

export const EXPERIENCE = [
  {
    role: 'Senior Full Stack Engineer',
    company: 'Tech Company',
    period: '2022 - Present',
    description: 'Leading frontend architecture and design system development.',
    achievements: [
      'Built scalable design system used by 50+ engineers',
      'Improved performance by 40% through optimization',
      'Mentored 5 junior developers',
    ],
  },
  {
    role: 'Full Stack Engineer',
    company: 'Startup Inc',
    period: '2020 - 2022',
    description: 'Developed full-stack features for SaaS platform.',
    achievements: [
      'Launched 3 major features ahead of schedule',
      'Reduced API response time by 60%',
      'Built authentication system from scratch',
    ],
  },
];

export const BLOG_POSTS = [
  {
    id: 'post-1',
    title: 'Building a Design System from Scratch',
    slug: 'building-design-system',
    excerpt: 'Learn how to build a scalable design system that grows with your product.',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Design Systems',
    featured: true,
  },
  {
    id: 'post-2',
    title: 'Next.js Performance Optimization Tips',
    slug: 'nextjs-performance',
    excerpt: 'Practical tips to optimize your Next.js application for better performance.',
    date: '2024-01-10',
    readTime: '10 min read',
    category: 'Performance',
    featured: true,
  },
  {
    id: 'post-3',
    title: 'React Hooks Deep Dive',
    slug: 'react-hooks-deep-dive',
    excerpt: 'Understanding React Hooks and how to use them effectively in your projects.',
    date: '2024-01-05',
    readTime: '12 min read',
    category: 'React',
    featured: false,
  },
];

export const THEMES = {
  light: 'light',
  dark: 'dark',
} as const;

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideInFromBottom: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  },
  slideInFromLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 },
  },
};
