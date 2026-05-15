// src/components/SubscribeLinks.tsx
import clsx from 'clsx'
import { headers } from 'next/headers'
import { SHOW, type SubscribeUrls } from '@/lib/episodes'

interface ServiceConfig {
  key: keyof SubscribeUrls
  label: string
}

// Order matters: most-popular first. Directory entries (apple/spotify/etc.)
// light up after their respective directories ingest the feed.
const SERVICES: ServiceConfig[] = [
  { key: 'apple', label: 'Apple Podcasts' },
  { key: 'spotify', label: 'Spotify' },
  { key: 'overcast', label: 'Overcast' },
  { key: 'pocketcasts', label: 'Pocket Casts' },
  { key: 'rss', label: 'RSS' },
  { key: 'generic', label: 'Subscribe' },
]

// Derive subscribe URLs whose host depends on where the request landed.
// Lets the Subscribe button work on localhost and preview deploys without
// editing SHOW.subscribe — production still resolves to atproto.com.
//
// Behind a reverse proxy the public hostname arrives in X-Forwarded-Host;
// the bare Host header would be the internal binding (e.g., localhost:10000
// on Render). Prefer the forwarded value when present.
function deriveDynamicUrls(): Partial<Record<keyof SubscribeUrls, string>> {
  const h = headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  if (!host) return {}
  return {
    generic: `podcast://${host}/off-protocol/rss.xml`,
  }
}

export function SubscribeLinks({ className }: { className?: string }) {
  const dynamic = deriveDynamicUrls()
  const links = SERVICES.map((s) => ({
    ...s,
    href: dynamic[s.key] ?? SHOW.subscribe[s.key],
  })).filter(
    (s): s is ServiceConfig & { href: string } => Boolean(s.href),
  )

  if (links.length === 0) return null

  return (
    <ul
      role="list"
      className={clsx('flex flex-wrap items-center gap-2', className)}
      aria-label="Subscribe to Off Protocol"
    >
      {links.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            className="inline-flex items-center rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
          >
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
