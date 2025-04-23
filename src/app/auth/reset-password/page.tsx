'use client';

import { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values: { email: string }) => {
    try {
      await resetPassword(values.email);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError('Failed to send reset password email. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Stack spacing="xl">
        <Title order={1} align="center">
          Reset Password
        </Title>
        <Text align="center" color="dimmed">
          Enter your email address and we'll send you a link to reset your password.
        </Text>

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
            Password reset email sent! Please check your inbox.
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps('email')}
            />
            <Button type="submit" fullWidth>
              Send Reset Link
            </Button>
          </Stack>
        </form>

        <Text align="center" size="sm">
          Remember your password?{' '}
          <Link href="/auth/login" passHref>
            <Text component="a" color="blue" underline>
              Sign in
            </Text>
          </Link>
        </Text>
      </Stack>
    </Container>
  );
} 