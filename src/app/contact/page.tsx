'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Container from '@/components/layout/Container';
import { SITE_CONFIG } from '@/config/constants';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20">
        <Container className="flex flex-col-center text-center">
          <h1 className="text-display-lg mb-6">Get in Touch</h1>
          <p className="text-body-lg text-secondary max-w-2xl mb-8">
            Have a question or want to collaborate? Feel free to reach out. I&apos;ll get back to you as soon as possible.
          </p>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* Email */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-heading-md">Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={`mailto:${SITE_CONFIG.links.email}`}
                      className="text-primary hover:text-primary-600 transition-colors text-body-md"
                    >
                      {SITE_CONFIG.links.email}
                    </a>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-heading-md">Social</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a
                      href={SITE_CONFIG.links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-body-sm text-secondary hover:text-primary transition-colors"
                    >
                      <span>→</span> Twitter
                    </a>
                    <a
                      href={SITE_CONFIG.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-body-sm text-secondary hover:text-primary transition-colors"
                    >
                      <span>→</span> GitHub
                    </a>
                    <a
                      href={SITE_CONFIG.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-body-sm text-secondary hover:text-primary transition-colors"
                    >
                      <span>→</span> LinkedIn
                    </a>
                  </CardContent>
                </Card>

                {/* Response Time */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-heading-md">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-secondary">
                      I typically respond within 24-48 hours. For urgent matters, please mention it in your message.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-heading-lg">Send me a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                    />
                    <Textarea
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell me about your project..."
                      rows={6}
                      showCharCount
                      maxLength={1000}
                    />
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isSubmitting}
                      type="submit"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
