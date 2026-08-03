import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/common/ScrollToTop';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alomohammad Sahin - Full Stack Engineer & Designer',
  description: 'Premium portfolio showcasing full-stack engineering projects, design work, and creative solutions.',
  keywords: ['Full Stack Engineer', 'Designer', 'Portfolio', 'Web Development', 'React', 'Next.js'],
  authors: [{ name: 'Alomohammad Sahin', url: 'https://sahinalom.com' }],
  creator: 'Alomohammad Sahin',
  publisher: 'Alomohammad Sahin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sahinalom.com',
    title: 'Alomohammad Sahin - Full Stack Engineer & Designer',
    description: 'Premium portfolio showcasing full-stack engineering projects, design work, and creative solutions.',
    siteName: 'Alomohammad Sahin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alomohammad Sahin - Full Stack Engineer & Designer',
    description: 'Premium portfolio showcasing full-stack engineering projects, design work, and creative solutions.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1419' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Premium portfolio showcasing full-stack engineering projects, design work, and creative solutions." />
        <meta property="og:image" content="/og-image.png" />
      </head>
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
