'use client'

import * as React from 'react'
import { Check, X } from '@phosphor-icons/react'
import { Main } from '@/components/app/shell'
import { PageTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty'
import { useSession } from '@/components/app/session'
import { can } from '@/lib/rbac'
import { pendingDevotees } from '@/data/mock'
import type { PendingDevotee } from '@/types'

type Decision = 'approved' | 'rejected'

/**
 * User approval workflow (spec §19).
 *
 * Approving sets status to APPROVED, assigns the default devotee role, creates
 * a notification and sends an email — all server-side. This screen only issues
 * the decision and reflects the result.
 */
export default function PendingApprovalPage() {
  const { user } = useSession()
  const [decisions, setDecisions] = React.useState<Record<string, Decision>>({})
  const [rejecting, setRejecting] = React.useState<PendingDevotee | null>(null)

  const allowed = can(user, 'admin.users.approve')
  const queue = pendingDevotees.filter((d) => !decisions[d.id])

  return (
    <Main className="gap-7 px-12 py-10">
      <header className="flex items-end justify-between gap-6">
        <PageTitle deva="प्रतीक्षारत">Pending Approval</PageTitle>
        <span className="text-[14px] font-light text-muted">
          {queue.length} awaiting review
        </span>
      </header>

      {!allowed ? (
        <p className="m-0 text-[15px] font-light text-ink-4">
          Your role can view this queue but not act on it. Approval requires the{' '}
          <code className="font-mono text-[13px]">admin.users.approve</code>{' '}
          permission.
        </p>
      ) : null}

      <div className="flex max-w-[760px] flex-col gap-3 pb-12">
        {queue.length === 0 ? (
          <EmptyState
            icon={Check}
            title="Queue is clear"
            body="Every registration has been reviewed."
          />
        ) : (
          queue.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-4 rounded-[12px] border border-line bg-surface p-5"
            >
              <Avatar initials={d.initials} tone={d.avatarTone} size="xl" />
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-[17px] text-ink">{d.name}</span>
                  {d.initiatedName ? (
                    <span className="deva text-[15px]">{d.initiatedName}</span>
                  ) : null}
                </div>
                <span className="text-[14px] font-light text-ink-4">
                  {d.email}
                </span>
                <span className="text-[13px] font-light text-muted">
                  Registered: {d.registeredAt}
                  {d.location ? ` · ${d.location}` : ''}
                </span>
              </div>
              {allowed ? (
                <div className="flex gap-2.5">
                  <Button
                    variant="primary"
                    onClick={() =>
                      setDecisions((p) => ({ ...p, [d.id]: 'approved' }))
                    }
                  >
                    <Check size={16} weight="light" />
                    Approve
                  </Button>
                  <Button variant="outline" onClick={() => setRejecting(d)}>
                    <X size={16} weight="light" />
                    Reject
                  </Button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      {/* Rejection optionally carries an admin note (spec §19). */}
      {rejecting ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#2A241F]/25 px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDecisions((p) => ({ ...p, [rejecting.id]: 'rejected' }))
              setRejecting(null)
            }}
            className="flex w-full max-w-[460px] flex-col gap-4 rounded-[14px] border border-line bg-ground p-6"
          >
            <span className="text-[19px] font-light">
              Reject {rejecting.name}?
            </span>
            <p className="m-0 text-[14px] font-light leading-[1.6] text-ink-4">
              The devotee will be notified that their registration was not
              approved. A note is optional and is kept for the audit trail.
            </p>
            <textarea
              rows={3}
              placeholder="Internal note (optional)"
              className="resize-none rounded-[10px] border border-line-strong bg-surface px-3.5 py-2.5 text-[15px] font-light leading-[1.6] placeholder:text-muted-2 focus:border-tulsi focus:outline-none"
            />
            <div className="flex justify-end gap-2.5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setRejecting(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="danger">
                Reject registration
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </Main>
  )
}
