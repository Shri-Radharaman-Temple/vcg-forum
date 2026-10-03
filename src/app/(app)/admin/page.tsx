'use client'

import Link from 'next/link'
import { Main } from '@/components/app/shell'
import { PageTitle, SectionHead } from '@/components/ui/card'
import { adminMetrics, auditLog, pendingDevotees, reports } from '@/data/mock'
import { cn } from '@/lib/utils'

/** Admin dashboard (spec §18) — operational counts, not vanity analytics. */
export default function AdminDashboardPage() {
  const openReports = reports.filter((r) => r.status === 'OPEN').length

  return (
    <Main className="gap-6 lg:gap-8 px-5 lg:px-12 py-6 lg:py-10">
      <PageTitle deva="प्रबंधन">Dashboard</PageTitle>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-5">
        {adminMetrics.map((m) => (
          <Link
            key={m.label}
            href={m.href ?? '#'}
            className="flex flex-col gap-1 rounded-[10px] border border-line bg-surface p-4 transition-colors hover:border-line-deep"
          >
            <span
              className={cn(
                'text-[26px] font-extralight leading-none sm:text-[30px]',
                m.attention ? 'text-terracotta' : 'text-ink',
              )}
            >
              {m.value}
            </span>
            <span className="text-[13px] font-light leading-[1.35] text-muted">
              {m.label}
            </span>
          </Link>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-8 pb-4 xl:grid-cols-2 xl:gap-10 xl:pb-12">
        <div className="flex flex-col gap-3">
          <SectionHead
            title="Awaiting approval"
            action={
              <Link href="/admin/users/pending" className="text-[13px] font-light">
                Review all
              </Link>
            }
          />
          {pendingDevotees.slice(0, 4).map((d) => (
            <div
              key={d.id}
              className="flex items-baseline justify-between gap-3 border-t border-line py-2.5"
            >
              <span className="flex min-w-0 flex-col">
                <span className="text-[14px] text-ink">{d.name}</span>
                <span className="text-[12px] font-light text-muted">{d.email}</span>
              </span>
              <span className="shrink-0 text-[12px] font-light text-muted-2">
                {d.registeredAt}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <SectionHead
            title={`Open reports (${openReports})`}
            action={
              <Link href="/admin/reports" className="text-[13px] font-light">
                Moderation queue
              </Link>
            }
          />
          {reports
            .filter((r) => r.status !== 'RESOLVED')
            .map((r) => (
              <div
                key={r.id}
                className="flex items-baseline justify-between gap-3 border-t border-line py-2.5"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[14px] text-ink">
                    {r.targetExcerpt}
                  </span>
                  <span className="text-[12px] font-light text-muted">
                    {r.reason} · reported by {r.reporter}
                  </span>
                </span>
                <span className="shrink-0 text-[12px] font-light text-muted-2">
                  {r.at}
                </span>
              </div>
            ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 pb-12">
        <SectionHead
          title="Recent activity"
          action={
            <Link href="/admin/audit" className="text-[13px] font-light">
              Audit log
            </Link>
          }
        />
        {auditLog.slice(0, 4).map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 border-t border-line py-2.5 text-[14px] font-light"
          >
            <span className="shrink-0 text-ink sm:w-[150px]">{a.actor}</span>
            <span className="w-full text-ink-3 max-sm:order-last sm:w-auto sm:flex-1">
              {a.action} — <span className="text-muted">{a.target}</span>
            </span>
            <span className="ml-auto shrink-0 text-[12px] text-muted-2 sm:ml-0">
              {a.at}
            </span>
          </div>
        ))}
      </section>
    </Main>
  )
}
