'use client'

import * as React from 'react'
import Link from 'next/link'
import { MagnifyingGlass, Play } from '@phosphor-icons/react'
import { Main } from '@/components/app/shell'
import { bookCover, videoThumb } from '@/lib/images'
import { PageTitle, MediaPlaceholder, SectionHead } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { resources, resourcesOfKind } from '@/data/mock'
import type { Resource, ResourceKind } from '@/types'

type Filter = 'all' | ResourceKind | 'saved'

/** Screen 1d — Resources · library. */
export default function ResourcesPage() {
  const [filter, setFilter] = React.useState<Filter>('all')
  const [query, setQuery] = React.useState('')

  const books = resourcesOfKind('book')
  const audiobooks = resourcesOfKind('audiobook')
  const youtube = resourcesOfKind('youtube')
  const continueReading = resources.find((r) => r.progress)

  const matches = (r: Resource) =>
    !query ||
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.author.toLowerCase().includes(query.toLowerCase())

  const filtered = React.useMemo(() => {
    let list = resources.filter(matches)
    if (filter === 'saved') list = list.filter((r) => r.savedByMe)
    else if (filter !== 'all') list = list.filter((r) => r.kind === filter)
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, query])

  const showSections = filter === 'all' && !query

  return (
    <Main className="gap-6 lg:gap-[30px] px-5 lg:px-14 py-6 lg:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <PageTitle deva="ग्रन्थ-भण्डार">Resources</PageTitle>
        <label className="flex h-10 w-full items-center sm:w-[360px] gap-2.5 rounded-[10px] border border-line-strong bg-surface px-3.5 focus-within:border-tulsi">
          <MagnifyingGlass size={17} weight="light" className="text-muted-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, audio, videos"
            aria-label="Search resources"
            className="flex-1 bg-transparent text-[14px] font-light text-ink placeholder:text-muted-2 focus:outline-none max-lg:text-[16px]"
          />
        </label>
      </header>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="border-b border-line">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="book">Books</TabsTrigger>
          <TabsTrigger value="pdf">PDFs</TabsTrigger>
          <TabsTrigger value="audiobook">Audiobooks</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
      </Tabs>

      {continueReading && showSections ? (
        <div className="flex flex-wrap items-center gap-4 rounded-[12px] border border-line bg-surface px-4 py-4 sm:flex-nowrap sm:gap-[22px] sm:px-[22px] sm:py-[18px]">
          <MediaPlaceholder
            variant="tight"
            src={bookCover(continueReading.id)}
            className="h-[72px] w-[52px] shrink-0 rounded-[4px]"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[12px] uppercase tracking-[0.1em] text-muted">
              Continue reading
            </span>
            <span className="text-[17px] sm:text-[18px]">{continueReading.title}</span>
            <div className="flex items-center gap-3">
              <div
                className="h-[3px] w-full max-w-[220px] flex-1 rounded-sm bg-line"
                role="progressbar"
                aria-valuenow={continueReading.progress!.page}
                aria-valuemin={0}
                aria-valuemax={continueReading.progress!.of}
              >
                <div
                  className="h-full rounded-sm bg-tulsi"
                  style={{
                    width: `${Math.round(
                      (continueReading.progress!.page /
                        continueReading.progress!.of) *
                        100,
                    )}%`,
                  }}
                />
              </div>
              <span className="shrink-0 text-[13px] font-light text-muted">
                p. {continueReading.progress!.page} of{' '}
                {continueReading.progress!.of}
              </span>
            </div>
          </div>
          <Link
            href={`/resources/${continueReading.id}`}
            className="w-full rounded-[10px] border border-tulsi px-5 py-[9px] text-center text-[14px] text-tulsi-ink sm:w-auto hover:bg-tulsi-tint hover:text-tulsi-ink"
          >
            Resume
          </Link>
        </div>
      ) : null}

      {showSections ? (
        <>
          <section className="flex flex-col gap-4">
            <SectionHead
              title="Books"
              action={
                <span className="text-[13px] font-light text-tulsi-ink">
                  See all {books.length}
                </span>
              }
            />
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-[22px] xl:grid-cols-6">
              {books.map((b) => (
                <BookCard key={b.id} resource={b} />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 pb-12 md:grid-cols-2 md:gap-10">
            <div className="flex flex-col gap-1.5">
              <span className="mb-1.5 text-[17px]">Audiobooks</span>
              {audiobooks.map((a) => (
                <Link
                  key={a.id}
                  href={`/resources/${a.id}`}
                  className="flex items-center gap-3.5 border-t border-line py-2.5 hover:text-ink"
                >
                  <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-line-deep text-ink">
                    <Play size={14} weight="light" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[14px] text-ink">{a.title}</span>
                    <span className="text-[12px] font-light text-muted">
                      {a.meta}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="mb-1.5 text-[17px]">YouTube</span>
              {youtube.map((v) => (
                <Link
                  key={v.id}
                  href={`/resources/${v.id}`}
                  className="flex items-center gap-3.5 border-t border-line py-2.5 hover:text-ink"
                >
                  <MediaPlaceholder
                    variant="tight"
                    src={videoThumb(v.id)}
                    className="h-9 w-16 shrink-0 rounded-[4px]"
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[14px] text-ink">{v.title}</span>
                    <span className="text-[12px] font-light text-muted">
                      {v.meta}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="pb-12">
          {filtered.length === 0 ? (
            <EmptyState
              icon={MagnifyingGlass}
              title="Nothing found"
              body={
                filter === 'saved'
                  ? 'Resources you save are kept here for quick access.'
                  : 'Try a different search or category.'
              }
            />
          ) : (
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-[22px] xl:grid-cols-6">
              {filtered.map((r) => (
                <BookCard key={r.id} resource={r} />
              ))}
            </div>
          )}
        </section>
      )}
    </Main>
  )
}

function BookCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.id}`}
      className="flex flex-col gap-2 hover:text-ink"
    >
      <MediaPlaceholder
        label={resource.title}
        src={bookCover(resource.id)}
        className="aspect-[3/4] rounded-[6px] text-[10px]"
      />
      <span className="flex flex-col gap-px">
        <span className="text-[14px] leading-[1.3] text-ink">
          {resource.title}
        </span>
        <span className="text-[12px] font-light leading-[1.35] text-muted">
          {resource.author}
        </span>
      </span>
    </Link>
  )
}
