import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Buttons in this design are hairline-bordered or solid tulsi. There are no
 * shadows and no heavy weights — Mukta 300/400 only.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-tulsi text-[#F7F2EA] font-normal hover:bg-tulsi-ink',
        outline:
          'border border-line-strong text-ink-2 font-light hover:bg-surface',
        accent:
          'border border-terracotta text-terracotta font-normal hover:bg-terracotta-tint',
        ghost: 'text-ink-4 font-light hover:bg-[#EAE2D6]',
        quiet: 'text-muted font-light hover:text-ink',
        danger:
          'border border-terracotta-ink text-terracotta-ink font-normal hover:bg-terracotta-tint',
      },
      size: {
        sm: 'h-8 px-3 text-[13px]',
        md: 'h-10 px-5 text-[15px]',
        lg: 'h-11 px-7 text-[15px]',
        icon: 'h-10 w-10 px-0',
        'icon-sm': 'h-8 w-8 px-0',
      },
    },
    defaultVariants: { variant: 'outline', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
