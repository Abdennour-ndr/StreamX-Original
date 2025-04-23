'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Switch,
  Select,
  Button,
  Alert,
  Divider,
} from '@mantine/core';
import { IconAlertCircle, IconDeviceTv, IconLanguage } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
];

const QUALITY_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '1080p', label: '1080p' },
  { value: '720p', label: '720p' },
  { value: '480p', label: '480p' },
];

export default function PreferencesPage() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    autoplay: true,
    language: 'en',
    quality: 'auto',
    subtitles: true,
  });

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Implement save preferences logic
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError('Failed to save preferences. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <ProtectedRoute>
      <Container size="md" py="xl">
        <Stack spacing="xl">
          <Title order={1}>Preferences</Title>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="filled"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              title="Success"
              color="green"
              variant="filled"
            >
              Preferences saved successfully!
            </Alert>
          )}

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack spacing="xl">
              <div>
                <Title order={2} mb="md">Notifications</Title>
                <Stack spacing="md">
                  <Switch
                    label="Enable notifications"
                    checked={preferences.notifications}
                    onChange={(event) =>
                      handlePreferenceChange('notifications', event.currentTarget.checked)
                    }
                  />
                  <Switch
                    label="Email updates"
                    checked={preferences.emailUpdates}
                    onChange={(event) =>
                      handlePreferenceChange('emailUpdates', event.currentTarget.checked)
                    }
                  />
                </Stack>
              </div>

              <Divider />

              <div>
                <Title order={2} mb="md">Playback</Title>
                <Stack spacing="md">
                  <Switch
                    label="Autoplay next episode"
                    checked={preferences.autoplay}
                    onChange={(event) =>
                      handlePreferenceChange('autoplay', event.currentTarget.checked)
                    }
                  />
                  <Switch
                    label="Show subtitles by default"
                    checked={preferences.subtitles}
                    onChange={(event) =>
                      handlePreferenceChange('subtitles', event.currentTarget.checked)
                    }
                  />
                  <Group>
                    <IconDeviceTv size={20} />
                    <Select
                      label="Default quality"
                      value={preferences.quality}
                      onChange={(value) => handlePreferenceChange('quality', value)}
                      data={QUALITY_OPTIONS}
                    />
                  </Group>
                </Stack>
              </div>

              <Divider />

              <div>
                <Title order={2} mb="md">Language</Title>
                <Group>
                  <IconLanguage size={20} />
                  <Select
                    label="Interface language"
                    value={preferences.language}
                    onChange={(value) => handlePreferenceChange('language', value)}
                    data={LANGUAGES}
                  />
                </Group>
              </div>
            </Stack>
          </Card>

          <Group position="right">
            <Button onClick={handleSave}>Save Preferences</Button>
          </Group>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
} 