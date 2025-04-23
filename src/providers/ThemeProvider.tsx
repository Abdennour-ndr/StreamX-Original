import { createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme } from '@mantine/hooks'

interface ThemeContextType {
  colorScheme: 'light' | 'dark'
  toggleColorScheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(preferredColorScheme)

  useEffect(() => {
    const savedColorScheme = localStorage.getItem('colorScheme')
    if (savedColorScheme) {
      setColorScheme(savedColorScheme as 'light' | 'dark')
    }
  }, [])

  const toggleColorScheme = () => {
    const newColorScheme = colorScheme === 'light' ? 'dark' : 'light'
    setColorScheme(newColorScheme)
    localStorage.setItem('colorScheme', newColorScheme)
  }

  const value = {
    colorScheme,
    toggleColorScheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 