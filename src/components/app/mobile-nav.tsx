'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, MagnifyingGlass, Plus, ShieldCheck } from '@phosphor-icons/react'
import { Avatar } from '@/components/ui/avatar'
import { navItemsFor, isActive } from '@/components/app/sidebar'
import { can, canAny, ADMIN_PERMISSIONS_ANY } from '@/lib/rbac'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

/**
 * Phone chrome. Below `lg` the 248px rail gives way to an app-style top bar
 * and a bottom tab bar; both respect the device safe areas so the frame sits
 * correctly when installed to the home screen.
 */
export function MobileTopBar({
  user,
  unreadNotifications = 0,
}: {
  user: User
  unreadNotifications?: number
}) {
  const pathname = usePathname()
  const showAdmin = canAny(user, ADMIN_PERMISSIONS_ANY)

  return (
    <header className="flex shrink-0 items-center gap-1 border-b border-line bg-rail px-4 pb-2 pt-[max(8px,env(safe-area-inset-top))] lg:hidden">
      <Link href="/" className="flex flex-1 flex-col hover:text-ink">
        <span className="text-[17px] leading-none tracking-[0.28em] text-ink">
          VCG
        </span>
        <span className="deva text-[11px] leading-[1.5]">श्री राधारमण परिवार</span>
      </Link>

      <button
        type="button"
        aria-label="Search everything"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink-4"
      >
        <MagnifyingGlass size={21} weight="light" />
      </button>

      {showAdmin ? (
        <Link
          href="/admin"
          aria-label="Admin"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            pathname.startsWith('/admin') ? 'text-tulsi-ink' : 'text-ink-4',
          )}
        >
          <ShieldCheck size={21} weight="light" />
        </Link>
      ) : null}

      {can(user, 'feed.view') ? (
        <Link
          href="/notifications"
          aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ''}`}
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-full',
            pathname.startsWith('/notifications') ? 'text-tulsi-ink' : 'text-ink-4',
          )}
        >
          <Bell size={21} weight="light" />
          {unreadNotifications ? (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-rail bg-terracotta" />
          ) : null}
        </Link>
      ) : null}

      <Link href="/profile" aria-label="Profile" className="ml-1">
        <Avatar
          initials={user.initials}
          tone={user.avatarTone}
          src={user.avatarUrl}
          size="md"
          className={cn(
            pathname.startsWith('/profile') && 'ring-2 ring-tulsi ring-offset-2 ring-offset-rail',
          )}
        />
      </Link>
    </header>
  )
}

export function MobileTabBar({
  user,
  unreadChat = 0,
}: {
  user: User
  unreadChat?: number
}) {
  const pathname = usePathname()
  // Notifications live in the top bar, so the tabs stay at five or fewer.
  const items = navItemsFor({ user, unreadChat }).filter(
    (item) => item.href !== '/notifications',
  )

  return (
    <nav
      aria-label="Primary"
      className="flex shrink-0 border-t border-line bg-rail pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href)
        const IconCmp = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center gap-0.5 pb-1.5 pt-2 text-[11px]',
              active
                ? 'font-normal text-tulsi-ink hover:text-tulsi-ink'
                : 'font-light text-ink-5 hover:text-ink-5',
            )}
          >
            <span
              className={cn(
                'relative flex h-7 w-12 items-center justify-center rounded-full transition-colors',
                active && 'bg-tulsi-tint',
              )}
            >
              <IconCmp size={22} weight="light" />
              {item.badge ? (
                <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] leading-none text-[#F7F2EA]">
                  {item.badge}
                </span>
              ) : null}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

/** Floating compose button for the feed on phones. */
export function ComposeFab() {
  return (
    <Link
      href="/posts/new"
      aria-label="New post"
      className="absolute bottom-4 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-[#F7F2EA] shadow-[0_6px_18px_rgb(90_50_30/0.28)] hover:text-[#F7F2EA] lg:hidden"
    >
      <Plus size={24} weight="light" />
    </Link>
  )
}
