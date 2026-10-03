'use client'

import * as React from 'react'
import Link from 'next/link'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Main, Rail } from '@/components/app/shell'
import { PageTitle } from '@/components/ui/card'
import { Dot } from '@/components/ui/flag-dot'
import {
  Tabs,
  SegmentedList,
  SegmentedTrigger,
} from '@/components/ui/tabs'
import { EVENT_COLORS, EVENT_CATEGORY_LABELS } from '@/lib/flags'
import { events, getOctoberCells } from '@/data/mock'
import { cn } from '@/lib/utils'
import type { CalendarCell } from '@/types'

type View = 'month' | 'week' | 'agenda'

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

/** Screen 1f — Events · month + upcoming, plus the week and agenda views. */
export default function EventsPage() {
  const [view, setView] = React.useState<View>('month')
  const cells = React.useMemo(() => getOctoberCells(), [])

  return (
    <>
      <Main className="gap-6 py-6 lg:py-10 px-5 lg:pl-14 lg:pr-12">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle deva="उत्सव">Events</PageTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as View)}>
            <SegmentedList>
              <SegmentedTrigger value="month">Month</SegmentedTrigger>
              <SegmentedTrigger value="week">Week</SegmentedTrigger>
              <SegmentedTrigger value="agenda">Agenda</SegmentedTrigger>
            </SegmentedList>
          </Tabs>
        </header>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            aria-label="Previous month"
            className="text-ink-5 transition-colors hover:text-ink"
          >
            <CaretLeft size={18} weight="light" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            className="text-ink-5 transition-colors hover:text-ink"
          >
            <CaretRight size={18} weight="light" />
          </button>
          <span className="text-[20px] font-light sm:text-[22px]">October 2026</span>
          <span className="truncate text-[14px] font-light text-muted">
            Ashwin – Kartik
          </span>
        </div>

        {view === 'month' ? <MonthGrid cells={cells} /> : null}
        {view === 'week' ? <WeekGrid cells={cells.slice(21, 28)} /> : null}
        {view === 'agenda' ? <AgendaList /> : null}
      </Main>

      <Rail width={320} className="gap-1.5 lg:px-7">
        <span className="mb-2.5 text-[15px]">Upcoming</span>
        {events.map((e) => (
          <Link
            key={e.id}
            href={`/events/${e.id}`}
            className="flex gap-3.5 border-t border-line py-3 hover:text-ink"
          >
            <span className="flex w-10 shrink-0 flex-col items-center">
              <span className="text-[24px] font-extralight leading-none text-ink">
                {e.day}
              </span>
              <span className="text-[11px] tracking-[0.08em] text-muted">
                {e.mon}
              </span>
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[14px] leading-[1.3] text-ink">
                {e.title}
              </span>
              <span className="text-[12px] font-light leading-[1.4] text-muted">
                {e.meta}
              </span>
            </span>
          </Link>
        ))}
      </Rail>
    </>
  )
}

function MonthGrid({ cells }: { cells: CalendarCell[] }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-line bg-surface">
      <WeekdayHeader />
      <div className="grid flex-1 auto-rows-fr grid-cols-7">
        {cells.map((c, i) => (
          <DayCell key={i} cell={c} />
        ))}
      </div>
    </div>
  )
}

function DayCell({ cell }: { cell: CalendarCell }) {
  return (
    <div
      className={cn(
        'flex min-h-[58px] min-w-0 flex-col gap-1 border-b border-r border-line-soft px-1.5 py-1.5 sm:min-h-[84px] sm:px-2.5 sm:py-2',
        cell.outside && 'bg-ground',
      )}
    >
      <div className="flex items-baseline justify-between gap-1">
        <span
          className={cn(
            'shrink-0 text-[15px] font-light leading-none',
            cell.outside
              ? 'text-muted-3'
              : cell.accent
                ? 'text-terracotta'
                : 'text-ink',
          )}
        >
          {cell.day}
        </span>
        {cell.tithi ? (
          <span className="hidden min-w-0 truncate text-[10px] font-light leading-none text-muted-2 sm:inline">
            {cell.tithi}
          </span>
        ) : null}
      </div>
      {cell.events.length ? (
        <span className="mt-auto flex flex-wrap gap-1 sm:hidden">
          {cell.events.map((ev, i) => (
            <Link
              key={`${ev.id}-${i}`}
              href={`/events/${ev.id}`}
              aria-label={ev.label}
              className="flex h-4 items-center"
            >
              <Dot color={ev.color} size={6} />
            </Link>
          ))}
        </span>
      ) : null}
      {cell.events.map((ev, i) => (
        <Link
          key={`${ev.id}-${i}`}
          href={`/events/${ev.id}`}
          className="hidden items-center gap-[5px] overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-light leading-[1.25] text-ink-2 hover:text-terracotta sm:flex"
        >
          <Dot color={ev.color} size={5} />
          {ev.label}
        </Link>
      ))}
    </div>
  )
}

/** Week view — the last week of October, where the yatra begins. */
function WeekGrid({ cells }: { cells: CalendarCell[] }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-line bg-surface">
      <WeekdayHeader className="hidden sm:grid" />
      <div className="grid flex-1 grid-cols-1 sm:grid-cols-7">
        {cells.map((c, i) => (
          <div
            key={i}
            className={cn(
              'flex min-w-0 gap-4 border-b border-line-soft px-4 py-3 last:border-b-0 sm:flex-col sm:gap-2 sm:border-b-0 sm:border-r sm:px-3',
              c.outside && 'bg-ground',
            )}
          >
            <div className="flex w-14 shrink-0 flex-col gap-0.5 sm:w-auto">
              <span className="text-[11px] tracking-[0.1em] text-muted sm:hidden">
                {WEEKDAYS[i]}
              </span>
              <span
                className={cn(
                  'text-[24px] font-extralight leading-none',
                  c.outside
                    ? 'text-muted-3'
                    : c.accent
                      ? 'text-terracotta'
                      : 'text-ink',
                )}
              >
                {c.day}
              </span>
              {c.tithi ? (
                <span className="text-[11px] font-light text-muted-2">
                  {c.tithi}
                </span>
              ) : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
            {c.events.length === 0 ? (
              <span className="text-[13px] font-light text-muted-2 sm:hidden">
                No events
              </span>
            ) : null}
            {c.events.map((ev, j) => (
              <Link
                key={`${ev.id}-${j}`}
                href={`/events/${ev.id}`}
                className="flex flex-col gap-1 rounded-[8px] border border-line px-2 py-1.5 text-[12px] font-light leading-[1.3] text-ink-2 hover:border-line-deep hover:text-ink"
              >
                <Dot color={ev.color} size={5} />
                {ev.label}
              </Link>
            ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeekdayHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-7 border-b border-line text-[11px] tracking-[0.1em] text-muted',
        className,
      )}
    >
      {WEEKDAYS.map((d) => (
        <span key={d} className="px-1.5 py-2.5 sm:px-3">
          <span className="sm:hidden">{d.slice(0, 1)}</span>
          <span className="hidden sm:inline">{d}</span>
        </span>
      ))}
    </div>
  )
}

function AgendaList() {
  return (
    <div className="flex flex-col pb-12">
      {events.map((e) => (
        <Link
          key={e.id}
          href={`/events/${e.id}`}
          className="flex items-baseline gap-4 border-t border-line py-4 hover:text-ink sm:gap-6"
        >
          <span className="flex w-[52px] shrink-0 flex-col items-start sm:w-[70px] sm:flex-row sm:items-baseline sm:gap-2">
            <span className="text-[26px] font-extralight leading-none text-ink">
              {e.day}
            </span>
            <span className="text-[11px] tracking-[0.08em] text-muted">
              {e.mon}
            </span>
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex items-center gap-2">
              <Dot color={EVENT_COLORS[e.category]} />
              <span className="text-[17px] font-light text-ink">{e.title}</span>
            </span>
            <span className="text-[13px] font-light text-muted">
              {EVENT_CATEGORY_LABELS[e.category]} · {e.meta}
            </span>
            {e.placesLeft ? (
              <span className="text-[13px] font-light text-terracotta sm:hidden">
                {e.placesLeft} places left
              </span>
            ) : null}
          </span>
          {e.placesLeft ? (
            <span className="hidden shrink-0 text-[13px] font-light text-terracotta sm:inline">
              {e.placesLeft} places left
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  )
}
