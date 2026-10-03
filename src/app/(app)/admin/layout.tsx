'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'
import { useSession } from '@/components/app/session'
import { canAny, ADMIN_PERMISSIONS_ANY } from '@/lib/rbac'
import { cn } from '@/lib/utils'

/**
 * Admin panel (spec §17). Lives inside the same Next.js application but is
 * gated by RBAC — a devotee who reaches the URL directly gets the notice
 * below, not a partially rendered panel.
 */
const NAV: { group: string; items: { href: string; label: string }[] }[] = [
  {
    group: '',
    items: [{ href: '/admin', label: 'Dashboard' }],
  },
  {
    group: 'Users',
    items: [
      { href: '/admin/users/pending', label: 'Pending Approval' },
      { href: '/admin/users', label: 'Active' },
      { href: '/admin/roles', label: 'Roles' },
    ],
  },
  {
    group: 'Community',
    items: [
      { href: '/admin/reports', label: 'Reports' },
      { href: '/admin/flags', label: 'Flags' },
    ],
  },
  {
    group: 'System',
    items: [{ href: '/admin/audit', label: 'Audit Logs' }],
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useSession()
  const pathname = usePathname()

  if (!canAny(user, ADMIN_PERMISSIONS_ANY)) {
    return (
      <div className="flex flex-1 items-center justify-center px-14">
        <div className="flex max-w-[440px] flex-col items-center gap-3 text-center">
          <h1 className="m-0 text-[24px] font-light">Not available</h1>
          <p className="m-0 text-[15px] font-light leading-[1.65] text-ink-4">
            Your role does not include administrative permissions. If you believe
            you should have access, contact a Super Admin of the parivar.
          </p>
          <Link href="/" className="mt-2 text-[14px]">
            ← Back to the feed
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <nav className="flex w-[216px] shrink-0 flex-col gap-6 border-r border-line px-5 py-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-[13px] font-light text-ink-5 hover:text-ink"
        >
          <ArrowLeft size={15} weight="light" />
          Back to app
        </Link>

        {NAV.map((section) => (
          <div key={section.group} className="flex flex-col gap-1">
            {section.group ? (
              <span className="mb-1 px-2.5 text-[11px] uppercase tracking-[0.12em] text-muted-2">
                {section.group}
              </span>
            ) : null}
            {section.items.map((item) => {
              // /admin/users must not light up for /admin/users/pending.
              const active =
                pathname === item.href ||
                (item.href !== '/admin' &&
                  item.href !== '/admin/users' &&
                  pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-[8px] px-2.5 py-1.5 text-[14px] transition-colors',
                    active
                      ? 'bg-tulsi-tint font-normal text-tulsi-ink hover:text-tulsi-ink'
                      : 'font-light text-ink-4 hover:bg-[#EAE2D6] hover:text-ink-4',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
      {children}
    </>
  )
}
