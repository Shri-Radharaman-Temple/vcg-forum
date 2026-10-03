'use client'

import * as React from 'react'
import { Main } from '@/components/app/shell'
import { PageTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSession } from '@/components/app/session'
import { ALL_PERMISSIONS, ROLES, can } from '@/lib/rbac'
import { cn } from '@/lib/utils'
import type { Permission } from '@/types'

/**
 * Roles and permissions (spec §20).
 *
 * Permissions are edited as a matrix rather than hard-coded per role, which is
 * what lets an administrator define a new organisational role later without a
 * deployment.
 */
export default function RolesPage() {
  const { user } = useSession()
  const [selectedId, setSelectedId] = React.useState(ROLES[3].id)
  const [granted, setGranted] = React.useState<Record<string, Permission[]>>(
    Object.fromEntries(ROLES.map((r) => [r.id, r.permissions])),
  )

  const role = ROLES.find((r) => r.id === selectedId)!
  const allowed = can(user, 'admin.roles.manage')

  // Group permissions by their dotted prefix so the matrix stays readable.
  const groups = React.useMemo(() => {
    const out: Record<string, Permission[]> = {}
    for (const p of ALL_PERMISSIONS) {
      const key = p.split('.')[0]
      ;(out[key] ??= []).push(p)
    }
    return out
  }, [])

  const toggle = (p: Permission) =>
    setGranted((prev) => {
      const list = prev[selectedId]
      return {
        ...prev,
        [selectedId]: list.includes(p)
          ? list.filter((x) => x !== p)
          : [...list, p],
      }
    })

  return (
    <Main className="gap-7 px-12 py-10">
      <header className="flex items-end justify-between gap-6">
        <PageTitle deva="भूमिकाएँ">Roles</PageTitle>
        {allowed ? <Button variant="accent">New role</Button> : null}
      </header>

      <div className="flex gap-10 pb-12">
        <div className="flex w-[260px] shrink-0 flex-col gap-1.5">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedId(r.id)}
              className={cn(
                'flex flex-col gap-0.5 rounded-[10px] border px-3.5 py-3 text-left transition-colors',
                r.id === selectedId
                  ? 'border-tulsi bg-tulsi-tint'
                  : 'border-line hover:border-line-deep',
              )}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] text-ink">{r.name}</span>
                <span className="text-[12px] font-light text-muted">
                  {r.memberCount}
                </span>
              </span>
              <span className="text-[12px] font-light leading-[1.45] text-muted">
                {r.system ? 'System role' : 'Custom role'}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-[20px] font-light text-ink">{role.name}</span>
            <span className="text-[14px] font-light leading-[1.6] text-ink-4">
              {role.description}
            </span>
          </div>

          {!allowed ? (
            <p className="m-0 text-[13px] font-light text-muted">
              Viewing only — editing requires{' '}
              <code className="font-mono text-[12px]">admin.roles.manage</code>.
            </p>
          ) : null}

          {Object.entries(groups).map(([group, perms]) => (
            <div key={group} className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted-2">
                {group}
              </span>
              <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                {perms.map((p) => (
                  <label
                    key={p}
                    className={cn(
                      'flex items-center gap-2.5 py-1 text-[13px] font-light',
                      allowed ? 'cursor-pointer text-ink-2' : 'text-muted',
                    )}
                  >
                    <input
                      type="checkbox"
                      disabled={!allowed || role.id === 'super_admin'}
                      checked={granted[selectedId].includes(p)}
                      onChange={() => toggle(p)}
                      className="h-3.5 w-3.5 shrink-0 accent-[#4F7A5A]"
                    />
                    <code className="font-mono text-[12px]">{p}</code>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Main>
  )
}
