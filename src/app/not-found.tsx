import Link from 'next/link';
import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';

export default function NotFound() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-20">
        <Container className="flex flex-col-center text-center">
          <div className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            404
          </div>
          <h1 className="text-display-lg mb-4">Page Not Found</h1>
          <p className="text-body-lg text-secondary max-w-2xl mb-8">
            Sorry, the page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="primary" size="lg">
                Go Home
              </Button>
            </Link>
            <Link href="/work">
              <Button variant="outline" size="lg">
                View Work
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
