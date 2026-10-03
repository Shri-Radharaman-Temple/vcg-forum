import Link from 'next/link'

/** Centred, chrome-free frame for the signed-out screens. */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ground px-6 py-12">
      <div className="flex w-full max-w-[420px] flex-col gap-8">
        <Link href="/" className="flex flex-col items-center gap-1 hover:text-ink">
          <span className="text-[20px] tracking-[0.28em] text-ink">VCG</span>
          <span className="deva text-[13px]">श्री राधारमण परिवार</span>
        </Link>
        {children}
      </div>
    </div>
  )
}
