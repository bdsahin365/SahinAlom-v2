import Link from 'next/link';
import { SITE_CONFIG, NAVIGATION } from '@/config/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="text-heading-md font-bold mb-2">
              Sahin<span className="text-primary">Alom</span>
            </p>
            <p className="text-secondary">{SITE_CONFIG.title}</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-heading-sm mb-4">Navigation</h3>
            <div className="flex flex-col gap-3">
              {NAVIGATION.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-secondary hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-heading-sm mb-4">Social</h3>
            <div className="flex flex-col gap-3">
              <Link
                href={SITE_CONFIG.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors text-sm"
              >
                Twitter
              </Link>
              <Link
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors text-sm"
              >
                GitHub
              </Link>
              <Link
                href={SITE_CONFIG.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors text-sm"
              >
                LinkedIn
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-heading-sm mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <Link
                href={`mailto:${SITE_CONFIG.links.email}`}
                className="text-secondary hover:text-primary transition-colors text-sm"
              >
                Email
              </Link>
              <Link
                href="/contact"
                className="text-secondary hover:text-primary transition-colors text-sm"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary text-sm text-center md:text-left">
              Built with Next.js 15, React 19, and Tailwind CSS.
            </p>
            <p className="text-secondary text-sm">
              Copyright © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
