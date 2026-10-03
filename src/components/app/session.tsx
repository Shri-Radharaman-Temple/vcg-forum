'use client'

import * as React from 'react'
import { currentUser } from '@/data/mock'
import { permissionsForRoles } from '@/lib/rbac'
import type { AccountStatus, User } from '@/types'

/**
 * Session context.
 *
 * Stands in for the real auth layer. The important property is that everything
 * downstream reads `user.permissions` and `user.status` — swapping this for a
 * session cookie + `/me` fetch is a change confined to this file.
 */

interface SessionValue {
  user: User
  /** Demo affordance: re-issue the session as a different role or status so the
   *  RBAC gates and the approval screen can be exercised without a backend. */
  actAs: (opts: { roleIds?: string[]; status?: AccountStatus }) => void
  reset: () => void
}

const SessionContext = React.createContext<SessionValue | null>(null)

const STORAGE_KEY = 'vcg.demo-session'

interface StoredSession {
  roleIds: string[]
  status: AccountStatus
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(currentUser)

  // Restore after mount rather than during render: the server has no access to
  // localStorage, so reading it in the initial state would desynchronise the
  // first client render from the server HTML and trip a hydration error.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const stored = JSON.parse(raw) as StoredSession
      if (!Array.isArray(stored.roleIds) || !stored.status) return
      setUser((prev) => ({
        ...prev,
        roleIds: stored.roleIds,
        status: stored.status,
        permissions: permissionsForRoles(stored.roleIds),
      }))
    } catch {
      // A malformed or unavailable store just means the default session.
    }
  }, [])

  const actAs = React.useCallback(
    ({ roleIds, status }: { roleIds?: string[]; status?: AccountStatus }) => {
      setUser((prev) => {
        const nextRoles = roleIds ?? prev.roleIds
        const nextStatus = status ?? prev.status
        try {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ roleIds: nextRoles, status: nextStatus }),
          )
        } catch {
          // Persistence is a convenience; the switch still applies in-session.
        }
        return {
          ...prev,
          roleIds: nextRoles,
          status: nextStatus,
          permissions: permissionsForRoles(nextRoles),
        }
      })
    },
    [],
  )

  const reset = React.useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore — falling back to the default session below is enough.
    }
    setUser(currentUser)
  }, [])

  const value = React.useMemo(
    () => ({ user, actAs, reset }),
    [user, actAs, reset],
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSession(): SessionValue {
  const ctx = React.useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return ctx
}
