'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  At,
  Image as ImageIcon,
  Lock,
  Paperclip,
  Quotes,
  TextB,
  TextItalic,
  ListBullets,
  LinkSimple,
  X,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { Main } from '@/components/app/shell'
import { useSession } from '@/components/app/session'
import { Button } from '@/components/ui/button'
import { Dot } from '@/components/ui/flag-dot'
import { FLAGS } from '@/lib/flags'
import { can } from '@/lib/rbac'
import { cn } from '@/lib/utils'

/** Screen 1c — Create post. */
export default function CreatePostPage() {
  const router = useRouter()
  const { user } = useSession()

  const [flagId, setFlagId] = React.useState('qna')
  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')

  const allowed = can(user, 'feed.create')
  const valid = Boolean(flagId && title.trim() && body.trim())

  if (!allowed) {
    return (
      <Main>
        <div className="flex flex-1 items-center justify-center">
          <p className="max-w-[420px] text-center text-[15px] font-light leading-[1.65] text-ink-4">
            Your role does not include permission to create posts. If this seems
            wrong, contact an administrator of the parivar.
          </p>
        </div>
      </Main>
    )
  }

  return (
    <Main padded={false}>
      <div className="flex justify-center gap-14 px-4 pb-6 pt-[max(16px,env(safe-area-inset-top))] sm:px-8 lg:px-14 lg:py-8">
        <form
          className="flex w-full max-w-[720px] flex-col gap-5 sm:gap-[26px]"
          onSubmit={(e) => {
            e.preventDefault()
            // Wired to POST /posts in the real client.
            router.push('/')
          }}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[14px] font-light text-ink-5 transition-colors hover:text-ink"
            >
              <X size={18} weight="light" />
              Discard
            </button>
            <span className="text-[13px] font-light text-muted-2">
              {title || body ? 'Draft saved' : 'Draft empty'}
            </span>
          </div>

          <div className="flex items-baseline gap-3.5">
            <h1 className="m-0 text-[26px] font-light leading-[1.1] sm:text-[32px]">
              New post
            </h1>
            <span className="deva text-[20px] sm:text-[24px]">नई पोस्ट</span>
          </div>

          <fieldset className="flex flex-col gap-2.5 border-0 p-0">
            <legend className="mb-2.5 p-0 text-[13px] text-ink-4">Flag</legend>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 text-[14px] font-light text-ink-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {FLAGS.filter((f) => f.active).map((flag) => {
                const selected = flag.id === flagId
                // Admin-controlled: some flags are not open to devotees.
                const locked = !flag.userPostable && !can(user, 'feed.moderate')
                return (
                  <button
                    key={flag.id}
                    type="button"
                    disabled={locked}
                    aria-pressed={selected}
                    title={locked ? 'Only administrators may post announcements' : undefined}
                    onClick={() => setFlagId(flag.id)}
                    className={cn(
                      'flex shrink-0 items-center gap-[7px] rounded-[8px] border px-3.5 py-1.5 transition-colors',
                      selected
                        ? 'border-tulsi bg-tulsi-tint text-tulsi-ink'
                        : 'border-line-strong hover:border-line-deep',
                      locked && 'cursor-not-allowed opacity-45',
                    )}
                  >
                    <Dot color={flag.color} />
                    {flag.label}
                    {locked ? <Lock size={12} weight="light" /> : null}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="flex flex-col rounded-[12px] border border-line-strong bg-surface focus-within:border-line-deep">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              aria-label="Post title"
              maxLength={160}
              className="border-b border-line-soft bg-transparent px-4 pb-3 pt-4 text-[21px] sm:px-[22px] sm:pt-5 sm:text-[24px] font-light leading-[1.3] text-ink placeholder:text-muted-2 focus:outline-none"
            />

            <div className="no-scrollbar flex gap-5 overflow-x-auto border-b border-line-soft px-4 py-2.5 text-[18px] text-ink-5 sm:gap-4 sm:px-[22px]">
              {[TextB, TextItalic, ListBullets, Quotes, LinkSimple, At].map(
                (Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={
                      ['Bold', 'Italic', 'Bulleted list', 'Quote', 'Link', 'Mention'][i]
                    }
                    className="transition-colors hover:text-ink"
                  >
                    <Icon size={18} weight="light" />
                  </button>
                ),
              )}
            </div>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your question, experience or recipe with the parivar…"
              aria-label="Post body"
              className="h-[220px] resize-none bg-transparent px-4 py-4 sm:h-[190px] sm:px-[22px] text-[16px] font-light leading-[1.65] text-ink-2 placeholder:text-muted-2 focus:outline-none"
            />

            <div className="flex items-center gap-1 border-t border-line-soft px-2 py-2 text-[13px] font-light text-ink-4 sm:gap-2 sm:px-4 sm:py-3">
              {[
                { Icon: ImageIcon, label: 'Image' },
                { Icon: YoutubeLogo, label: 'YouTube' },
                { Icon: Paperclip, label: 'Attachment' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 transition-colors hover:bg-[#EFE8DC]"
                >
                  <Icon size={18} weight="light" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 max-sm:[&>*]:flex-1">
            <Button type="button" variant="outline">
              Preview
            </Button>
            <Button type="submit" variant="primary" size="lg" disabled={!valid}>
              Post
            </Button>
          </div>
        </form>

        <aside className="hidden w-[260px] shrink-0 flex-col xl:flex gap-3 pt-[118px] text-[14px] font-light leading-[1.55] text-ink-4">
          <span className="text-[14px] font-normal text-ink">Before you post</span>
          <span>Choose the flag that fits best so others can find it.</span>
          <span>
            Keep it kind and on topic. Posts are visible to approved members of
            the parivar only.
          </span>
          <span>Use @name to mention a devotee.</span>
        </aside>
      </div>
    </Main>
  )
}
