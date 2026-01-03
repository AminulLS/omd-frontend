'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/lib/types/users'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default mock user for development
const defaultMockUser: User = {
  id: 'u1',
  name: 'John Smith',
  email: 'john@company.com',
  status: 'active',
  role: 'admin',
  profile: {
    department: 'Engineering',
    location: 'San Francisco, CA',
    avatarUrl: '/avatars/shadcn.jpg',
    bio: 'Senior administrator with 10+ years of experience.',
    phone: '+1 (555) 100-1001',
  },
  security: {
    twoFactorEnabled: true,
    lastLogin: new Date().toISOString(),
    passwordChangedAt: '2024-12-01T00:00:00Z',
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    theme: 'system',
    language: 'en',
  },
  partners: [
    { partnerId: '1', partnerName: 'TechGlobal Inc.', role: 'main_user' },
  ],
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session on mount
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('currentUser')
        // Auto-login with default user for development
        setUser(defaultMockUser)
        localStorage.setItem('currentUser', JSON.stringify(defaultMockUser))
      }
    } else {
      // Auto-login with default user for development
      setUser(defaultMockUser)
      localStorage.setItem('currentUser', JSON.stringify(defaultMockUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a mock login - in production, this would call your API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock user data - in production, fetch from API based on credentials
      const mockUser: User = {
        ...defaultMockUser,
        email: email,
        updatedAt: new Date().toISOString(),
      }

      setUser(mockUser)
      localStorage.setItem('currentUser', JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() }
      setUser(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}