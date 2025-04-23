import React, { createContext, useContext, useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';

type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: (value?: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

  useEffect(() => {
    // Load saved theme preference from localStorage
    const savedTheme = localStorage.getItem('theme') as ColorScheme | null;
    if (savedTheme) {
      setColorScheme(savedTheme);
    }
  }, []);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    localStorage.setItem('theme', nextColorScheme);
  };

  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        defaultRadius: 'md',
        fontFamily: 'Inter, sans-serif',
        headings: {
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Button: {
            defaultProps: {
              size: 'md',
            },
          },
          Input: {
            defaultProps: {
              size: 'md',
            },
          },
          Select: {
            defaultProps: {
              size: 'md',
            },
          },
        },
      }}
    >
      <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
        {children}
      </ThemeContext.Provider>
    </MantineProvider>
  );
} 