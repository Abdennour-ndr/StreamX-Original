'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Switch,
  Button,
  Alert,
  Divider,
} from '@mantine/core';
import { IconAlertCircle, IconTrash } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement account deletion logic
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError('Failed to delete account. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <ProtectedRoute>
      <Container size="xs" py="xl">
        <Stack spacing="xl">
          <Title order={1} align="center">
            Settings
          </Title>

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
              Settings updated successfully!
            </Alert>
          )}

          <Stack spacing="md">
            <Title order={2}>Notifications</Title>
            <Switch
              label="Enable notifications"
              checked={notifications}
              onChange={(event) => setNotifications(event.currentTarget.checked)}
            />
            <Switch
              label="Email updates"
              checked={emailUpdates}
              onChange={(event) => setEmailUpdates(event.currentTarget.checked)}
            />
          </Stack>

          <Divider />

          <Stack spacing="md">
            <Title order={2}>Account</Title>
            <Button
              variant="light"
              color="red"
              leftIcon={<IconTrash size={16} />}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Stack>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
} 