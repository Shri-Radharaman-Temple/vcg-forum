import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Avatar placeholder tones, matching the fills used across the design. */
export const avatarTone = {
  sand: 'bg-fill-1',
  clay: 'bg-fill-2',
  dust: 'bg-fill-3',
  stone: 'bg-fill-4',
} as const

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}
