# Contentful CMS Integration Guide

## Overview

This project uses **Contentful** as a headless CMS for managing all website content. No custom admin dashboard is needed—everything is managed through Contentful's professional interface.

## Setup Instructions

### 1. Create a Contentful Space

1. Go to [contentful.com](https://contentful.com)
2. Create a new Space (or use an existing one)
3. Note your **Space ID** and **Access Token**

### 2. Configure Environment Variables

Add these to your `.env.local` or project environment:

```env
VITE_CONTENTFUL_SPACE_ID=your_space_id_here
VITE_CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token_here
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_api_token_here
```

### 3. Create Content Models in Contentful

Create the following Content Types in your Contentful Space:

#### Blog Post Content Type
```
- ID: blogPost
- Fields:
  - title (Text, required)
  - slug (Text, required, unique)
  - excerpt (Text, short)
  - content (Rich Text, required)
  - featuredImage (Asset)
  - author (Text, required)
  - publishedAt (Date, required)
  - category (Text)
  - tags (Array of Text)
```

#### Case Study Content Type
```
- ID: caseStudy
- Fields:
  - title (Text, required)
  - slug (Text, required, unique)
  - description (Text, required)
  - challenge (Rich Text)
  - solution (Rich Text)
  - result (Rich Text)
  - image (Asset)
  - technologies (Array of Text)
  - links (Array of JSON Objects: { label, url })
  - featured (Boolean)
```

#### Product Content Type
```
- ID: product
- Fields:
  - name (Text, required)
  - slug (Text, required, unique)
  - description (Rich Text, required)
  - price (Number, required)
  - image (Asset)
  - category (Text)
  - featured (Boolean)
  - active (Boolean, required)
```

#### Homepage Content Type
```
- ID: homepage
- Fields:
  - heroTitle (Text, required)
  - heroSubtitle (Text)
  - heroDescription (Rich Text)
  - heroImage (Asset)
  - aboutTitle (Text)
  - aboutDescription (Rich Text)
  - siteTitle (Text)
  - siteDescription (Text)
  - showBlog (Boolean)
  - showCaseStudies (Boolean)
  - showProducts (Boolean)
```

## Usage

### Fetching Blog Posts

```typescript
import { useBlogPosts } from '@/hooks/useContentful';

function BlogComponent() {
  const { data: posts, isLoading, error } = useBlogPosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {posts?.map(post => (
        <li key={post.sys.id}>{post.fields.title}</li>
      ))}
    </ul>
  );
}
```

### Fetching a Single Blog Post

```typescript
import { useBlogPost } from '@/hooks/useContentful';

function BlogPostPage({ slug }: { slug: string }) {
  const { data: post, isLoading } = useBlogPost(slug);

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Not found</div>;

  return (
    <article>
      <h1>{post.fields.title}</h1>
      <p>{post.fields.content}</p>
    </article>
  );
}
```

### Fetching Case Studies

```typescript
import { useCaseStudies } from '@/hooks/useContentful';

function CaseStudiesPage() {
  const { data: studies, isLoading } = useCaseStudies();

  return studies?.map(study => (
    <div key={study.sys.id}>
      <h2>{study.fields.title}</h2>
      <p>{study.fields.description}</p>
    </div>
  ));
}
```

### Fetching Featured Case Studies

```typescript
import { useFeaturedCaseStudies } from '@/hooks/useContentful';

function FeaturedSection() {
  const { data: featured } = useFeaturedCaseStudies(3);

  return featured?.map(study => (
    <div key={study.sys.id}>{study.fields.title}</div>
  ));
}
```

### Fetching Products

```typescript
import { useProducts } from '@/hooks/useContentful';

function ProductCatalog() {
  const { data: products } = useProducts();

  return products?.map(product => (
    <div key={product.sys.id}>
      <h3>{product.fields.name}</h3>
      <p>${product.fields.price}</p>
    </div>
  ));
}
```

### Fetching Homepage Content

```typescript
import { useHomepageContent } from '@/hooks/useContentful';

function HomePage() {
  const { data: homepage } = useHomepageContent();

  return (
    <section>
      <h1>{homepage?.fields.heroTitle}</h1>
      <p>{homepage?.fields.heroDescription}</p>
    </section>
  );
}
```

### Searching Content

```typescript
import { useState } from 'react';
import { useContentfulSearch } from '@/hooks/useContentful';

function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useContentfulSearch(query);

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {results?.map(item => (
        <div key={item.sys.id}>
          {item.fields.title}
        </div>
      ))}
    </>
  );
}
```

## Service API Reference

### contentfulService Methods

#### `getBlogPosts()`
Fetches all blog posts ordered by publication date (newest first).

**Returns:** `Promise<ContentfulBlogPost[]>`

#### `getBlogPostBySlug(slug: string)`
Fetches a single blog post by its slug.

**Returns:** `Promise<ContentfulBlogPost | null>`

#### `getCaseStudies()`
Fetches all case studies ordered by featured status and creation date.

**Returns:** `Promise<ContentfulCaseStudy[]>`

#### `getCaseStudyBySlug(slug: string)`
Fetches a single case study by its slug.

**Returns:** `Promise<ContentfulCaseStudy | null>`

#### `getFeaturedCaseStudies(limit = 3)`
Fetches featured case studies.

**Returns:** `Promise<ContentfulCaseStudy[]>`

#### `getProducts()`
Fetches all active products.

**Returns:** `Promise<ContentfulProduct[]>`

#### `getHomepageContent()`
Fetches homepage content configuration.

**Returns:** `Promise<ContentfulHomepage | null>`

#### `search(query: string)`
Searches across all content types.

**Returns:** `Promise<(ContentfulBlogPost | ContentfulCaseStudy)[]>`

## Type Definitions

### ContentfulBlogPost
```typescript
interface ContentfulBlogPost {
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
```

### ContentfulCaseStudy
```typescript
interface ContentfulCaseStudy {
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
```

### ContentfulProduct
```typescript
interface ContentfulProduct {
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
```

## Benefits of Using Contentful

✅ **No Admin Dashboard Needed** - Use Contentful's professional interface
✅ **Type-Safe** - Full TypeScript support with interfaces
✅ **Scalable** - Handles millions of content items
✅ **Real-time Updates** - Content changes immediately reflect in the app
✅ **Rich Media** - Built-in asset management
✅ **SEO-Friendly** - Headless approach for optimal SEO
✅ **Performance** - CDN-backed content delivery
✅ **Versioning** - Built-in content versioning and scheduling
✅ **Webhooks** - Automated rebuilds on content changes
✅ **Multi-language** - Built-in localization support

## Next Steps

1. Set up Contentful Space and create content types (see setup above)
2. Add environment variables to your project
3. Create content in Contentful
4. Use the hooks and service throughout your app
5. Deploy and enjoy automatic content management!

## Troubleshooting

### Content not showing up?
- Check that your Space ID and Access Token are correct
- Verify content is published in Contentful
- Check browser console for API errors

### Images not loading?
- Ensure assets are uploaded to Contentful
- Check that image URLs are correct in the API response
- Images should be in the `fields.file.url` path

### Type errors?
- Ensure your Contentful content models match the TypeScript interfaces
- Update interfaces if you add/remove fields in Contentful

## Additional Resources

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Contentful REST API Reference](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Content Delivery API Guide](https://www.contentful.com/developers/docs/references/content-delivery-api/)

---

**Status:** ✅ Ready for production
**Last Updated:** 2024
**Maintained By:** Development Team
