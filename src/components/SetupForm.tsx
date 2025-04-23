'use client';

import { useState } from 'react';
import { Container, Title, TextInput, Button, Stack, Text, Alert } from '@mantine/core';
import { setupSuperAdmin } from '@/lib/firebase/setup';
import { useRouter } from 'next/navigation';

export default function SetupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await setupSuperAdmin(email, password, displayName);
      router.push('/auth/login');
    } catch (err: any) {
      console.error('Setup error:', err);
      if (err.message.includes('email-already-in-use')) {
        setError('هذا البريد الإلكتروني مستخدم بالفعل. الرجاء استخدام بريد إلكتروني آخر.');
      } else if (err.message.includes('weak-password')) {
        setError('كلمة المرور ضعيفة. يجب أن تحتوي على 6 أحرف على الأقل.');
      } else if (err.message.includes('invalid-email')) {
        setError('الرجاء إدخال بريد إلكتروني صحيح.');
      } else {
        setError(`فشل إنشاء حساب المشرف: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Stack>
        <Title order={1}>إعداد حساب المشرف</Title>
        <Text>قم بإنشاء حساب المشرف الأول للوصول إلى لوحة التحكم.</Text>
        
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@streamx.com"
            />
            <TextInput
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              description="يجب أن تحتوي على 6 أحرف على الأقل"
            />
            <TextInput
              label="اسم العرض"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="اسم المشرف"
            />
            {error && (
              <Alert color="red" title="خطأ">
                {error}
              </Alert>
            )}
            <Button type="submit" loading={loading}>
              إنشاء حساب المشرف
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
} 