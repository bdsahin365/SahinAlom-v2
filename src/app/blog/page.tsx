import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Container from '@/components/layout/Container';
import Input from '@/components/ui/Input';
import { BLOG_POSTS } from '@/config/constants';

export default function Blog() {
  const featuredPosts = BLOG_POSTS.filter((p) => p.featured);
  const otherPosts = BLOG_POSTS.filter((p) => !p.featured);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20">
        <Container className="flex flex-col-center text-center">
          <h1 className="text-display-lg mb-6">Blog</h1>
          <p className="text-body-lg text-secondary max-w-2xl mb-8">
            Thoughts on web development, design systems, performance, and building products at scale.
          </p>
        </Container>
      </section>

      {/* Search */}
      <section className="py-12">
        <Container className="max-w-xl">
          <Input
            placeholder="Search articles..."
            className="w-full"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </Container>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <Container>
            <h2 className="text-display-md mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card variant="interactive" className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="primary" size="sm">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-secondary">{post.readTime}</span>
                      </div>
                      <CardTitle className="text-heading-lg hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-6">
                      <p className="text-xs text-secondary">{post.date}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* All Posts */}
      <section className={`py-12 ${featuredPosts.length > 0 ? 'border-t border-border' : ''}`}>
        <Container>
          <h2 className={`text-display-md mb-8 ${featuredPosts.length > 0 ? '' : ''}`}>
            {featuredPosts.length > 0 ? 'Latest Articles' : 'All Articles'}
          </h2>
          <div className="space-y-4">
            {otherPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card variant="interactive">
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-heading-md hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <Badge variant="secondary" size="sm">
                          {post.category}
                        </Badge>
                      </div>
                      <p className="text-body-sm text-secondary">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-secondary ml-4">
                      <span>{post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 border-t border-border">
        <Container className="flex flex-col-center text-center max-w-2xl">
          <h2 className="text-display-md mb-4">Subscribe to the Newsletter</h2>
          <p className="text-body-lg text-secondary mb-8">
            Get the latest articles delivered directly to your inbox.
          </p>
          <div className="w-full flex gap-2">
            <Input placeholder="your@email.com" type="email" className="flex-1" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </Container>
      </section>
    </div>
  );
}
