import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-heading-md font-bold">
            Sahin<span className="text-primary">Alom</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="#about" className="text-body-md hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#work" className="text-body-md hover:text-primary transition-colors">
              Work
            </Link>
            <Link href="#blog" className="text-body-md hover:text-primary transition-colors">
              Blog
            </Link>
            <Button variant="primary" size="sm">
              Contact
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="flex flex-col-center text-center">
          <Badge variant="primary" size="md" className="mb-6">
            Welcome to my portfolio
          </Badge>
          <h1 className="text-display-xl mb-6 max-w-3xl">
            Full Stack Engineer <span className="text-primary">&</span> Designer
          </h1>
          <p className="text-body-lg text-secondary max-w-2xl mb-8">
            Building premium, high-performance digital experiences with cutting-edge technology and thoughtful design.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="primary" size="lg">
              View My Work
            </Button>
            <Button variant="outline" size="lg">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="work" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-display-md mb-4">Featured Work</h2>
          <p className="text-body-lg text-secondary">
            Showcasing some of my recent projects and case studies.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} variant="interactive">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-md mb-4 flex-center">
                <span className="text-secondary">Project {i}</span>
              </div>
              <CardHeader className="mb-0">
                <CardTitle>Project {i} Name</CardTitle>
                <CardDescription>
                  A brief description of the project and its impact
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="flex gap-2">
                  <Badge variant="secondary" size="sm">
                    React
                  </Badge>
                  <Badge variant="secondary" size="sm">
                    TypeScript
                  </Badge>
                  <Badge variant="secondary" size="sm">
                    Design
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-display-md mb-4">Skills & Expertise</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Frontend', 'Backend', 'Design', 'DevOps'].map((skill) => (
            <Card key={skill}>
              <CardHeader>
                <CardTitle className="text-heading-md">{skill}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Tool 1', 'Tool 2', 'Tool 3'].map((tool) => (
                    <Badge key={tool} variant="primary" size="sm">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-heading-md font-bold mb-2">
                Sahin<span className="text-primary">Alom</span>
              </p>
              <p className="text-secondary">Full Stack Engineer & Designer</p>
            </div>
            <div className="flex gap-8 mt-4 md:mt-0">
              <Link href="#" className="text-secondary hover:text-primary transition-colors">
                Twitter
              </Link>
              <Link href="#" className="text-secondary hover:text-primary transition-colors">
                GitHub
              </Link>
              <Link href="#" className="text-secondary hover:text-primary transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8">
            <p className="text-secondary text-center">
              Built with Next.js 15 and Tailwind CSS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
