'use client'

import * as React from 'react'
import { BookOpen, FlowerLotus, Lock, Plus } from '@phosphor-icons/react'
import { Main, Rail } from '@/components/app/shell'
import { PageTitle, SectionHead } from '@/components/ui/card'
import { Stat } from '@/components/ui/stat'
import { Button } from '@/components/ui/button'
import { getSadhnaCalendar, sadhnaEntries, sadhnaSummary } from '@/data/mock'
import { can } from '@/lib/rbac'
import { useSession } from '@/components/app/session'
import { cn } from '@/lib/utils'
import type { SadhnaActivity } from '@/types'

const WEEKDAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/**
 * Sadhna tracker (spec §9). Deliberately not gamified — no leaderboards, no
 * ranking, no comparison against other devotees. Data is private by default.
 */
export default function SadhnaPage() {
  const { user } = useSession()
  const days = React.useMemo(() => getSadhnaCalendar(), [])
  const [logging, setLogging] = React.useState<SadhnaActivity | null>(null)
  const [selected, setSelected] = React.useState<string | null>(null)

  const readingH = Math.floor(sadhnaSummary.weekReadingMinutes / 60)
  const readingM = sadhnaSummary.weekReadingMinutes % 60

  const selectedEntries = selected
    ? sadhnaEntries.filter((e) => e.date === selected)
    : sadhnaEntries.filter((e) => e.date === '2026-09-26')

  return (
    <>
      <Main className="gap-7 px-14 py-10">
        <header className="flex items-end justify-between gap-6">
          <PageTitle deva="साधना">Sadhna</PageTitle>
          {can(user, 'sadhna.create') ? (
            <div className="flex gap-2.5">
              <Button variant="outline" onClick={() => setLogging('chanting')}>
                <FlowerLotus size={17} weight="light" />
                Log chanting
              </Button>
              <Button variant="primary" onClick={() => setLogging('reading')}>
                <BookOpen size={17} weight="light" />
                Log reading
              </Button>
            </div>
          ) : null}
        </header>

        {logging ? (
          <LogForm activity={logging} onClose={() => setLogging(null)} />
        ) : null}

        <section className="flex flex-col gap-4">
          <SectionHead title="This week" />
          <div className="grid grid-cols-3 gap-3">
            <Stat
              value={sadhnaSummary.weekRounds}
              label="rounds chanted"
              className="py-4"
            />
            <Stat
              value={`${readingH}h ${readingM}m`}
              label="reading"
              className="py-4"
            />
            <Stat
              value={sadhnaSummary.streakDays}
              label="day streak"
              className="py-4"
              accent
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHead
            title="History"
            action={
              <span className="text-[13px] font-light text-muted">
                Tap a day to see its entries
              </span>
            }
          />
          <div className="rounded-[12px] border border-line bg-surface p-5">
            <div className="grid grid-cols-7 gap-y-3">
              {WEEKDAY_INITIALS.map((d, i) => (
                <span
                  key={i}
                  className="pb-1 text-center text-[11px] tracking-[0.1em] text-muted"
                >
                  {d}
                </span>
              ))}
              {days.map((day) => {
                const isSelected = selected === day.date
                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelected(day.date)}
                    aria-pressed={isSelected}
                    aria-label={`${day.dayOfMonth} September — ${
                      day.logged ? `${day.rounds} rounds` : 'no entry'
                    }`}
                    className="flex flex-col items-center gap-1.5 py-1"
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-light transition-colors',
                        day.logged
                          ? 'bg-tulsi-tint text-tulsi-ink'
                          : 'border border-dashed border-line text-muted-2',
                        isSelected && 'ring-2 ring-tulsi ring-offset-2',
                      )}
                    >
                      {day.dayOfMonth}
                    </span>
                    <span className="text-[10px] font-light text-muted-2">
                      {day.logged ? day.rounds : '—'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 pb-12">
          <SectionHead
            title={selected ? `Entries · ${selected}` : 'Today’s entries'}
          />
          {selectedEntries.length === 0 ? (
            <p className="m-0 border-t border-line pt-4 text-[14px] font-light text-muted">
              Nothing logged on this day.
            </p>
          ) : (
            selectedEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-baseline gap-4 border-t border-line py-3"
              >
                <span className="flex w-[100px] shrink-0 items-center gap-2 text-[14px] capitalize text-ink">
                  {entry.activity === 'chanting' ? (
                    <FlowerLotus size={16} weight="light" className="text-tulsi" />
                  ) : (
                    <BookOpen size={16} weight="light" className="text-terracotta" />
                  )}
                  {entry.activity}
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-light text-ink">
                    {entry.activity === 'chanting'
                      ? `${entry.count} rounds`
                      : `${entry.duration} minutes${
                          entry.count ? ` · ${entry.count} pages` : ''
                        }`}
                    {entry.resourceTitle ? ` · ${entry.resourceTitle}` : ''}
                  </span>
                  {entry.notes ? (
                    <span className="text-[13px] font-light leading-[1.5] text-muted">
                      {entry.notes}
                    </span>
                  ) : null}
                </span>
                {entry.duration && entry.activity === 'chanting' ? (
                  <span className="text-[13px] font-light text-muted">
                    {entry.duration} min
                  </span>
                ) : null}
              </div>
            ))
          )}
        </section>
      </Main>

      <Rail width={300} className="px-7">
        <div className="flex flex-col gap-3">
          <SectionHead title="Today" />
          <div className="grid grid-cols-2 gap-2.5">
            <Stat value={sadhnaSummary.todayRounds} label="rounds" />
            <Stat
              value={sadhnaSummary.todayReadingMinutes}
              unit="m"
              label="reading"
            />
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-baseline justify-between text-[13px] font-light text-muted">
              <span>Daily rounds</span>
              <span>
                {sadhnaSummary.todayRounds} / {sadhnaSummary.dailyTarget}
              </span>
            </div>
            <div className="h-[3px] w-full rounded-sm bg-line">
              <div
                className="h-full rounded-sm bg-tulsi"
                style={{
                  width: `${Math.min(
                    100,
                    (sadhnaSummary.todayRounds / sadhnaSummary.dailyTarget) * 100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-[12px] border border-line p-4">
          <span className="flex items-center gap-2 text-[13px] text-ink">
            <Lock size={15} weight="light" className="text-muted" />
            Private by default
          </span>
          <span className="text-[13px] font-light leading-[1.55] text-muted">
            Your sadhna record is visible only to you. It is never shown on your
            profile, in the feed, or to other devotees.
          </span>
        </div>
      </Rail>
    </>
  )
}

/** Inline log form — chanting takes rounds, reading takes a resource. */
function LogForm({
  activity,
  onClose,
}: {
  activity: SadhnaActivity
  onClose: () => void
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onClose()
      }}
      className="flex flex-col gap-4 rounded-[12px] border border-line bg-surface p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-[15px] capitalize">Log {activity}</span>
        <span className="text-[13px] font-light text-muted">
          Saturday, 26 September
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {activity === 'chanting' ? (
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] text-ink-4">Rounds</span>
            <input
              type="number"
              min={0}
              max={200}
              defaultValue={16}
              className="h-10 rounded-[10px] border border-line-strong bg-ground px-3.5 text-[15px] font-light focus:border-tulsi focus:outline-none"
            />
          </label>
        ) : (
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] text-ink-4">Pages</span>
            <input
              type="number"
              min={0}
              defaultValue={10}
              className="h-10 rounded-[10px] border border-line-strong bg-ground px-3.5 text-[15px] font-light focus:border-tulsi focus:outline-none"
            />
          </label>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] text-ink-4">Duration (minutes)</span>
          <input
            type="number"
            min={0}
            defaultValue={activity === 'chanting' ? 96 : 20}
            className="h-10 rounded-[10px] border border-line-strong bg-ground px-3.5 text-[15px] font-light focus:border-tulsi focus:outline-none"
          />
        </label>

        {activity === 'reading' ? (
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] text-ink-4">Book</span>
            <select
              defaultValue="r_brs"
              className="h-10 rounded-[10px] border border-line-strong bg-ground px-3 text-[15px] font-light focus:border-tulsi focus:outline-none"
            >
              <option value="r_brs">Bhakti Rasamrita Sindhu</option>
              <option value="r_bhagavatam">Srimad Bhagavatam</option>
              <option value="r_gita">Bhagavad Gita</option>
            </select>
          </label>
        ) : null}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] text-ink-4">Notes (optional)</span>
        <textarea
          rows={2}
          placeholder="Anything worth remembering about today's practice"
          className="resize-none rounded-[10px] border border-line-strong bg-ground px-3.5 py-2.5 text-[15px] font-light leading-[1.6] placeholder:text-muted-2 focus:border-tulsi focus:outline-none"
        />
      </label>

      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          <Plus size={16} weight="light" />
          Save entry
        </Button>
      </div>
    </form>
  )
}
