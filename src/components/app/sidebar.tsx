'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Books,
  CalendarBlank,
  ChatCircle,
  FlowerLotus,
  GearSix,
  House,
  MagnifyingGlass,
  Plus,
  ShieldCheck,
  type Icon,
} from '@phosphor-icons/react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { can, canAny, ADMIN_PERMISSIONS_ANY } from '@/lib/rbac'
import type { Permission, User } from '@/types'

/**
 * Ported from `Sidebar.dc.html`. Fixed 248px rail, hairline right border,
 * active item in tulsi tint. Nav entries are permission-gated (spec §20) —
 * a devotee without `chat.view` simply does not see Chat.
 */

export interface NavItem {
  href: string
  label: string
  icon: Icon
  permission: Permission
  badge?: number
}

/** Permission-filtered primary navigation, shared by the rail and the phone tab bar. */
export function navItemsFor({
  user,
  unreadChat = 0,
  unreadNotifications = 0,
}: {
  user: User
  unreadChat?: number
  unreadNotifications?: number
}): NavItem[] {
  return (
    [
      { href: '/', label: 'Home', icon: House, permission: 'feed.view' },
      {
        href: '/sadhna',
        label: 'Sadhna',
        icon: FlowerLotus,
        permission: 'sadhna.view',
      },
      {
        href: '/chat',
        label: 'Chat',
        icon: ChatCircle,
        permission: 'chat.view',
        badge: unreadChat,
      },
      {
        href: '/resources',
        label: 'Resources',
        icon: Books,
        permission: 'resource.view',
      },
      {
        href: '/events',
        label: 'Events',
        icon: CalendarBlank,
        permission: 'event.view',
      },
      {
        href: '/notifications',
        label: 'Notifications',
        icon: Bell,
        permission: 'feed.view',
        badge: unreadNotifications,
      },
    ] satisfies NavItem[]
  ).filter((item) => can(user, item.permission))
}

export function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function Sidebar({
  user,
  unreadChat = 0,
  unreadNotifications = 0,
  className,
}: {
  user: User
  unreadChat?: number
  unreadNotifications?: number
  className?: string
}) {
  const pathname = usePathname()

  const items = navItemsFor({ user, unreadChat, unreadNotifications })

  const showAdmin = canAny(user, ADMIN_PERMISSIONS_ANY)

  return (
    <aside
      className={cn(
        'flex h-full w-[248px] shrink-0 flex-col gap-[26px] border-r border-line bg-rail px-[18px] pb-6 pt-[30px]',
        className,
      )}
    >
      <div className="flex flex-col gap-0.5 px-2.5">
        <Link
          href="/"
          className="text-[20px] leading-none tracking-[0.28em] text-ink hover:text-ink"
        >
          VCG
        </Link>
        <span className="deva text-[13px] leading-[1.4]">श्री राधारमण परिवार</span>
      </div>

      <button
        type="button"
        className="flex h-[38px] items-center gap-2.5 rounded-[10px] border border-line-strong bg-rail-input px-3 text-[14px] font-light text-muted transition-colors hover:border-line-deep"
      >
        <MagnifyingGlass size={17} weight="light" />
        <span className="flex-1 text-left">Search everything</span>
        <span className="font-mono text-[11px] text-muted-2">⌘K</span>
      </button>

      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = isActive(pathname, item.href)
          const IconCmp = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex h-10 items-center gap-3 rounded-[10px] px-3 text-[15px] transition-colors',
                active
                  ? 'bg-tulsi-tint font-normal text-tulsi-ink hover:text-tulsi-ink'
                  : 'font-light text-ink-4 hover:bg-[#EAE2D6] hover:text-ink-4',
              )}
            >
              {/* Phosphor Light throughout — the design marks the active
                  item with the tulsi tint, never a heavier icon. */}
              <IconCmp size={20} weight="light" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="text-[11px] font-normal text-terracotta">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          )
        })}

        {showAdmin ? (
          <Link
            href="/admin"
            className={cn(
              'mt-2 flex h-10 items-center gap-3 rounded-[10px] border-t border-line px-3 pt-2 text-[15px] transition-colors',
              pathname.startsWith('/admin')
                ? 'font-normal text-tulsi-ink'
                : 'font-light text-ink-4 hover:text-ink',
            )}
          >
            <ShieldCheck size={20} weight="light" />
            <span className="flex-1">Admin</span>
          </Link>
        ) : null}
      </nav>

      {can(user, 'feed.create') ? (
        <Link
          href="/posts/new"
          className="flex h-10 items-center justify-center gap-2 rounded-[10px] border border-terracotta text-[14px] font-normal text-terracotta transition-colors hover:bg-terracotta-tint hover:text-terracotta"
        >
          <Plus size={16} weight="light" />
          New post
        </Link>
      ) : null}

      <div className="flex-1" />

      <Link
        href="/profile"
        className="flex items-center gap-3 border-t border-line px-2.5 pt-3 hover:text-ink"
      >
        <Avatar
          initials={user.initials}
          tone={user.avatarTone}
          src={user.avatarUrl}
          size="lg"
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] leading-[1.2] text-ink">
            {user.name}
          </span>
          <span className="text-[12px] font-light leading-[1.3] text-muted">
            Profile &amp; saved
          </span>
        </span>
        <GearSix size={18} weight="light" className="text-muted" />
      </Link>
    </aside>
  )
}
