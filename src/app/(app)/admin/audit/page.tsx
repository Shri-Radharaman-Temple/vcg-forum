'use client'

import { Main } from '@/components/app/shell'
import { PageTitle } from '@/components/ui/card'
import { auditLog } from '@/data/mock'

/** Audit trail (spec §8, §17) — every moderator and admin action is retained. */
export default function AuditPage() {
  return (
    <Main className="gap-7 px-12 py-10">
      <PageTitle deva="अभिलेख">Audit Logs</PageTitle>

      <p className="m-0 max-w-[620px] text-[14px] font-light leading-[1.6] text-ink-4">
        Every administrative and moderation action is recorded with its actor,
        target and timestamp. Entries cannot be edited or deleted.
      </p>

      <div className="flex max-w-[860px] flex-col pb-12">
        <div className="grid grid-cols-[180px_1fr_180px] gap-4 border-b border-line pb-2 text-[11px] uppercase tracking-[0.1em] text-muted-2">
          <span>Actor</span>
          <span>Action</span>
          <span>When</span>
        </div>
        {auditLog.map((a) => (
          <div
            key={a.id}
            className="grid grid-cols-[180px_1fr_180px] gap-4 border-b border-line py-3 text-[14px] font-light"
          >
            <span className="text-ink">{a.actor}</span>
            <span className="text-ink-3">
              {a.action} — <span className="text-muted">{a.target}</span>
            </span>
            <span className="text-[13px] text-muted">{a.at}</span>
          </div>
        ))}
      </div>
    </Main>
  )
}
