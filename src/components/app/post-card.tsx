'use client'

import Link from 'next/link'
import * as React from 'react'
import {
  BookmarkSimple,
  ChatTeardrop,
  DotsThree,
  Flag as FlagIcon,
  Heart,
  LinkSimple,
} from '@phosphor-icons/react'
import { Avatar } from '@/components/ui/avatar'
import { FlagLabel } from '@/components/ui/flag-dot'
import { postMedia } from '@/lib/images'
import { MediaPlaceholder } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { can } from '@/lib/rbac'
import { useSession } from '@/components/app/session'
import type { Post } from '@/types'

/**
 * A feed row (screen 1a). Separated by a hairline rather than boxed — the
 * design keeps content cards flat and shadowless.
 */
export function PostCard({ post, last = false }: { post: Post; last?: boolean }) {
  const { user } = useSession()
  const [liked, setLiked] = React.useState(post.likedByMe)
  const [saved, setSaved] = React.useState(post.savedByMe)
  const likes = post.likeCount + (liked === post.likedByMe ? 0 : liked ? 1 : -1)

  return (
    <article
      className={cn(
        'flex flex-col gap-2.5 py-[22px]',
        !last && 'border-b border-line',
      )}
    >
      <PostByline post={post} />

      <h3 className="m-0 text-[21px] font-normal leading-[1.3]">
        <Link href={`/posts/${post.id}`} className="text-ink hover:text-terracotta">
          {post.title}
        </Link>
      </h3>

      {post.body && !post.media ? (
        <p className="m-0 max-w-[640px] text-[15px] font-light leading-[1.6] text-ink-3">
          {post.body}
        </p>
      ) : null}

      {post.media?.length ? (
        <div
          className="grid h-[220px] max-w-[640px] gap-1.5"
          style={{
            gridTemplateColumns: post.media
              .map((m) => `${m.span}fr`)
              .join(' '),
          }}
        >
          {post.media.map((m) => (
            <MediaPlaceholder
              key={m.id}
              label={m.label}
                  src={postMedia(m.label, m.id)}
              className="rounded-[10px]"
              variant="default"
            />
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-6 text-[13px] font-light text-ink-5">
        <button
          type="button"
          disabled={!can(user, 'feed.like')}
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label={liked ? 'Remove like' : 'Like post'}
          className={cn(
            'flex items-center gap-1.5 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-50',
            liked && 'text-terracotta hover:text-terracotta',
          )}
        >
          <Heart size={18} weight={liked ? 'fill' : 'light'} />
          {likes}
        </button>

        <Link
          href={`/posts/${post.id}`}
          className="flex items-center gap-1.5 text-ink-5 hover:text-ink"
        >
          <ChatTeardrop size={18} weight="light" />
          {post.commentCount}
        </Link>

        {can(user, 'feed.save') ? (
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save post'}
            className={cn(
              'transition-colors hover:text-ink',
              saved && 'text-tulsi-ink hover:text-tulsi-ink',
            )}
          >
            <BookmarkSimple size={18} weight={saved ? 'fill' : 'light'} />
          </button>
        ) : null}

        <span className="flex-1" />

        <PostMenu post={post} />
      </div>
    </article>
  )
}

export function PostByline({
  post,
  size = 'sm',
}: {
  post: Post
  size?: 'sm' | 'md'
}) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] font-light text-muted">
      <Avatar
        initials={post.author.initials}
        tone={post.author.avatarTone}
        src={post.author.avatarUrl}
        size={size === 'sm' ? 'sm' : 'md'}
      />
      <span
        className={cn(
          'font-normal text-ink',
          size === 'md' && 'text-[14px]',
        )}
      >
        {post.author.name}
      </span>
      <span>·</span>
      <span>{post.timeAgo}</span>
      <FlagLabel flagId={post.flagId} className="ml-1.5" />
    </div>
  )
}

/** Overflow menu — copy link and report, both permission-aware. */
function PostMenu({ post }: { post: Post }) {
  const { user } = useSession()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="More actions"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center text-ink-5 transition-colors hover:text-ink"
      >
        <DotsThree size={20} weight="light" />
      </button>
      {open ? (
        <div className="absolute right-0 top-7 z-10 flex w-[180px] flex-col overflow-hidden rounded-[10px] border border-line bg-surface py-1 text-[14px] font-light">
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(
                `${window.location.origin}/posts/${post.id}`,
              )
              setOpen(false)
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 text-left text-ink-2 transition-colors hover:bg-[#EFE8DC]"
          >
            <LinkSimple size={16} weight="light" />
            Copy link
          </button>
          {can(user, 'feed.report') ? (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-left text-ink-2 transition-colors hover:bg-[#EFE8DC]"
            >
              <FlagIcon size={16} weight="light" />
              Report
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
