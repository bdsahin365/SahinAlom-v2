import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Container from '@/components/layout/Container';

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <Container className="flex flex-col-center text-center">
          <Badge variant="primary" size="md" className="mb-6">
            Welcome to my portfolio
          </Badge>
          <h1 className="text-display-xl mb-6 max-w-3xl">
            Full Stack Engineer <span className="text-primary">&</span> Designer
          </h1>
          <p className="text-body-lg text-secondary max-w-2xl mb-8">
            Building premium, high-performance digital experiences with cutting-edge technology and thoughtful design.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Button variant="primary" size="lg">
              View My Work
            </Button>
            <Button variant="outline" size="lg">
              Get in Touch
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      <section id="work" className="py-20">
        <Container>
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
                  <div className="flex gap-2 flex-wrap">
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
        </Container>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <Container>
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
        </Container>
      </section>
    </div>
  );
}
