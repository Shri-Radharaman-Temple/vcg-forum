'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { useSession } from '@/components/app/session'

/**
 * Registration (spec §3.2). Collects only what the organisation genuinely
 * needs — no extended profile. On submit the account enters PENDING_APPROVAL,
 * so the devotee lands on the waiting screen rather than the app.
 */
export default function RegisterPage() {
  const { actAs } = useSession()
  const [submitted, setSubmitted] = React.useState(false)

  if (submitted) {
    // Re-issues the session in its pending state; AppShell renders the
    // approval-pending screen from there.
    return (
      <div className="flex flex-col gap-4 rounded-[14px] border border-line bg-surface p-7 text-center">
        <h1 className="m-0 text-[22px] font-light">Registration received</h1>
        <p className="m-0 text-[15px] font-light leading-[1.6] text-ink-4">
          Your account has been submitted for approval. You will be notified once
          an administrator has reviewed it.
        </p>
        <Link href="/" className="text-[14px]">
          Continue →
        </Link>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-4 rounded-[14px] border border-line bg-surface p-7"
      onSubmit={(e) => {
        e.preventDefault()
        actAs({ status: 'PENDING_APPROVAL' })
        setSubmitted(true)
      }}
    >
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="m-0 text-[24px] font-light">Request access</h1>
        <p className="m-0 text-[14px] font-light leading-[1.55] text-muted">
          Membership is reviewed by an administrator of the parivar.
        </p>
      </div>

      <Field label="Full name">
        <Input required placeholder="Your name" />
      </Field>
      <Field label="Email">
        <Input type="email" required placeholder="you@example.com" />
      </Field>
      <Field label="Password">
        <Input type="password" required minLength={8} placeholder="At least 8 characters" />
      </Field>
      <Field
        label="Initiation details"
        hint="Name given at initiation and your initiating guru, if applicable."
      >
        <Input placeholder="Optional" />
      </Field>
      <Field label="Phone number" hint="Optional.">
        <Input type="tel" placeholder="Optional" />
      </Field>

      <label className="flex items-start gap-2.5 py-1 text-[13px] font-light leading-[1.5] text-ink-4">
        <input
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#4F7A5A]"
        />
        I accept the terms of use and the privacy policy of Radharaman Parivar.
      </label>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        Submit for approval
      </Button>

      <p className="m-0 text-center text-[14px] font-light text-muted">
        Already a member? <Link href="/login">Sign in</Link>
      </p>
    </form>
  )
}
