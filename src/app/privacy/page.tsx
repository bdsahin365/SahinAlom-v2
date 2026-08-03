import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Container from '@/components/layout/Container';
import { SITE_CONFIG } from '@/config/constants';

export default function Privacy() {
  return (
    <div className="bg-background">
      <section className="py-20">
        <Container className="max-w-4xl">
          <h1 className="text-display-lg mb-8">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body-md text-secondary">
                  Welcome to the privacy policy for {SITE_CONFIG.name}&apos;s portfolio website. I am committed to protecting your privacy and ensuring you have a positive experience on my website. This policy outlines how I collect, use, and protect your information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information I Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-heading-md mb-2">Contact Information</h3>
                  <p className="text-body-md text-secondary">
                    When you submit the contact form, I collect your name, email address, subject, and message. This information is used solely for responding to your inquiry.
                  </p>
                </div>
                <div>
                  <h3 className="text-heading-md mb-2">Analytics</h3>
                  <p className="text-body-md text-secondary">
                    I may use analytics tools to track how you interact with my website. This helps me improve the user experience and understand which content is most valuable.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How I Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="text-body-md text-secondary flex gap-2">
                    <span className="text-primary">▸</span>
                    <span>To respond to your inquiries and provide customer service</span>
                  </li>
                  <li className="text-body-md text-secondary flex gap-2">
                    <span className="text-primary">▸</span>
                    <span>To improve my website and services</span>
                  </li>
                  <li className="text-body-md text-secondary flex gap-2">
                    <span className="text-primary">▸</span>
                    <span>To send you information about services or updates</span>
                  </li>
                  <li className="text-body-md text-secondary flex gap-2">
                    <span className="text-primary">▸</span>
                    <span>To comply with legal obligations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body-md text-secondary">
                  I implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body-md text-secondary">
                  My website may contain links to third-party websites. I am not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any personal information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body-md text-secondary">
                  You have the right to access, update, or delete your personal information at any time. To exercise these rights, please contact me at{' '}
                  <a href={`mailto:${SITE_CONFIG.links.email}`} className="text-primary hover:text-primary-600">
                    {SITE_CONFIG.links.email}
                  </a>
                  .
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body-md text-secondary">
                  I may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the website following any changes constitutes your acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body-md text-secondary">
                  If you have questions about this privacy policy, please contact me at{' '}
                  <a href={`mailto:${SITE_CONFIG.links.email}`} className="text-primary hover:text-primary-600">
                    {SITE_CONFIG.links.email}
                  </a>
                  .
                </p>
              </CardContent>
            </Card>

            <div className="pt-8 text-center text-secondary text-sm">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
