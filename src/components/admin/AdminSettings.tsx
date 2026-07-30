import React, { useState } from 'react';
import { Button, Input, Card, Alert } from '@/shared';

interface AppSettings {
  siteName: string;
  siteEmail: string;
  siteBio: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  theme: 'light' | 'dark' | 'auto';
  itemsPerPage: number;
  enableNotifications: boolean;
  enableAnalytics: boolean;
}

interface AdminSettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export function AdminSettings({ settings, onSave }: AdminSettingsProps) {
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      onSave(formData);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {message && (
        <Alert variant={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
        </Alert>
      )}

      {/* General Settings */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">General Settings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Basic site information
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <Input
              value={formData.siteName}
              onChange={(e) =>
                setFormData({ ...formData, siteName: e.target.value })
              }
              placeholder="Your site name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.siteEmail}
              onChange={(e) =>
                setFormData({ ...formData, siteEmail: e.target.value })
              }
              placeholder="contact@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={formData.siteBio}
              onChange={(e) =>
                setFormData({ ...formData, siteBio: e.target.value })
              }
              className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              rows={3}
              placeholder="Your bio"
            />
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Social Links</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect your social profiles
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <Input
              value={formData.socialLinks.github || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, github: e.target.value },
                })
              }
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <Input
              value={formData.socialLinks.linkedin || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                })
              }
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Twitter</label>
            <Input
              value={formData.socialLinks.twitter || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                })
              }
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Display Settings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customize how content is displayed
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select
              value={formData.theme}
              onChange={(e) =>
                setFormData({ ...formData, theme: e.target.value as any })
              }
              className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Items Per Page
            </label>
            <Input
              type="number"
              value={formData.itemsPerPage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  itemsPerPage: parseInt(e.target.value) || 10,
                })
              }
              min="5"
              max="100"
            />
          </div>
        </div>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enable or disable features
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enableNotifications}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  enableNotifications: e.target.checked,
                })
              }
              className="mr-2"
            />
            <span className="text-sm">Enable Notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enableAnalytics}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  enableAnalytics: e.target.checked,
                })
              }
              className="mr-2"
            />
            <span className="text-sm">Enable Analytics</span>
          </label>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
        <Button
          onClick={() => setFormData(settings)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
