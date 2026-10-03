import type { Icon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: IconCmp,
  title,
  body,
  action,
  className,
}: {
  icon?: Icon
  title: string
  body?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-[12px] border border-dashed border-line px-8 py-14 text-center',
        className,
      )}
    >
      {IconCmp ? (
        <IconCmp size={28} weight="light" className="text-muted-2" />
      ) : null}
      <span className="text-[16px] font-normal text-ink">{title}</span>
      {body ? (
        <span className="max-w-[380px] text-[14px] font-light leading-[1.55] text-muted">
          {body}
        </span>
      ) : null}
      {action}
    </div>
  )
}
