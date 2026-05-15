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

export const SHOW: ShowMeta = {
  title: 'Off Protocol',
  description: 'Conversations about AT Protocol and the open social web with the people working to build a better internet. Brought to you by the Bluesky DevRel team.',
  author: 'Bluesky DevRel',
  defaultHost: 'Jim Ray',
  ownerEmail: 'hello+atproto@blueskyweb.xyz',
  language: 'en-US',
  category: 'Technology',
  coverImage: 'https://media.atproto.com/off-protocol/off-protocol-cover.png',
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
  {
    slug: 'slowly-then-quickly-what-atmosphereconf-made-visible',
    episodeNumber: 2,
    title: 'Slowly, Then Quickly: What AtmosphereConf Made Visible',
    description:
      'With AtmosphereConf 2026 wrapped, Boris Mann and Ted Han join to talk about what the gathering surfaced in the ecosystem. From the IETF working group, the move beyond a single foundation, to a growing layer of co-ops, regional meetups, and independent stewards.',
    date: 'April 20, 2026',
    pubDate: '2026-04-20T12:00:00Z',
    duration: '01:06:09',
    durationSeconds: 3969,
    guests: ['Boris Mann', 'Ted Han'],
    audioUrl: 'https://media.atproto.com/off-protocol/20260410-live/2026-04-10-live-boris-ted.mp3',
    audioSizeBytes: 127011840,
    audioMimeType: 'audio/mpeg',
    hasTranscript: true,
  },
  {
    slug: 'a-thousand-prs-in-two-weeks-building-npmx',
    episodeNumber: 1,
    title: 'A Thousand PRs in Two Weeks: Building NPMX',
    description:
      'Daniel Roe, Matias Capeletto, and Zeu join to discuss how their frustration with JavaScript packaging went from a Bluesky post to one of the most successful new community-led projects on the protocol.',
    date: 'February 27, 2026',
    pubDate: '2026-02-27T12:00:00Z',
    duration: '00:58:45',
    durationSeconds: 3525,
    guests: ['Daniel Roe', 'Matias Capeletto', 'Zeu'],
    audioUrl: 'https://media.atproto.com/off-protocol/20260227-live/2026-02-27-npmx-team.mp3',
    audioSizeBytes: 112814592,
    audioMimeType: 'audio/mpeg',
    hasTranscript: true,
  },
  // newest first; populate via `npm run podcast create`
]
