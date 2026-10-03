'use client'

import * as React from 'react'
import { DotsSixVertical, Lock } from '@phosphor-icons/react'
import { Main } from '@/components/app/shell'
import { PageTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dot } from '@/components/ui/flag-dot'
import { FLAGS } from '@/lib/flags'
import { cn } from '@/lib/utils'

/**
 * Feed flag management (spec §5.2). The internal id is shown read-only beside
 * each label to make clear that renaming the label does not reclassify posts.
 */
export default function FlagsPage() {
  const [flags, setFlags] = React.useState(FLAGS)

  const toggle = (id: string, key: 'active' | 'userPostable') =>
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: !f[key] } : f)),
    )

  return (
    <Main className="gap-7 px-12 py-10">
      <header className="flex items-end justify-between gap-6">
        <PageTitle deva="श्रेणियाँ">Flags</PageTitle>
        <Button variant="accent">New flag</Button>
      </header>

      <p className="m-0 max-w-[620px] text-[14px] font-light leading-[1.6] text-ink-4">
        Flags categorise posts in the feed. The label, colour and ordering can be
        changed at any time; the internal identifier is fixed so existing posts
        keep their classification.
      </p>

      <div className="flex max-w-[860px] flex-col pb-12">
        <div className="grid grid-cols-[28px_1fr_160px_100px_90px] gap-4 border-b border-line pb-2 text-[11px] uppercase tracking-[0.1em] text-muted-2">
          <span />
          <span>Label</span>
          <span>Identifier</span>
          <span>Users can post</span>
          <span>Active</span>
        </div>

        {flags.map((flag) => (
          <div
            key={flag.id}
            className={cn(
              'grid grid-cols-[28px_1fr_160px_100px_90px] items-center gap-4 border-b border-line py-3',
              !flag.active && 'opacity-50',
            )}
          >
            <button
              type="button"
              aria-label={`Reorder ${flag.label}`}
              className="cursor-grab text-muted-2 transition-colors hover:text-ink-5"
            >
              <DotsSixVertical size={16} weight="light" />
            </button>

            <span className="flex items-center gap-2.5">
              <Dot color={flag.color} size={8} />
              <span className="text-[15px] font-light text-ink">
                {flag.label}
              </span>
              {!flag.userPostable ? (
                <Lock size={13} weight="light" className="text-muted-2" />
              ) : null}
            </span>

            <code className="font-mono text-[12px] text-muted">{flag.id}</code>

            <input
              type="checkbox"
              checked={flag.userPostable}
              onChange={() => toggle(flag.id, 'userPostable')}
              aria-label={`Allow devotees to post under ${flag.label}`}
              className="h-4 w-4 accent-[#4F7A5A]"
            />

            <input
              type="checkbox"
              checked={flag.active}
              onChange={() => toggle(flag.id, 'active')}
              aria-label={`${flag.label} active`}
              className="h-4 w-4 accent-[#4F7A5A]"
            />
          </div>
        ))}
      </div>
    </Main>
  )
}
