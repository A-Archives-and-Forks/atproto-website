// src/components/SubscribeLinks.tsx
import clsx from 'clsx'
import { SHOW, type SubscribeUrls } from '@/lib/episodes'

interface ServiceConfig {
  key: keyof SubscribeUrls
  label: string
}

// Order matters: most-popular first. RSS and Generic always show because
// they're populated at launch; the rest light up after directory ingestion.
const SERVICES: ServiceConfig[] = [
  { key: 'apple', label: 'Apple Podcasts' },
  { key: 'spotify', label: 'Spotify' },
  { key: 'overcast', label: 'Overcast' },
  { key: 'pocketcasts', label: 'Pocket Casts' },
  { key: 'rss', label: 'RSS' },
  { key: 'generic', label: 'Subscribe' },
]

export function SubscribeLinks({ className }: { className?: string }) {
  const links = SERVICES.map((s) => ({ ...s, href: SHOW.subscribe[s.key] })).filter(
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
