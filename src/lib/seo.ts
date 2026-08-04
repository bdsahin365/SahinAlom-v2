import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/constants';

interface SEOMetadataOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
  noindex?: boolean;
}

export const generateSEOMetadata = ({
  title,
  description,
  image,
  url,
  noindex = false,
}: SEOMetadataOptions): Metadata => {
  const fullTitle = `${title} - ${SITE_CONFIG.name}`;
  const finalImage = image || SITE_CONFIG.ogImage;
  const finalUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;

  return {
    title: fullTitle,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: finalUrl,
      title: fullTitle,
      description,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [finalImage],
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
};

export const generateStructuredData = (data: Record<string, any>) => {
  return {
    __html: JSON.stringify(data),
  };
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  sameAs: [
    SITE_CONFIG.links.twitter,
    SITE_CONFIG.links.github,
    SITE_CONFIG.links.linkedin,
  ],
  email: SITE_CONFIG.links.email,
  jobTitle: 'Full Stack Engineer & Designer',
};

export const articleSchema = (title: string, description: string, date: string, image?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  image,
  datePublished: date,
  author: {
    '@type': 'Person',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
});
