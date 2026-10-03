'use client'

import * as React from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import {
  ArrowLeft,
  BellSimple,
  BookmarkSimple,
  CalendarBlank,
  CalendarPlus,
  MapPin,
  ShareNetwork,
  Users,
} from '@phosphor-icons/react'
import { Main } from '@/components/app/shell'
import { sceneCover } from '@/lib/images'
import { MediaPlaceholder } from '@/components/ui/card'
import { Dot } from '@/components/ui/flag-dot'
import { EVENT_COLORS, EVENT_CATEGORY_LABELS } from '@/lib/flags'
import { getEvent } from '@/data/mock'
import { cn } from '@/lib/utils'

/** Screen 1g — Event detail. */
export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const event = getEvent(id)
  if (!event) notFound()

  const [saved, setSaved] = React.useState(event.savedByMe ?? false)
  const [registered, setRegistered] = React.useState(false)
  const color = EVENT_COLORS[event.category]

  return (
    <Main className="gap-6 px-14 py-8">
      <Link
        href="/events"
        className="flex items-center gap-2 text-[14px] font-light text-ink-5 hover:text-ink"
      >
        <ArrowLeft size={18} weight="light" />
        Events
      </Link>

      <MediaPlaceholder
        variant="wide"
        src={sceneCover(event.id)}
        label={event.coverLabel ?? `cover · ${event.title}`}
        className="h-[260px] shrink-0 rounded-[14px]"
      />

      <div className="flex gap-14 pb-12">
        <div className="flex max-w-[640px] flex-1 flex-col gap-[18px]">
          <div className="flex flex-col gap-1.5">
            <span
              className="flex items-center gap-1.5 text-[13px] font-light"
              style={{ color }}
            >
              <Dot color={color} />
              {EVENT_CATEGORY_LABELS[event.category]}
            </span>
            <h1 className="m-0 text-[36px] font-light leading-[1.15]">
              {event.title}
            </h1>
            {event.devanagariTitle ? (
              <span className="deva text-[18px]">{event.devanagariTitle}</span>
            ) : null}
          </div>

          {event.description ? (
            <p className="m-0 text-[16px] font-light leading-[1.7] text-ink-3">
              {event.description}
            </p>
          ) : null}

          {event.schedule?.length ? (
            <div className="flex flex-col">
              <span className="mb-2 mt-1 text-[15px]">Schedule</span>
              {event.schedule.map((row) => (
                <div
                  key={row.when}
                  className="flex gap-[18px] border-t border-line py-[11px] text-[14px] font-light"
                >
                  <span className="w-[92px] shrink-0 text-muted">{row.when}</span>
                  <span className="text-ink-2">{row.what}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* The booking card overlaps the cover image by 80px in the design. */}
        <aside className="-mt-20 flex w-[320px] shrink-0 select-none flex-col gap-4 self-start rounded-[14px] border border-line bg-surface p-[22px]">
          <Fact
            icon={CalendarBlank}
            primary={event.dateLabel ?? `${event.day} ${event.mon}`}
            secondary={event.tithiLabel}
          />
          <Fact
            icon={MapPin}
            primary={event.online ? 'Online' : (event.location ?? 'To be announced')}
            secondary={event.locationDetail}
          />
          {event.organizer ? (
            <Fact
              icon={Users}
              primary={event.organizer}
              secondary={
                event.placesLeft ? `${event.placesLeft} places left` : undefined
              }
            />
          ) : null}

          {event.registrationEnabled ? (
            <button
              type="button"
              onClick={() => setRegistered((v) => !v)}
              aria-pressed={registered}
              className={cn(
                'flex justify-center rounded-[10px] py-[11px] text-[15px] transition-colors',
                registered
                  ? 'border border-tulsi bg-tulsi-tint text-tulsi-ink'
                  : 'bg-tulsi text-[#F7F2EA] hover:bg-tulsi-ink',
              )}
            >
              {registered ? 'Registered' : 'Register'}
            </button>
          ) : null}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 rounded-[10px] border border-line-strong py-[9px] text-[13px] font-light text-ink-2 transition-colors hover:border-line-deep"
            >
              <CalendarPlus size={16} weight="light" />
              Add to calendar
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 rounded-[10px] border border-line-strong py-[9px] text-[13px] font-light text-ink-2 transition-colors hover:border-line-deep"
            >
              <BellSimple size={16} weight="light" />
              Remind me
            </button>
          </div>

          <div className="flex justify-center gap-[22px] text-[13px] font-light text-ink-5">
            <button
              type="button"
              onClick={() => setSaved((v) => !v)}
              aria-pressed={saved}
              className={cn(
                'flex items-center gap-1.5 transition-colors hover:text-ink',
                saved && 'text-tulsi-ink hover:text-tulsi-ink',
              )}
            >
              <BookmarkSimple size={15} weight={saved ? 'fill' : 'light'} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() =>
                void navigator.clipboard?.writeText(window.location.href)
              }
              className="flex items-center gap-1.5 transition-colors hover:text-ink"
            >
              <ShareNetwork size={15} weight="light" />
              Share
            </button>
          </div>
        </aside>
      </div>
    </Main>
  )
}

function Fact({
  icon: Icon,
  primary,
  secondary,
}: {
  icon: React.ComponentType<{ size?: number; weight?: 'light'; className?: string }>
  primary: string
  secondary?: string
}) {
  return (
    <div className="flex gap-3 text-[14px] font-light leading-[1.45]">
      <Icon size={20} weight="light" className="mt-0.5 shrink-0 text-ink-5" />
      <span className="flex flex-col">
        <span className="text-ink">{primary}</span>
        {secondary ? (
          <span className="text-[13px] text-muted">{secondary}</span>
        ) : null}
      </span>
    </div>
  )
}
