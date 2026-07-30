/**
 * React Hooks for Contentful CMS integration
 */

import { useState, useEffect } from 'react';
import contentfulService, {
  ContentfulBlogPost,
  ContentfulCaseStudy,
  ContentfulProduct,
  ContentfulHomepage,
} from '../services/contentful';

interface UseContentfulState<T> {
  data: T | T[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch blog posts
 */
export function useBlogPosts(): UseContentfulState<ContentfulBlogPost[]> {
  const [data, setData] = useState<ContentfulBlogPost[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const posts = await contentfulService.getBlogPosts();
      setData(posts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch blog posts'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook to fetch a single blog post by slug
 */
export function useBlogPost(slug: string): UseContentfulState<ContentfulBlogPost> {
  const [data, setData] = useState<ContentfulBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const post = await contentfulService.getBlogPostBySlug(slug);
      setData(post);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch blog post'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetch();
    }
  }, [slug]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook to fetch case studies
 */
export function useCaseStudies(): UseContentfulState<ContentfulCaseStudy[]> {
  const [data, setData] = useState<ContentfulCaseStudy[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const studies = await contentfulService.getCaseStudies();
      setData(studies);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch case studies'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook to fetch featured case studies
 */
export function useFeaturedCaseStudies(limit = 3): UseContentfulState<ContentfulCaseStudy[]> {
  const [data, setData] = useState<ContentfulCaseStudy[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const studies = await contentfulService.getFeaturedCaseStudies(limit);
      setData(studies);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch featured case studies'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [limit]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook to fetch a single case study by slug
 */
export function useCaseStudy(slug: string): UseContentfulState<ContentfulCaseStudy> {
  const [data, setData] = useState<ContentfulCaseStudy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const study = await contentfulService.getCaseStudyBySlug(slug);
      setData(study);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch case study'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetch();
    }
  }, [slug]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook to fetch products
 */
export function useProducts(): UseContentfulState<ContentfulProduct[]> {
  const [data, setData] = useState<ContentfulProduct[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const products = await contentfulService.getProducts();
      setData(products);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook to fetch homepage content
 */
export function useHomepageContent(): UseContentfulState<ContentfulHomepage> {
  const [data, setData] = useState<ContentfulHomepage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const content = await contentfulService.getHomepageContent();
      setData(content);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch homepage content'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook for searching content
 */
export function useContentfulSearch(query: string): UseContentfulState<(ContentfulBlogPost | ContentfulCaseStudy)[]> {
  const [data, setData] = useState<(ContentfulBlogPost | ContentfulCaseStudy)[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = await contentfulService.search(query);
      setData(results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [query]);

  return { data, isLoading, error, refetch: fetch };
}
