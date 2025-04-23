'use client';

import { ReactNode } from 'react';
import { Container } from '@mantine/core';

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <Container size="lg" py="xl">
      {children}
    </Container>
  );
} 