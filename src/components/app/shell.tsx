'use client'

import { Sidebar } from '@/components/app/sidebar'
import { useSession } from '@/components/app/session'
import { PendingApproval } from '@/components/app/pending-approval'
import { hasAppAccess } from '@/lib/rbac'
import { unreadChatCount, unreadNotificationCount } from '@/data/mock'
import { cn } from '@/lib/utils'

/**
 * The 1440×900 desktop frame from the design: 248px rail, flexible main,
 * optional right rail supplied by each page.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useSession()

  // Authentication and authorization are separate (spec §3.3): a devotee can be
  // signed in and still be waiting, in which case they never see the app.
  if (!hasAppAccess(user)) {
    return <PendingApproval user={user} />
  }

  return (
    <div className="flex h-screen min-h-[720px] overflow-hidden bg-ground text-ink">
      <Sidebar
        user={user}
        unreadChat={unreadChatCount}
        unreadNotifications={unreadNotificationCount}
      />
      {children}
    </div>
  )
}

/** Scrolling content column. Every page's primary region. */
export function Main({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <main
      className={cn(
        'scroll-quiet flex min-w-0 flex-1 flex-col overflow-y-auto',
        padded && 'gap-[26px] px-14 py-10',
        className,
      )}
    >
      {children}
    </main>
  )
}

/** Right-hand rail — announcements, agenda, related content. */
export function Rail({
  children,
  width = 340,
  className,
}: {
  children: React.ReactNode
  width?: number
  className?: string
}) {
  return (
    <aside
      style={{ width }}
      className={cn(
        'scroll-quiet flex shrink-0 flex-col gap-8 overflow-y-auto border-l border-line px-8 py-10',
        className,
      )}
    >
      {children}
    </aside>
  )
}
