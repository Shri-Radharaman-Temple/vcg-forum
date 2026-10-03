'use client'

import * as React from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import {
  ArrowLeft,
  BookmarkSimple,
  Flag as FlagIcon,
  Heart,
  LinkSimple,
} from '@phosphor-icons/react'
import { Main, Rail } from '@/components/app/shell'
import { useSession } from '@/components/app/session'
import { Avatar } from '@/components/ui/avatar'
import { Dot } from '@/components/ui/flag-dot'
import { postMedia } from '@/lib/images'
import { MediaPlaceholder } from '@/components/ui/card'
import { flagById } from '@/lib/flags'
import { can } from '@/lib/rbac'
import { cn, plural } from '@/lib/utils'
import { getComments, getPost, relatedInFlag } from '@/data/mock'
import type { Comment } from '@/types'

/** Screen 1b — Post detail, comments with one level of replies. */
export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const post = getPost(id)
  if (!post) notFound()

  const { user } = useSession()
  const flag = flagById(post.flagId)
  const comments = getComments(post.id)
  const related = relatedInFlag[post.flagId] ?? []

  const [liked, setLiked] = React.useState(post.likedByMe)
  const [saved, setSaved] = React.useState(post.savedByMe)
  const [draft, setDraft] = React.useState('')
  const likes = post.likeCount + (liked === post.likedByMe ? 0 : liked ? 1 : -1)

  return (
    <>
      <Main className="gap-[22px] px-5 lg:px-14 pb-0 pt-5 lg:pt-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-[14px] font-light text-ink-5 hover:text-ink"
        >
          <ArrowLeft size={18} weight="light" />
          Feed
        </Link>

        <article className="flex max-w-[700px] flex-col gap-3.5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] font-light text-muted">
            <Avatar
              initials={post.author.initials}
              tone={post.author.avatarTone}
              size="md"
            />
            <span className="text-[14px] font-normal text-ink">
              {post.author.name}
            </span>
            <span>·</span>
            <span>{post.timeAgo}</span>
            <span
              className="flex items-center gap-1.5 sm:ml-1.5"
              style={{ color: flag.color }}
            >
              <Dot color={flag.color} />
              {flag.label}
            </span>
          </div>

          <h1 className="m-0 text-[24px] font-light leading-[1.25] sm:text-[32px]">
            {post.title}
          </h1>

          {post.body ? (
            <p className="m-0 text-[16px] font-light leading-[1.65] text-ink-3">
              {post.body}
            </p>
          ) : null}

          {post.media?.length ? (
            <div
              className="grid h-[200px] gap-1.5 sm:h-[300px]"
              style={{
                gridTemplateColumns: post.media.map((m) => `${m.span}fr`).join(' '),
              }}
            >
              {post.media.map((m) => (
                <MediaPlaceholder
                  key={m.id}
                  label={m.label}
                  src={postMedia(m.label, m.id)}
                  className="rounded-[10px]"
                />
              ))}
            </div>
          ) : null}

          <div className="flex items-center gap-2.5 border-y border-line py-3 text-[14px] font-light text-ink-4">
            <button
              type="button"
              disabled={!can(user, 'feed.like')}
              onClick={() => setLiked((v) => !v)}
              aria-pressed={liked}
              className={cn(
                'flex items-center gap-[7px] rounded-[8px] border border-line-strong px-3 py-1.5 transition-colors hover:border-line-deep disabled:pointer-events-none disabled:opacity-50',
                liked && 'border-terracotta text-terracotta',
              )}
            >
              <Heart size={17} weight={liked ? 'fill' : 'light'} />
              {likes}
            </button>

            {can(user, 'feed.save') ? (
              <button
                type="button"
                onClick={() => setSaved((v) => !v)}
                aria-pressed={saved}
                className={cn(
                  'flex items-center gap-[7px] rounded-[8px] border border-line-strong px-3 py-1.5 transition-colors hover:border-line-deep',
                  saved && 'border-tulsi text-tulsi-ink',
                )}
              >
                <BookmarkSimple size={17} weight={saved ? 'fill' : 'light'} />
                {saved ? 'Saved' : 'Save'}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() =>
                void navigator.clipboard?.writeText(window.location.href)
              }
              aria-label="Copy link"
              className="flex items-center gap-[7px] rounded-[8px] border border-line-strong px-3 py-1.5 transition-colors hover:border-line-deep"
            >
              <LinkSimple size={17} weight="light" />
              <span className="hidden sm:inline">Copy link</span>
            </button>

            <span className="flex-1" />

            {can(user, 'feed.report') ? (
              <button
                type="button"
                aria-label="Report"
                className="flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
              >
                <FlagIcon size={16} weight="light" />
                <span className="hidden sm:inline">Report</span>
              </button>
            ) : null}
          </div>
        </article>

        <section className="flex max-w-[700px] flex-col gap-[18px] pb-12">
          <span className="text-[15px]">
            {plural(post.commentCount, 'comment')}
          </span>

          {can(user, 'feed.comment') ? (
            <div className="flex gap-3">
              <Avatar initials={user.initials} tone={user.avatarTone} size="md" />
              <div className="flex flex-1 items-center gap-2 rounded-[10px] border border-line-strong bg-surface py-1 pl-3.5 pr-1.5 focus-within:border-tulsi">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Add a comment…"
                  aria-label="Add a comment"
                  className="h-8 flex-1 bg-transparent text-[14px] font-light text-ink placeholder:text-muted-2 focus:outline-none max-lg:text-[16px]"
                />
                <button
                  type="button"
                  disabled={!draft.trim()}
                  onClick={() => setDraft('')}
                  className="rounded-[7px] bg-tulsi px-3.5 py-[5px] text-[13px] text-[#F4EEE5] transition-opacity disabled:opacity-40"
                >
                  Post
                </button>
              </div>
            </div>
          ) : null}

          {comments.map((c) => (
            <CommentThread key={c.id} comment={c} />
          ))}
        </section>
      </Main>

      <Rail>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-[15px]">
            <Dot color={flag.color} size={7} />
            {flag.label}
          </span>
          <span className="text-[14px] font-light leading-[1.55] text-ink-4">
            {flag.description}
          </span>
        </div>

        {related.length ? (
          <div className="flex flex-col gap-3">
            <span className="text-[15px]">Related in {flag.label}</span>
            {related.map((r) => (
              <Link
                key={r.title}
                href="/"
                className="border-t border-line pt-2.5 text-[14px] font-light leading-[1.45] text-ink-2 hover:text-terracotta"
              >
                {r.title}
                <br />
                <span className="text-[12px] text-muted">
                  {plural(r.comments, 'comment')}
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </Rail>
    </>
  )
}

/** A comment and its single level of replies (spec §7). */
function CommentThread({ comment }: { comment: Comment }) {
  const { user } = useSession()
  const [liked, setLiked] = React.useState(comment.likedByMe)
  const [replying, setReplying] = React.useState(false)
  const likes =
    comment.likeCount + (liked === comment.likedByMe ? 0 : liked ? 1 : -1)

  return (
    <div className="flex gap-3">
      <Avatar
        initials={comment.author.initials}
        tone={comment.author.avatarTone}
        size="md"
        className="shrink-0"
      />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="text-[13px] font-light text-muted">
          <span className="font-normal text-ink">{comment.author.name}</span> ·{' '}
          {comment.timeAgo}
        </div>
        <p className="m-0 text-[15px] font-light leading-[1.6] text-ink-2">
          {comment.body}
        </p>
        <div className="flex gap-[18px] text-[13px] font-light text-ink-5">
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            aria-pressed={liked}
            className={cn(
              'flex items-center gap-1.5 transition-colors hover:text-ink',
              liked && 'text-terracotta hover:text-terracotta',
            )}
          >
            <Heart size={15} weight={liked ? 'fill' : 'light'} />
            {likes}
          </button>
          {can(user, 'feed.comment') ? (
            <button
              type="button"
              onClick={() => setReplying((v) => !v)}
              className="transition-colors hover:text-ink"
            >
              Reply
            </button>
          ) : null}
        </div>

        {replying ? (
          <div className="mt-1 flex gap-2.5 border-l border-line-strong pl-4">
            <input
              autoFocus
              placeholder={`Reply to ${comment.author.name}…`}
              aria-label={`Reply to ${comment.author.name}`}
              className="h-9 flex-1 rounded-[8px] border border-line-strong bg-surface px-3 text-[14px] font-light text-ink placeholder:text-muted-2 focus:border-tulsi focus:outline-none max-lg:text-[16px]"
            />
            <button
              type="button"
              onClick={() => setReplying(false)}
              className="rounded-[8px] bg-tulsi px-3.5 text-[13px] text-[#F4EEE5]"
            >
              Reply
            </button>
          </div>
        ) : null}

        {comment.replies.map((r) => (
          <div
            key={r.id}
            className="mt-2 flex gap-2.5 border-l border-line-strong pl-4"
          >
            <Avatar
              initials={r.author.initials}
              tone={r.author.avatarTone}
              size="xs"
              className="shrink-0"
            />
            <div className="flex flex-col gap-1">
              <div className="text-[13px] font-light text-muted">
                <span className="font-normal text-ink">{r.author.name}</span> ·{' '}
                {r.timeAgo}
              </div>
              <p className="m-0 text-[15px] font-light leading-[1.6] text-ink-2">
                {r.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
