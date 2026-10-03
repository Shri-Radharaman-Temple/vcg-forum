'use client'

import * as React from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Main } from '@/components/app/shell'
import { PageTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/components/app/session'
import { ROLES, can } from '@/lib/rbac'
import { currentUser, pendingDevotees } from '@/data/mock'
import { cn } from '@/lib/utils'
import type { AccountStatus, AvatarTone } from '@/types'

interface Row {
  id: string
  name: string
  email: string
  initials: string
  avatarTone: AvatarTone
  role: string
  status: AccountStatus
  joined: string
}

/** A directory of members, filterable by account state (spec §17). */
const ROWS: Row[] = [
  {
    id: 'u_govind',
    name: currentUser.name,
    email: currentUser.email,
    initials: 'GD',
    avatarTone: 'sand',
    role: 'Initiated Devotee',
    status: 'ACTIVE',
    joined: '11 Mar 2024',
  },
  {
    id: 'u_anand',
    name: 'Anand Mishra',
    email: 'anand@example.com',
    initials: 'AM',
    avatarTone: 'dust',
    role: 'Admin',
    status: 'ACTIVE',
    joined: '02 Jan 2023',
  },
  {
    id: 'u_radhika',
    name: 'Radhika Sharma',
    email: 'radhika@example.com',
    initials: 'RS',
    avatarTone: 'clay',
    role: 'Moderator',
    status: 'ACTIVE',
    joined: '19 Jul 2024',
  },
  {
    id: 'u_madhav',
    name: 'Madhav Das',
    email: 'madhav@example.com',
    initials: 'MD',
    avatarTone: 'stone',
    role: 'Content Curator',
    status: 'ACTIVE',
    joined: '05 Feb 2025',
  },
  {
    id: 'u_vikram',
    name: 'Vikram S',
    email: 'vikram@example.com',
    initials: 'VS',
    avatarTone: 'dust',
    role: 'Initiated Devotee',
    status: 'SUSPENDED',
    joined: '28 Nov 2024',
  },
  ...pendingDevotees.map((d) => ({
    id: d.id,
    name: d.name,
    email: d.email,
    initials: d.initials,
    avatarTone: d.avatarTone,
    role: '—',
    status: 'PENDING_APPROVAL' as AccountStatus,
    joined: d.registeredAt,
  })),
]

type Filter = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED'

export default function UsersPage() {
  const { user } = useSession()
  const [filter, setFilter] = React.useState<Filter>('ACTIVE')
  const [query, setQuery] = React.useState('')

  const canSuspend = can(user, 'admin.users.suspend')
  const rows = ROWS.filter(
    (r) =>
      r.status === filter &&
      (!query ||
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.email.toLowerCase().includes(query.toLowerCase())),
  )

  return (
    <Main className="gap-6 lg:gap-7 px-5 lg:px-12 py-6 lg:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <PageTitle deva="सदस्य">Users</PageTitle>
        <label className="flex h-10 w-full items-center sm:w-[300px] gap-2.5 rounded-[10px] border border-line-strong bg-surface px-3.5 focus-within:border-tulsi">
          <MagnifyingGlass size={17} weight="light" className="text-muted-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email"
            aria-label="Search users"
            className="flex-1 bg-transparent text-[14px] font-light placeholder:text-muted-2 focus:outline-none max-lg:text-[16px]"
          />
        </label>
      </header>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="border-b border-line">
          <TabsTrigger value="ACTIVE">Active</TabsTrigger>
          <TabsTrigger value="PENDING_APPROVAL">Pending</TabsTrigger>
          <TabsTrigger value="SUSPENDED">Suspended</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex max-w-[900px] flex-col pb-12">
        <div className="hidden grid-cols-[1fr_180px_120px_110px] gap-4 border-b md:grid border-line pb-2 text-[11px] uppercase tracking-[0.1em] text-muted-2">
          <span>Devotee</span>
          <span>Role</span>
          <span>Joined</span>
          <span />
        </div>

        {rows.length === 0 ? (
          <p className="m-0 py-6 text-[14px] font-light text-muted">
            No members in this state.
          </p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2.5 border-b border-line py-3 md:grid-cols-[1fr_180px_120px_110px] md:gap-4"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Avatar initials={r.initials} tone={r.avatarTone} size="lg" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[15px] text-ink">{r.name}</span>
                  <span className="truncate text-[12px] font-light text-muted">
                    {r.email}
                  </span>
                </span>
              </span>

              <select
                defaultValue={r.role}
                disabled={!can(user, 'admin.roles.manage')}
                aria-label={`Role for ${r.name}`}
                className="h-8 rounded-[8px] border border-line-strong bg-surface px-2 text-[13px] font-light text-ink-2 disabled:opacity-60 max-md:order-3 max-lg:text-[16px]"
              >
                <option value="—">—</option>
                {ROLES.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>

              <span className="text-[13px] font-light text-muted max-md:order-4 max-md:justify-self-end">
                {r.joined}
              </span>

              {canSuspend ? (
                <Button
                  size="sm"
                  variant={r.status === 'SUSPENDED' ? 'outline' : 'danger'}
                  className={cn('justify-self-end max-md:order-2 md:justify-self-start')}
                >
                  {r.status === 'SUSPENDED' ? 'Restore' : 'Suspend'}
                </Button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </Main>
  )
}
