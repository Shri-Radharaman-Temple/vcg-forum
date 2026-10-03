'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowBendUpLeft,
  At,
  Bell,
  BookmarkSimple,
  CalendarBlank,
  ChatCircle,
  SealCheck,
  type Icon,
} from '@phosphor-icons/react'
import { Main, Rail } from '@/components/app/shell'
import { PageTitle, SectionHead } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { defaultNotificationPrefs, notifications } from '@/data/mock'
import { cn } from '@/lib/utils'
import type { NotificationKind, NotificationPreferences } from '@/types'

const ICONS: Record<NotificationKind, Icon> = {
  reply: ArrowBendUpLeft,
  mention: At,
  message: ChatCircle,
  event: CalendarBlank,
  account: SealCheck,
  resource: BookmarkSimple,
}

const PREF_LABELS: { key: keyof NotificationPreferences; label: string }[] = [
  { key: 'messages', label: 'Messages' },
  { key: 'replies', label: 'Replies' },
  { key: 'mentions', label: 'Mentions' },
  { key: 'events', label: 'Events' },
  { key: 'resources', label: 'New resources' },
  { key: 'account', label: 'Account updates' },
]

/** In-app notifications and per-channel preferences (spec §15). */
export default function NotificationsPage() {
  const [items, setItems] = React.useState(notifications)
  const [prefs, setPrefs] = React.useState(defaultNotificationPrefs)
  const unread = items.filter((n) => !n.read).length

  return (
    <>
      <Main className="gap-6 lg:gap-7 px-5 lg:px-14 py-6 lg:py-10">
        <header className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <PageTitle deva="सूचनाएँ">Notifications</PageTitle>
          {unread > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setItems((prev) => prev.map((n) => ({ ...n, read: true })))
              }
            >
              Mark all read
            </Button>
          ) : null}
        </header>

        <div className="flex flex-col pb-12">
          {items.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Nothing new"
              body="Replies, mentions, messages and event updates appear here."
            />
          ) : (
            items.map((n) => {
              const Icon = ICONS[n.kind]
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() =>
                    setItems((prev) =>
                      prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                    )
                  }
                  className={cn(
                    '-mx-5 flex items-start gap-3.5 border-b border-line px-5 py-3.5 transition-colors hover:bg-[#EFE8DC] lg:mx-0 lg:px-3',
                    !n.read && 'bg-tulsi-tint/40',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      n.read ? 'bg-ground text-muted' : 'bg-tulsi-tint text-tulsi-ink',
                    )}
                  >
                    <Icon size={16} weight="light" />
                  </span>
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span className="text-[15px] font-light leading-[1.5] text-ink-2">
                      {n.actor ? (
                        <span className="font-normal text-ink">{n.actor} </span>
                      ) : null}
                      {n.body}
                    </span>
                    <span className="text-[12px] font-light text-muted">
                      {n.at}
                    </span>
                  </span>
                  {!n.read ? (
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                  ) : null}
                </Link>
              )
            })
          )}
        </div>
      </Main>

      <Rail width={320} className="lg:px-7">
        <div className="flex flex-col gap-4">
          <SectionHead title="Preferences" />
          <p className="m-0 text-[13px] font-light leading-[1.55] text-muted">
            Choose what you are notified about, in the app and by push.
          </p>
          <div className="flex flex-col">
            {PREF_LABELS.map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between gap-3 border-t border-line py-3 text-[14px] font-light text-ink-2"
              >
                {label}
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, [key]: e.target.checked }))
                  }
                  className="h-4 w-4 shrink-0 accent-[#4F7A5A]"
                />
              </label>
            ))}
          </div>
        </div>
      </Rail>
    </>
  )
}
