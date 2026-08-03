import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Container from '@/components/layout/Container';
import { PROJECTS } from '@/config/constants';

export default function Work() {
  const featuredProjects = PROJECTS.filter((p) => p.featured);
  const otherProjects = PROJECTS.filter((p) => !p.featured);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20">
        <Container className="flex flex-col-center text-center">
          <h1 className="text-display-lg mb-6">My Work</h1>
          <p className="text-body-lg text-secondary max-w-2xl mb-8">
            A selection of projects I&apos;ve worked on, showcasing my approach to design, development, and problem-solving.
          </p>
        </Container>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <Container>
          <h2 className="text-display-md mb-12">Featured Projects</h2>
          <div className="space-y-12">
            {featuredProjects.map((project, idx) => (
              <Card key={project.id} variant="hover">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex-center">
                    <span className="text-secondary">Project Image</span>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-display-sm">{project.title}</h3>
                        <Badge variant="primary" size="sm">
                          {project.category}
                        </Badge>
                      </div>
                      <p className="text-body-lg text-secondary mb-6">{project.description}</p>
                      <div className="flex gap-2 flex-wrap mb-8">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="primary">View Project</Button>
                      <Button variant="outline">Source Code</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="py-20 border-t border-border">
          <Container>
            <h2 className="text-display-md mb-12">Other Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <Card key={project.id} variant="interactive">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-md mb-4 flex-center">
                    <span className="text-secondary">Project Image</span>
                  </div>
                  <CardHeader className="mb-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-heading-lg">{project.title}</CardTitle>
                      <Badge variant="primary" size="sm">
                        {project.category}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-6">
                    <div className="flex gap-2 flex-wrap mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" fullWidth>
                      View Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <Container className="flex flex-col-center text-center">
          <h2 className="text-display-md mb-6">Have a Project in Mind?</h2>
          <p className="text-body-lg text-secondary max-w-2xl mb-8">
            I&apos;m always interested in new challenges. Let&apos;s discuss how I can help bring your ideas to life.
          </p>
          <Button variant="primary" size="lg">
            Get in Touch
          </Button>
        </Container>
      </section>
    </div>
  );
}
