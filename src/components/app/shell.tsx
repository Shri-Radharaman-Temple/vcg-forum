'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/app/sidebar'
import { ComposeFab, MobileTabBar, MobileTopBar } from '@/components/app/mobile-nav'
import { useSession } from '@/components/app/session'
import { PendingApproval } from '@/components/app/pending-approval'
import { can, hasAppAccess } from '@/lib/rbac'
import { unreadChatCount, unreadNotificationCount } from '@/data/mock'
import { cn } from '@/lib/utils'

/**
 * The 1440×900 desktop frame from the design: 248px rail, flexible main,
 * optional right rail supplied by each page. Below `lg` it becomes a phone
 * app: top bar, one scrolling column (rails stack under the main content)
 * and a bottom tab bar.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useSession()
  const pathname = usePathname()

  // Authentication and authorization are separate (spec §3.3): a devotee can be
  // signed in and still be waiting, in which case they never see the app.
  if (!hasAppAccess(user)) {
    return <PendingApproval user={user} />
  }

  // An open conversation and the composer take the whole phone screen.
  const immersive = pathname.startsWith('/chat/') || pathname === '/posts/new'

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ground text-ink lg:min-h-[720px] lg:flex-row">
      <Sidebar
        user={user}
        unreadChat={unreadChatCount}
        unreadNotifications={unreadNotificationCount}
        className="hidden lg:flex"
      />
      {immersive ? null : (
        <MobileTopBar user={user} unreadNotifications={unreadNotificationCount} />
      )}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="scroll-quiet flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain lg:flex-row lg:overflow-hidden">
          {children}
        </div>
        {pathname === '/' && can(user, 'feed.create') ? <ComposeFab /> : null}
      </div>
      {immersive ? null : (
        <MobileTabBar user={user} unreadChat={unreadChatCount} />
      )}
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
        'scroll-quiet flex min-w-0 flex-1 flex-col lg:overflow-y-auto',
        padded && 'gap-[26px] px-5 py-6 lg:px-14 lg:py-10',
        className,
      )}
    >
      {children}
    </main>
  )
}

/**
 * Right-hand rail — announcements, agenda, related content. On phones it
 * follows the main column as a separate section.
 */
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
      style={{ '--rail-w': `${width}px` } as React.CSSProperties}
      className={cn(
        'scroll-quiet flex shrink-0 flex-col gap-8 border-t border-line px-5 py-8 lg:w-[var(--rail-w)] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-8 lg:py-10',
        className,
      )}
    >
      {children}
    </aside>
  )
}
