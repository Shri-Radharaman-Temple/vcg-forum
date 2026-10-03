'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

/** Underline tabs — the feed sort row and the resources type row. */
export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'no-scrollbar flex gap-5 overflow-x-auto text-[15px] font-light text-ink-5 sm:gap-[26px]',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'shrink-0 whitespace-nowrap border-b-[1.5px] border-transparent pb-2.5 transition-colors hover:text-ink',
      'data-[state=active]:border-ink data-[state=active]:font-normal data-[state=active]:text-ink',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = TabsPrimitive.Content

/** Segmented control — the Month / Week / Agenda switch on Events. */
export const SegmentedList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'flex rounded-[9px] border border-line-strong p-[3px] text-[13px] font-light text-ink-5',
      className,
    )}
    {...props}
  />
))
SegmentedList.displayName = 'SegmentedList'

export const SegmentedTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'rounded-md px-3.5 py-[5px] transition-colors',
      'data-[state=active]:bg-surface data-[state=active]:font-normal data-[state=active]:text-ink',
      className,
    )}
    {...props}
  />
))
SegmentedTrigger.displayName = 'SegmentedTrigger'
