'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleLogo } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'

/**
 * Sign in (spec §3.1). The provider list is rendered from config rather than
 * hard-coded so further OAuth providers can be added without redesigning the
 * screen or the user model.
 */
export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6 rounded-[14px] border border-line bg-surface p-7">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="m-0 text-[24px] font-light">Welcome back</h1>
        <p className="m-0 text-[14px] font-light leading-[1.55] text-muted">
          Sign in to continue to the parivar community.
        </p>
      </div>

      <Button variant="outline" size="lg" className="w-full">
        <GoogleLogo size={18} weight="light" />
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-[12px] font-light text-muted-2">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          router.push('/')
        }}
      >
        <Field label="Email">
          <Input type="email" required placeholder="you@example.com" />
        </Field>
        <Field label="Password">
          <Input type="password" required placeholder="••••••••" />
        </Field>
        <Button type="submit" variant="primary" size="lg" className="mt-1 w-full">
          Sign in
        </Button>
      </form>

      <p className="m-0 text-center text-[14px] font-light text-muted">
        New to the parivar?{' '}
        <Link href="/register">Request access</Link>
      </p>
    </div>
  )
}
