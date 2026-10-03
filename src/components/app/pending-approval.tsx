'use client'

import { HourglassMedium, SealCheck, Prohibit } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useSession } from '@/components/app/session'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

/**
 * The waiting screen (spec §3.3). A devotee who authenticates successfully but
 * is not yet approved sees this instead of the application — never a broken or
 * half-populated feed.
 */
export function PendingApproval({ user }: { user: User }) {
  const { actAs } = useSession()

  const copy = {
    PENDING_APPROVAL: {
      icon: HourglassMedium,
      title: 'Your account has been submitted for approval',
      body: 'An administrator of the parivar will review your registration. You will be notified by email once your account has been approved.',
    },
    REGISTERED: {
      icon: HourglassMedium,
      title: 'Almost there',
      body: 'Complete your initiation details so an administrator can review your registration.',
    },
    REJECTED: {
      icon: Prohibit,
      title: 'Your registration was not approved',
      body: 'If you believe this was a mistake, please reply to the email you received or contact the parivar office.',
    },
    SUSPENDED: {
      icon: Prohibit,
      title: 'Your account is suspended',
      body: 'Access to the community has been paused. Please contact a moderator for details.',
    },
    DEACTIVATED: {
      icon: Prohibit,
      title: 'Your account is deactivated',
      body: 'Sign in again or contact the parivar office to restore access.',
    },
  } as const

  const state =
    copy[user.status as keyof typeof copy] ?? copy.PENDING_APPROVAL
  const Icon = state.icon

  return (
    <div className="flex min-h-screen items-center justify-center bg-ground px-6">
      <div className="flex w-full max-w-[520px] flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[20px] tracking-[0.28em] text-ink">VCG</span>
          <span className="deva text-[13px]">श्री राधारमण परिवार</span>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-tint">
          <Icon size={28} weight="light" className="text-terracotta-ink" />
        </div>

        <h1 className="m-0 text-[28px] font-light leading-[1.25]">
          {state.title}
        </h1>
        <p className="m-0 max-w-[420px] text-[15px] font-light leading-[1.65] text-ink-3">
          {state.body}
        </p>

        <div className="flex w-full flex-col gap-2 rounded-[12px] border border-line bg-surface p-5 text-left">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row
            label="Status"
            value={user.status.replace('_', ' ').toLowerCase()}
            capitalize
          />
        </div>

        {/* Demo control — stands in for an administrator approving the account. */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <span className="text-[12px] font-light text-muted-2">
            Demo · simulate the administrator&rsquo;s decision
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => actAs({ status: 'ACTIVE' })}
            >
              <SealCheck size={15} weight="light" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => actAs({ status: 'REJECTED' })}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  capitalize = false,
}: {
  label: string
  value: string
  /** Only the status is re-cased for display — an email must render verbatim. */
  capitalize?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-[14px] font-light">
      <span className="text-muted">{label}</span>
      <span className={cn('text-ink', capitalize && 'capitalize')}>{value}</span>
    </div>
  )
}
