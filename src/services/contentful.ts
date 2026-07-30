/**
 * Contentful CMS Service
 * Manages all content fetching from Contentful headless CMS
 */

const CONTENTFUL_SPACE_ID = (import.meta.env as any).VITE_CONTENTFUL_SPACE_ID || '';
const CONTENTFUL_ACCESS_TOKEN = (import.meta.env as any).VITE_CONTENTFUL_ACCESS_TOKEN || '';
const CONTENTFUL_PREVIEW_TOKEN = (import.meta.env as any).VITE_CONTENTFUL_PREVIEW_TOKEN || '';

// Define content types from Contentful
export interface ContentfulBlogPost {
  sys: { id: string; type: string; createdAt: string; updatedAt: string };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: { fields: { file: { url: string } } };
    author: string;
    publishedAt: string;
    category: string;
    tags: string[];
  };
}

export interface ContentfulCaseStudy {
  sys: { id: string; type: string; createdAt: string; updatedAt: string };
  fields: {
    title: string;
    slug: string;
    description: string;
    challenge: string;
    solution: string;
    result: string;
    image?: { fields: { file: { url: string } } };
    technologies: string[];
    links?: { label: string; url: string }[];
    featured: boolean;
  };
}

export interface ContentfulProduct {
  sys: { id: string; type: string };
  fields: {
    name: string;
    slug: string;
    description: string;
    price: number;
    image?: { fields: { file: { url: string } } };
    category: string;
    featured: boolean;
    active: boolean;
  };
}

export interface ContentfulHomepage {
  sys: { id: string; type: string };
  fields: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    heroImage?: { fields: { file: { url: string } } };
    aboutTitle: string;
    aboutDescription: string;
    siteTitle: string;
    siteDescription: string;
    showBlog: boolean;
    showCaseStudies: boolean;
    showProducts: boolean;
  };
}

/**
 * Fetch content from Contentful using REST API
 */
async function fetchFromContentful<T>(
  contentType: string,
  query: Record<string, any> = {}
): Promise<T[]> {
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    console.warn('Contentful credentials not configured');
    return [];
  }

  const params = new URLSearchParams({
    access_token: CONTENTFUL_ACCESS_TOKEN,
    content_type: contentType,
    ...Object.entries(query).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>),
  });

  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/entries?${params}`
    );

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching ${contentType} from Contentful:`, error);
    return [];
  }
}

/**
 * Contentful Service API
 */
export const contentfulService = {
  /**
   * Fetch all blog posts
   */
  async getBlogPosts(): Promise<ContentfulBlogPost[]> {
    return fetchFromContentful<ContentfulBlogPost>('blogPost', {
      order: '-fields.publishedAt',
      limit: 100,
    });
  },

  /**
   * Fetch blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<ContentfulBlogPost | null> {
    const posts = await fetchFromContentful<ContentfulBlogPost>('blogPost', {
      'fields.slug': slug,
      limit: 1,
    });
    return posts[0] || null;
  },

  /**
   * Fetch all case studies
   */
  async getCaseStudies(): Promise<ContentfulCaseStudy[]> {
    return fetchFromContentful<ContentfulCaseStudy>('caseStudy', {
      order: '-fields.featured,sys.createdAt',
      limit: 100,
    });
  },

  /**
   * Fetch case study by slug
   */
  async getCaseStudyBySlug(slug: string): Promise<ContentfulCaseStudy | null> {
    const studies = await fetchFromContentful<ContentfulCaseStudy>('caseStudy', {
      'fields.slug': slug,
      limit: 1,
    });
    return studies[0] || null;
  },

  /**
   * Fetch featured case studies
   */
  async getFeaturedCaseStudies(limit = 3): Promise<ContentfulCaseStudy[]> {
    return fetchFromContentful<ContentfulCaseStudy>('caseStudy', {
      'fields.featured': true,
      order: 'sys.createdAt',
      limit,
    });
  },

  /**
   * Fetch all products
   */
  async getProducts(): Promise<ContentfulProduct[]> {
    return fetchFromContentful<ContentfulProduct>('product', {
      'fields.active': true,
      order: '-fields.featured,sys.createdAt',
      limit: 100,
    });
  },

  /**
   * Fetch homepage content
   */
  async getHomepageContent(): Promise<ContentfulHomepage | null> {
    const content = await fetchFromContentful<ContentfulHomepage>('homepage', {
      limit: 1,
    });
    return content[0] || null;
  },

  /**
   * Search content across all types
   */
  async search(query: string): Promise<(ContentfulBlogPost | ContentfulCaseStudy)[]> {
  const params = new URLSearchParams();
  params.append('access_token', CONTENTFUL_ACCESS_TOKEN);
  params.append('query', query);
  params.append('limit', '20');

    try {
      const response = await fetch(
        `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/entries?${params}`
      );

      if (!response.ok) {
        throw new Error(`Contentful search error: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Contentful search error:', error);
      return [];
    }
  },
};

export default contentfulService;
