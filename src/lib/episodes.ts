// src/lib/episodes.ts

/**
 * Off Protocol — podcast episode data model and show metadata.
 *
 * Mirrors src/lib/posts.ts in shape and ordering convention (newest first).
 *
 * Why two date fields and two duration fields:
 *   - `date` / `duration` are human-readable strings shown on the page.
 *   - `pubDate` / `durationSeconds` are machine formats required by the
 *     RSS spec and useful for sorting / aggregation.
 *   The `npm run podcast create` script populates both in sync so they
 *   cannot drift unless edited by hand.
 */

export interface Episode {
  slug: string                  // URL slug, e.g. "ep-01-why-atproto"
  episodeNumber: number         // 1, 2, 3… for ordering + RSS <itunes:episode>
  title: string
  description: string           // 1–2 sentence summary for listing + RSS + OG
  date: string                  // human-readable, e.g. "May 7, 2026"
  pubDate: string               // ISO 8601, used for RSS <pubDate>
  duration: string              // "HH:MM:SS" — RSS spec format
  durationSeconds: number       // numeric, easier to format/sort
  guests?: string[]
  host?: string                 // defaults to SHOW.defaultHost when omitted
  audioUrl: string              // absolute CDN URL to the MP3
  audioSizeBytes: number        // required by RSS <enclosure length="…">
  audioMimeType?: string        // defaults to "audio/mpeg"
  coverImage?: string           // square, ≥1400px; falls back to SHOW.coverImage
  hasTranscript?: boolean       // true if transcript.mdx exists
  explicit?: boolean            // RSS <itunes:explicit>; defaults false
  blueskyPostUrl?: string       // optional Bluesky discussion thread anchor
}

export interface SubscribeUrls {
  apple: string | null
  spotify: string | null
  overcast: string | null
  pocketcasts: string | null
  rss: string
  generic: string
}

export interface ShowMeta {
  title: string
  description: string
  author: string
  defaultHost: string
  ownerEmail: string
  language: string
  category: string
  coverImage: string
  feedUrl: string
  siteUrl: string
  subscribe: SubscribeUrls
}

// TODO(launch): Replace placeholder description and ownerEmail before
// submitting the feed to Apple Podcasts. Apple rejects feeds without a
// real owner email.
export const SHOW: ShowMeta = {
  title: 'Off Protocol',
  description: 'Conversations about AT Protocol and the open social web with the people working to build a better internet. Brought to you by the Bluesky DevRel team.',
  author: 'Bluesky DevRel',
  defaultHost: 'Jim Ray',
  ownerEmail: 'hello+atproto@blueskyweb.xyz',
  language: 'en-US',
  category: 'Technology',
  coverImage: '/off-protocol/cover.svg', // TODO(launch): replace with .jpg, ≥1400×1400
  feedUrl: 'https://atproto.com/off-protocol/rss.xml',
  siteUrl: 'https://atproto.com/off-protocol',
  subscribe: {
    apple: null,                // TODO(post-launch): fill in after Apple ingestion
    spotify: null,              // TODO(post-launch): fill in after Spotify ingestion
    overcast: null,             // TODO(post-launch): fill in after Overcast ingestion
    pocketcasts: null,          // TODO(post-launch): fill in after PocketCasts ingestion
    rss: 'https://atproto.com/off-protocol/rss.xml',
    generic: 'podcast://atproto.com/off-protocol/rss.xml',
  },
}

export const episodes: Episode[] = [
  // newest first; populate via `npm run podcast create`
]
