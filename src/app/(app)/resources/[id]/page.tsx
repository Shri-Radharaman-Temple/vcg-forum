'use client'

import * as React from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  BookmarkSimple,
  Headphones,
  ShareNetwork,
} from '@phosphor-icons/react'
import { Main, Rail } from '@/components/app/shell'
import { bookCover } from '@/lib/images'
import { MediaPlaceholder } from '@/components/ui/card'
import { getResource } from '@/data/mock'
import { cn } from '@/lib/utils'

/** Screen 1e — Resource detail · book. */
export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const resource = getResource(id)
  if (!resource) notFound()

  const [saved, setSaved] = React.useState(resource.savedByMe ?? false)

  const facts: [string, string][] = [
    resource.languages?.length
      ? (['Language', resource.languages.join(' · ')] as [string, string])
      : null,
    resource.pageCount
      ? (['PDF', `${resource.pageCount} pages`] as [string, string])
      : null,
    resource.audioDuration
      ? (['Audiobook', resource.audioDuration] as [string, string])
      : null,
    resource.tags?.length
      ? (['Tags', resource.tags.join(', ')] as [string, string])
      : null,
  ].filter(Boolean) as [string, string][]

  return (
    <>
      <Main className="gap-7 px-14 py-8">
        <Link
          href="/resources"
          className="flex items-center gap-2 text-[14px] font-light text-ink-5 hover:text-ink"
        >
          <ArrowLeft size={18} weight="light" />
          Resources <span className="text-muted-3">/</span>{' '}
          <span className="capitalize">{resource.kind}s</span>
        </Link>

        <div className="flex gap-14 pb-12">
          <div className="flex w-[260px] shrink-0 flex-col gap-4">
            <MediaPlaceholder
              label={resource.title}
              src={bookCover(resource.id)}
              className="aspect-[3/4] rounded-[8px]"
            />
            <dl className="m-0 flex flex-col gap-2 text-[13px] font-light text-ink-4">
              {facts.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-3 border-t border-line pt-2"
                >
                  <dt className="text-muted">{k}</dt>
                  <dd className="m-0 text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex max-w-[620px] flex-1 flex-col gap-[18px]">
            <div className="flex flex-col gap-1">
              {resource.devanagariTitle ? (
                <span className="deva text-[20px]">
                  {resource.devanagariTitle}
                </span>
              ) : null}
              <h1 className="m-0 text-[38px] font-light leading-[1.15]">
                {resource.title}
              </h1>
              <span className="text-[16px] font-light text-ink-5">
                {resource.author}
              </span>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                className="flex items-center gap-2 rounded-[10px] bg-tulsi px-[22px] py-2.5 text-[15px] text-[#F7F2EA] transition-colors hover:bg-tulsi-ink"
              >
                <BookOpen size={18} weight="light" />
                {resource.progress
                  ? `Continue · p. ${resource.progress.page}`
                  : 'Read'}
              </button>
              {resource.audioDuration ? (
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-[10px] border border-line-strong px-[18px] py-2.5 text-[15px] font-light text-ink-2 transition-colors hover:border-line-deep"
                >
                  <Headphones size={18} weight="light" />
                  Listen
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setSaved((v) => !v)}
                aria-pressed={saved}
                aria-label={saved ? 'Remove from saved' : 'Save resource'}
                className={cn(
                  'flex items-center rounded-[10px] border border-line-strong px-3 py-2.5 text-ink-2 transition-colors hover:border-line-deep',
                  saved && 'border-tulsi text-tulsi-ink',
                )}
              >
                <BookmarkSimple size={18} weight={saved ? 'fill' : 'light'} />
              </button>
              <button
                type="button"
                aria-label="Share resource"
                onClick={() =>
                  void navigator.clipboard?.writeText(window.location.href)
                }
                className="flex items-center rounded-[10px] border border-line-strong px-3 py-2.5 text-ink-2 transition-colors hover:border-line-deep"
              >
                <ShareNetwork size={18} weight="light" />
              </button>
            </div>

            {resource.description ? (
              <p className="m-0 text-[16px] font-light leading-[1.7] text-ink-3">
                {resource.description}
              </p>
            ) : null}

            {resource.chapters?.length ? (
              <div className="flex flex-col">
                <span className="mb-2.5 mt-2 text-[15px]">Contents</span>
                {resource.chapters.map((c) => (
                  <div
                    key={c.n}
                    className="flex items-baseline gap-4 border-t border-line py-3"
                  >
                    <span className="w-[22px] text-[20px] font-extralight leading-none text-muted-2">
                      {c.n}
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-[15px]">{c.title}</span>
                      <span className="text-[13px] font-light text-muted">
                        {c.sub}
                      </span>
                    </span>
                    <span className="text-[13px] font-light text-muted">
                      {c.pages}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Main>

      <Rail width={300} className="gap-3.5 px-7">
        <span className="text-[15px]">Related</span>
        {(resource.related ?? []).map((r) => (
          <Link
            key={r.id}
            href={
              r.meta.startsWith('Post')
                ? `/posts/${r.id}`
                : `/resources/${r.id}`
            }
            className="flex gap-3 border-t border-line pt-3 hover:text-ink"
          >
            <MediaPlaceholder
              variant="tight"
              src={bookCover(r.id)}
              className="h-[54px] w-10 shrink-0 rounded-[3px]"
            />
            <span className="flex flex-col">
              <span className="text-[14px] leading-[1.3] text-ink">
                {r.title}
              </span>
              <span className="text-[12px] font-light text-muted">{r.meta}</span>
            </span>
          </Link>
        ))}
      </Rail>
    </>
  )
}
