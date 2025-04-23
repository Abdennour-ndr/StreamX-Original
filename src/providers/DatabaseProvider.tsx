import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '@/config/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { useAuth } from './AuthProvider'

interface DatabaseContextType {
  userData: any | null
  loading: boolean
  error: string | null
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setUserData(null)
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data())
        } else {
          setUserData(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching user data:', err)
        setError('Failed to load user data')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const value = {
    userData,
    loading,
    error,
  }

  return (
    <DatabaseContext.Provider value={value}>
      {!loading && children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
} 