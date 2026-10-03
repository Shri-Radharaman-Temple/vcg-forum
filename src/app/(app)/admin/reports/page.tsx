'use client'

import * as React from 'react'
import { Main } from '@/components/app/shell'
import { PageTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/components/app/session'
import { can } from '@/lib/rbac'
import { reports } from '@/data/mock'
import { cn } from '@/lib/utils'
import type { ReportStatus } from '@/types'

const RESOLUTIONS = [
  'No action',
  'Content removed',
  'Content edited',
  'User warned',
  'User suspended',
]

/** Moderation queue (spec §8) with its OPEN → UNDER_REVIEW → RESOLVED lifecycle. */
export default function ReportsPage() {
  const { user } = useSession()
  const [status, setStatus] = React.useState<ReportStatus>('OPEN')
  const [expanded, setExpanded] = React.useState<string | null>(null)

  const allowed = can(user, 'admin.reports.manage')
  const counts = {
    OPEN: reports.filter((r) => r.status === 'OPEN').length,
    UNDER_REVIEW: reports.filter((r) => r.status === 'UNDER_REVIEW').length,
    RESOLVED: reports.filter((r) => r.status === 'RESOLVED').length,
  }
  const list = reports.filter((r) => r.status === status)

  return (
    <Main className="gap-7 px-12 py-10">
      <PageTitle deva="शिकायतें">Reports</PageTitle>

      <Tabs value={status} onValueChange={(v) => setStatus(v as ReportStatus)}>
        <TabsList className="border-b border-line">
          <TabsTrigger value="OPEN">{counts.OPEN} Open</TabsTrigger>
          <TabsTrigger value="UNDER_REVIEW">
            {counts.UNDER_REVIEW} Under Review
          </TabsTrigger>
          <TabsTrigger value="RESOLVED">{counts.RESOLVED} Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex max-w-[860px] flex-col gap-3 pb-12">
        {list.length === 0 ? (
          <EmptyState title="Nothing here" body="No reports in this state." />
        ) : (
          list.map((r) => {
            const open = expanded === r.id
            return (
              <div
                key={r.id}
                className="flex flex-col gap-3 rounded-[12px] border border-line bg-surface p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="flex items-center gap-2.5">
                      <span className="rounded-[6px] bg-ground px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-muted">
                        {r.targetKind}
                      </span>
                      <span className="text-[13px] font-light text-terracotta">
                        {r.reason}
                      </span>
                    </span>
                    <span className="text-[16px] font-light leading-[1.5] text-ink">
                      “{r.targetExcerpt}”
                    </span>
                    <span className="text-[13px] font-light text-muted">
                      by {r.targetAuthor} · reported by {r.reporter} · {r.at}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : r.id)}
                    className="shrink-0 text-[13px] font-light text-ink-5 transition-colors hover:text-ink"
                  >
                    {open ? 'Hide' : 'Details'}
                  </button>
                </div>

                {r.description ? (
                  <p className="m-0 border-t border-line pt-3 text-[14px] font-light leading-[1.6] text-ink-3">
                    {r.description}
                  </p>
                ) : null}

                {open ? (
                  <dl className="m-0 grid grid-cols-2 gap-x-8 gap-y-2 border-t border-line pt-3 text-[13px] font-light">
                    {[
                      ['Status', r.status.replace('_', ' ')],
                      ['Moderator', r.moderator ?? '—'],
                      ['Resolution', r.resolution ?? '—'],
                      ['Internal notes', r.notes ?? '—'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3">
                        <dt className="text-muted">{k}</dt>
                        <dd className="m-0 text-right text-ink-2">{v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {allowed && r.status !== 'RESOLVED' ? (
                  <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
                    <span className="mr-1 text-[13px] font-light text-muted">
                      Resolve as
                    </span>
                    {RESOLUTIONS.map((res) => (
                      <button
                        key={res}
                        type="button"
                        className={cn(
                          'rounded-[8px] border border-line-strong px-2.5 py-1 text-[13px] font-light text-ink-4 transition-colors',
                          res === 'User suspended'
                            ? 'hover:border-terracotta hover:text-terracotta'
                            : 'hover:border-tulsi hover:text-tulsi-ink',
                        )}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })
        )}
      </div>

      {!allowed ? (
        <p className="m-0 text-[14px] font-light text-muted">
          Viewing only — resolving reports requires{' '}
          <code className="font-mono text-[13px]">admin.reports.manage</code>.
        </p>
      ) : null}
    </Main>
  )
}
