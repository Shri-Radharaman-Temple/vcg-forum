import * as React from 'react'
import { cn } from '@/lib/utils'

const base =
  'w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] font-light text-ink placeholder:text-muted-2 transition-colors focus:border-tulsi focus:outline-none'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(base, 'h-10', className)} {...props} />
))
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(base, 'resize-none py-3 leading-[1.65]', className)}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-2.5', className)}>
      <span className="text-[13px] font-normal text-ink-4">{label}</span>
      {children}
      {hint ? (
        <span className="text-[12px] font-light text-muted">{hint}</span>
      ) : null}
    </label>
  )
}
