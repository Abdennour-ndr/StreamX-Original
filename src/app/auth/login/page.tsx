'use client';

import { Container, Paper, Title, TextInput, PasswordInput, Button, Text, Divider, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IconBrandGoogle } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

export default function LoginPage() {
  const { signIn, signInWithGoogle, user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push('/browse')
    }
  }, [user, router])

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  })

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setLoading(true)
      setError(null)
      await signIn(values.email, values.password)
      notifications.show({
        title: 'Success',
        message: 'Successfully signed in!',
        color: 'green'
      })
      router.push('/browse')
    } catch (err) {
      setError('Invalid email or password')
      notifications.show({
        title: 'Error',
        message: 'Invalid email or password',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle()
      notifications.show({
        title: 'Success',
        message: 'Successfully signed in with Google!',
        color: 'green'
      })
      router.push('/browse')
    } catch (err) {
      setError('Failed to sign in with Google')
      notifications.show({
        title: 'Error',
        message: 'Failed to sign in with Google',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return null // or a loading spinner
  }

  return (
    <Container size="xs" className="min-h-screen flex items-center justify-center">
      <Paper radius="md" p="xl" withBorder className="w-full max-w-md">
        <Title order={2} className="text-center mb-6">Welcome back to StreamX</Title>
        
        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />
          
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
          />

          {error && (
            <Text color="red" size="sm" className="text-center">
              {error}
            </Text>
          )}

          <Button type="submit" fullWidth loading={loading}>
            Sign in
          </Button>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleSignIn}
          leftSection={<IconBrandGoogle size={20} />}
          className="mb-4"
          loading={loading}
        >
          Continue with Google
        </Button>

        <Group justify="center" mt="md">
          <Text size="sm">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </Text>
        </Group>

        <Group justify="center" mt="md">
          <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </Link>
        </Group>
      </Paper>
    </Container>
  )
} 