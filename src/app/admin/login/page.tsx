'use client';

import { useState } from 'react';
import { Container, TextInput, PasswordInput, Button, Title, Alert } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // كلمة المرور المؤقتة للتجربة
    if (email === 'admin@test.com' && password === 'admin123') {
      // حفظ حالة تسجيل الدخول في localStorage
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin/users');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="xl" ta="center">تسجيل دخول المسؤول</Title>
      
      {error && (
        <Alert color="red" mb="xl">
          {error}
        </Alert>
      )}

      <TextInput
        label="البريد الإلكتروني"
        placeholder="أدخل بريدك الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mb="md"
      />

      <PasswordInput
        label="كلمة المرور"
        placeholder="أدخل كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb="xl"
      />

      <Button 
        fullWidth 
        onClick={handleLogin}
      >
        تسجيل الدخول
      </Button>
    </Container>
  );
} 