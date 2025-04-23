'use client';

import { MantineProvider, createTheme } from '@mantine/core';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
  },
});

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AuthProvider>
        {children}
      </AuthProvider>
    </MantineProvider>
  );
} 