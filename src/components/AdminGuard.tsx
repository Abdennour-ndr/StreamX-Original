'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { isSuperAdmin } from '@/lib/firebase/admin';
import { Container, Loader, Text, Center } from '@mantine/core';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true); // Set to true by default

  useEffect(() => {
    // Skip all checks temporarily
    setIsLoading(false);
    setIsAuthorized(true);
  }, []);

  if (isLoading) {
    return (
      <Container size="sm" py="xl">
        <Center style={{ minHeight: '50vh' }}>
          <Loader size="xl" />
        </Center>
      </Container>
    );
  }

  if (!isAuthorized) {
    return (
      <Container size="sm" py="xl">
        <Center style={{ minHeight: '50vh' }}>
          <Text size="xl" fw={500}>
            غير مصرح لك بالوصول إلى هذه الصفحة
          </Text>
        </Center>
      </Container>
    );
  }

  return <>{children}</>;
} 