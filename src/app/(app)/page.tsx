'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  CaretDown,
  Image as ImageIcon,
  MegaphoneSimple,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { Main, Rail } from '@/components/app/shell'
import { PostCard } from '@/components/app/post-card'
import { useSession } from '@/components/app/session'
import { Avatar } from '@/components/ui/avatar'
import { Stat } from '@/components/ui/stat'
import { EmptyState } from '@/components/ui/empty'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dot } from '@/components/ui/flag-dot'
import { FLAGS, QUICK_FILTER_FLAGS, flagById } from '@/lib/flags'
import { can } from '@/lib/rbac'
import { headerDateLine } from '@/lib/panchang'
import { events, posts, sadhnaSummary } from '@/data/mock'
import { cn } from '@/lib/utils'
import type { FeedSort } from '@/types'

/** Screen 1a — Home · feed. */
export default function HomePage() {
  const { user } = useSession()
  const [sort, setSort] = React.useState<FeedSort>('latest')
  const [flagFilter, setFlagFilter] = React.useState<string | null>(null)
  const [showAllFlags, setShowAllFlags] = React.useState(false)

  // The greeting date is fixed to the design's reference day so the rendered
  // screen matches the mock; in production this is the request date.
  const today = React.useMemo(() => new Date('2026-09-26T09:00:00+05:30'), [])

  const visible = React.useMemo(() => {
    let list = posts
    if (flagFilter) list = list.filter((p) => p.flagId === flagFilter)
    if (sort === 'saved') list = list.filter((p) => p.savedByMe)
    if (sort === 'popular')
      list = [...list].sort((a, b) => b.likeCount - a.likeCount)
    return list
  }, [sort, flagFilter])

  const quickFlags = showAllFlags
    ? FLAGS.filter((f) => f.active)
    : FLAGS.filter((f) => QUICK_FILTER_FLAGS.includes(f.id))

  const announcement = events.find((e) => e.id === 'e_kartik_yatra')
  const upcoming = events.slice(0, 3)

  return (
    <>
      <Main>
        <header className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-x-3.5">
            <span className="deva text-[28px] leading-[1.1] sm:text-[34px]">राधे राधे</span>
            <span className="text-[25px] font-light leading-[1.1] sm:text-[30px]">
              {user.name.split(' ')[0]}
            </span>
          </div>
          <span className="text-[14px] font-light text-muted">
            {headerDateLine(today)}
          </span>
        </header>

        {can(user, 'feed.create') ? (
          <Link
            href="/posts/new"
            className="flex items-center gap-3 rounded-[12px] border border-line bg-surface px-3.5 py-3 sm:gap-3.5 sm:px-[18px] sm:py-3.5 text-[15px] font-light text-muted transition-colors hover:border-line-deep hover:text-muted"
          >
            <Avatar initials={user.initials} tone={user.avatarTone} size="lg" />
            <span className="min-w-0 flex-1 truncate">
              Share something with the parivar…
            </span>
            <ImageIcon size={20} weight="light" />
            <YoutubeLogo size={20} weight="light" />
          </Link>
        ) : null}

        <div className="flex flex-col gap-3 border-b border-line lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={sort} onValueChange={(v) => setSort(v as FeedSort)}>
            <TabsList>
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="no-scrollbar -mx-5 flex items-center gap-4 overflow-x-auto whitespace-nowrap px-5 text-[13px] font-light text-ink-5 max-lg:order-first lg:mx-0 lg:px-0 lg:pb-2.5">
            <button
              type="button"
              onClick={() => setFlagFilter(null)}
              className={cn(
                'transition-colors hover:text-ink',
                flagFilter === null && 'text-ink',
              )}
            >
              All flags
            </button>
            {quickFlags.map((flag) => (
              <button
                key={flag.id}
                type="button"
                onClick={() =>
                  setFlagFilter((c) => (c === flag.id ? null : flag.id))
                }
                className={cn(
                  'flex shrink-0 items-center gap-1.5 transition-colors hover:text-ink',
                  flagFilter === flag.id && 'text-ink',
                )}
              >
                <Dot color={flag.color} />
                {flag.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowAllFlags((v) => !v)}
              className="flex shrink-0 items-center gap-1 transition-colors hover:text-ink"
            >
              {showAllFlags ? 'Less' : 'More'}
              <CaretDown
                size={12}
                weight="light"
                className={cn('transition-transform', showAllFlags && 'rotate-180')}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col pb-16 lg:pb-10">
          {visible.length === 0 ? (
            <EmptyState
              icon={MegaphoneSimple}
              title={
                sort === 'saved' ? 'Nothing saved yet' : 'No posts under this flag'
              }
              body={
                sort === 'saved'
                  ? 'Posts you save are kept here privately, visible only to you.'
                  : `Nothing has been posted under ${
                      flagFilter ? flagById(flagFilter).label : 'this flag'
                    } yet.`
              }
            />
          ) : (
            visible.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                last={i === visible.length - 1}
              />
            ))
          )}
        </div>
      </Main>

      <Rail>
        {announcement ? (
          <div className="flex flex-col gap-2 rounded-[12px] bg-terracotta-tint px-5 py-[18px]">
            <span className="flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-terracotta-ink">
              <MegaphoneSimple size={16} weight="light" />
              Announcement
            </span>
            <span className="text-[17px] leading-[1.35] text-ink">
              {announcement.title} registrations are open
            </span>
            <span className="text-[14px] font-light leading-[1.5] text-[#5E4A3E]">
              Eight days in Vrindavan and Govardhan, 27 Oct – 3 Nov.
            </span>
            <Link
              href={`/events/${announcement.id}`}
              className="text-[14px] text-terracotta-ink"
            >
              View details →
            </Link>
          </div>
        ) : null}

        {can(user, 'sadhna.view') ? (
          <div className="flex flex-col gap-3.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px]">Today&rsquo;s sadhna</span>
              <Link href="/sadhna" className="text-[13px] font-light">
                Log
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Stat value={sadhnaSummary.todayRounds} label="rounds chanted" />
              <Stat
                value={sadhnaSummary.todayReadingMinutes}
                unit="m"
                label="reading"
              />
            </div>
          </div>
        ) : null}

        {can(user, 'event.view') ? (
          <div className="flex flex-col gap-1">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[15px]">Upcoming</span>
              <Link href="/events" className="text-[13px] font-light">
                Calendar
              </Link>
            </div>
            {upcoming.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.id}`}
                className="flex gap-3.5 border-t border-line py-2.5 hover:text-ink"
              >
                <span className="flex w-10 shrink-0 flex-col items-center">
                  <span className="text-[24px] font-extralight leading-none text-ink">
                    {e.day}
                  </span>
                  <span className="text-[11px] tracking-[0.08em] text-muted">
                    {e.mon}
                  </span>
                </span>
                <span className="flex min-w-0 flex-col gap-px">
                  <span className="text-[14px] leading-[1.3] text-ink">
                    {e.title}
                  </span>
                  <span className="text-[12px] font-light leading-[1.4] text-muted">
                    {e.meta}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </Rail>
    </>
  )
}
