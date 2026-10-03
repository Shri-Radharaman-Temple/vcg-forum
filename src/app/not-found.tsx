import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-ground px-6 text-center">
      <span className="deva text-[28px]">राधे राधे</span>
      <h1 className="m-0 text-[26px] font-light">This page could not be found</h1>
      <p className="m-0 max-w-[400px] text-[15px] font-light leading-[1.6] text-ink-4">
        The link may be out of date, or the content may have been removed by a
        moderator.
      </p>
      <Link href="/" className="mt-2 text-[15px]">
        ← Back to the feed
      </Link>
    </div>
  )
}
