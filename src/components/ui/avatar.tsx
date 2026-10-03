import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn, avatarTone } from '@/lib/utils'
import type { AvatarTone } from '@/types'

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-[26px] w-[26px] text-[10px]',
  md: 'h-[30px] w-[30px] text-[11px]',
  lg: 'h-[34px] w-[34px] text-[13px]',
  xl: 'h-16 w-16 text-[20px]',
  '2xl': 'h-24 w-24 text-[28px]',
} as const

export function Avatar({
  name,
  initials,
  tone = 'sand',
  src,
  size = 'md',
  className,
}: {
  name?: string
  initials?: string
  tone?: AvatarTone
  src?: string
  size?: keyof typeof sizes
  className?: string
}) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'relative flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full',
        avatarTone[tone],
        sizes[size],
        className,
      )}
    >
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt={name ?? ''}
          className="h-full w-full object-cover"
        />
      ) : null}
      {/* The design leaves most avatars as a flat warm disc; initials only
          appear where the mock shows them. */}
      <AvatarPrimitive.Fallback
        delayMs={src ? 300 : 0}
        className="font-normal text-fill-ink"
      >
        {initials ?? ''}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
