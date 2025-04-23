'use client';

import { Container, Paper, Title, TextInput, PasswordInput, Button, Text, Divider, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconBrandGoogle } from '@tabler/icons-react'

export default function SignUpPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) => 
        value !== values.password ? 'Passwords do not match' : null,
    },
  })

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setLoading(true)
      setError(null)
      await signUp(values.email, values.password)
      router.push('/')
    } catch (err) {
      setError('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle()
      router.push('/')
    } catch (err) {
      setError('Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="xs" className="min-h-screen flex items-center justify-center">
      <Paper radius="md" p="xl" withBorder className="w-full max-w-md">
        <Title order={2} className="text-center mb-6">Create your StreamX account</Title>
        
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

          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps('confirmPassword')}
          />

          {error && (
            <Text color="red" size="sm" className="text-center">
              {error}
            </Text>
          )}

          <Button type="submit" fullWidth loading={loading}>
            Create account
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
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </Text>
        </Group>
      </Paper>
    </Container>
  )
} 