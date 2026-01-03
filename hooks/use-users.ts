import { useState, useEffect, useCallback } from 'react'
import { User, UserCreateData, UserUpdateData, UserListResponse, UserOperationResponse } from '@/lib/types/users'
import { getAllUsers, createUser, updateUser, deleteUser } from '@/lib/api/users-api'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load all users
  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getAllUsers()
      if (response.success && response.data) {
        setUsers(response.data)
      } else {
        setError(response.message || 'Failed to load users')
      }
    } catch (err) {
      setError('Failed to load users')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Create a new user
  const createUserHandler = useCallback(async (userData: UserCreateData): Promise<UserOperationResponse> => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await createUser(userData)

      if (result.success) {
        // Reload users to get the updated list
        await loadUsers()
      } else {
        setError(result.message || 'Failed to create user')
      }

      return result
    } catch (err) {
      const errorMsg = 'Failed to create user'
      setError(errorMsg)
      console.error(err)
      return { success: false, message: errorMsg }
    } finally {
      setIsSaving(false)
    }
  }, [loadUsers])

  // Update an existing user
  const updateUserHandler = useCallback(async (id: string, userData: UserUpdateData): Promise<UserOperationResponse> => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await updateUser(id, userData)

      if (result.success) {
        // Update local state
        setUsers(prev => prev.map(u =>
          u.id === id
            ? { ...u, ...userData, updatedAt: new Date().toISOString() }
            : u
        ))
      } else {
        setError(result.message || 'Failed to update user')
      }

      return result
    } catch (err) {
      const errorMsg = 'Failed to update user'
      setError(errorMsg)
      console.error(err)
      return { success: false, message: errorMsg }
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Delete a user
  const deleteUserHandler = useCallback(async (id: string): Promise<UserOperationResponse> => {
    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteUser(id)

      if (result.success) {
        // Remove from local state
        setUsers(prev => prev.filter(u => u.id !== id))
      } else {
        setError(result.message || 'Failed to delete user')
      }

      return result
    } catch (err) {
      const errorMsg = 'Failed to delete user'
      setError(errorMsg)
      console.error(err)
      return { success: false, message: errorMsg }
    } finally {
      setIsDeleting(false)
    }
  }, [])

  // Get user by ID (from local state)
  const getUserById = useCallback((id: string): User | undefined => {
    return users.find(u => u.id === id)
  }, [users])

  // Load users on mount
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return {
    users,
    isLoading,
    isSaving,
    isDeleting,
    error,
    loadUsers,
    createUser: createUserHandler,
    updateUser: updateUserHandler,
    deleteUser: deleteUserHandler,
    getUserById,
  }
}
