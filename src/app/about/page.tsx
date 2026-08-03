import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Container from '@/components/layout/Container';
import { EXPERIENCE, SKILLS } from '@/config/constants';

export default function About() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20">
        <Container className="flex flex-col-center text-center">
          <h1 className="text-display-lg mb-6">About Me</h1>
          <p className="text-body-lg text-secondary max-w-2xl mb-8">
            Full-stack engineer and designer with a passion for building beautiful, performant digital products that solve real problems.
          </p>
        </Container>
      </section>

      {/* About Content */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Who I Am</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <p className="text-body-md text-secondary mb-4">
                    I'm a full-stack engineer with 5+ years of experience building web applications. I specialize in React, Next.js, and TypeScript, with a strong background in design systems and performance optimization.
                  </p>
                  <p className="text-body-md text-secondary mb-4">
                    My approach combines technical excellence with thoughtful design to create products that not only work beautifully but also feel intuitive to use.
                  </p>
                  <p className="text-body-md text-secondary">
                    When I'm not coding, you can find me contributing to open-source projects, writing technical articles, or exploring new design trends.
                  </p>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <div className="mb-12">
                <h2 className="text-display-md mb-8">Experience</h2>
                <div className="space-y-6">
                  {EXPERIENCE.map((exp, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <CardTitle>{exp.role}</CardTitle>
                            <CardDescription>{exp.company}</CardDescription>
                          </div>
                          <Badge variant="primary" size="sm">
                            {exp.period}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-body-sm text-secondary mb-4">{exp.description}</p>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-body-sm text-secondary flex items-start gap-2">
                              <span className="text-primary mt-1">▸</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Stats */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-heading-lg font-bold text-primary">5+</div>
                    <p className="text-body-sm text-secondary">Years of Experience</p>
                  </div>
                  <div>
                    <div className="text-heading-lg font-bold text-primary">50+</div>
                    <p className="text-body-sm text-secondary">Projects Completed</p>
                  </div>
                  <div>
                    <div className="text-heading-lg font-bold text-primary">100%</div>
                    <p className="text-body-sm text-secondary">Client Satisfaction</p>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card>
                <CardHeader>
                  <CardTitle>Let&apos;s Work Together</CardTitle>
                  <CardDescription>
                    I&apos;m always interested in hearing about new projects.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="primary" fullWidth>
                    Get in Touch
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Skills Section */}
      <section className="py-20 border-t border-border">
        <Container>
          <h2 className="text-display-md mb-12">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SKILLS.map((skillGroup) => (
              <Card key={skillGroup.category}>
                <CardHeader>
                  <CardTitle>{skillGroup.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <Badge key={skill} variant="primary">
                        {skill}
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
