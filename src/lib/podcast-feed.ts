// src/lib/podcast-feed.ts
import type { Episode, ShowMeta } from './episodes'

/**
 * Build a complete RSS 2.0 + iTunes podcast feed XML document from
 * show metadata and an episodes array.
 *
 * All values are XML-escaped. <content:encoded> is wrapped in CDATA and
 * is the caller's responsibility to render to HTML beforehand (see
 * mdxBodyToHtml in podcast-feed-content.ts).
 *
 * GUID stability: episode GUIDs are `off-protocol-ep-{episodeNumber}`.
 * They must never change once distributed; renaming an episode slug is
 * fine, but the GUID stays put.
 */

export interface FeedEpisode extends Episode {
  /** HTML-rendered show notes; placed in <content:encoded> CDATA. */
  contentHtml: string
}

const ITUNES_NS = 'http://www.itunes.com/dtds/podcast-1.0.dtd'
const CONTENT_NS = 'http://purl.org/rss/1.0/modules/content/'
const ATOM_NS = 'http://www.w3.org/2005/Atom'

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function cdataSafe(html: string): string {
  // CDATA cannot contain the literal "]]>" — split it if present.
  return html.replace(/\]\]>/g, ']]]]><![CDATA[>')
}

function toRfc822(isoDate: string): string {
  // RSS <pubDate> uses RFC 822 dates. JS toUTCString() is RFC 1123,
  // which is RFC 822-compatible for podcatchers.
  return new Date(isoDate).toUTCString()
}

function episodeGuid(episode: Episode): string {
  // STABLE FOREVER. Do not derive from slug, title, or audioUrl.
  return `off-protocol-ep-${episode.episodeNumber}`
}

function episodeUrl(show: ShowMeta, episode: Episode): string {
  return `${show.siteUrl}/${episode.slug}`
}

function renderItem(show: ShowMeta, episode: FeedEpisode): string {
  const mime = episode.audioMimeType ?? 'audio/mpeg'
  const cover = episode.coverImage
    ? episode.coverImage.startsWith('http')
      ? episode.coverImage
      : `https://atproto.com${episode.coverImage}`
    : `https://atproto.com${show.coverImage}`

  return `    <item>
      <title>${xmlEscape(episode.title)}</title>
      <link>${xmlEscape(episodeUrl(show, episode))}</link>
      <description>${xmlEscape(episode.description)}</description>
      <enclosure url="${xmlEscape(episode.audioUrl)}" length="${episode.audioSizeBytes}" type="${xmlEscape(mime)}"/>
      <guid isPermaLink="false">${xmlEscape(episodeGuid(episode))}</guid>
      <pubDate>${xmlEscape(toRfc822(episode.pubDate))}</pubDate>
      <itunes:duration>${xmlEscape(episode.duration)}</itunes:duration>
      <itunes:episode>${episode.episodeNumber}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>${episode.explicit ? 'true' : 'false'}</itunes:explicit>
      <itunes:image href="${xmlEscape(cover)}"/>
      <content:encoded><![CDATA[${cdataSafe(episode.contentHtml)}]]></content:encoded>
    </item>`
}

export function buildPodcastFeed(show: ShowMeta, episodes: FeedEpisode[]): string {
  const items = episodes.map((e) => renderItem(show, e)).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:itunes="${ITUNES_NS}"
     xmlns:content="${CONTENT_NS}"
     xmlns:atom="${ATOM_NS}">
  <channel>
    <title>${xmlEscape(show.title)}</title>
    <link>${xmlEscape(show.siteUrl)}</link>
    <description>${xmlEscape(show.description)}</description>
    <language>${xmlEscape(show.language)}</language>
    <itunes:author>${xmlEscape(show.author)}</itunes:author>
    <itunes:owner>
      <itunes:name>${xmlEscape(show.author)}</itunes:name>
      <itunes:email>${xmlEscape(show.ownerEmail)}</itunes:email>
    </itunes:owner>
    <itunes:image href="${xmlEscape(show.coverImage.startsWith('http') ? show.coverImage : `https://atproto.com${show.coverImage}`)}"/>
    <itunes:category text="${xmlEscape(show.category)}"/>
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <atom:link href="${xmlEscape(show.feedUrl)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`
}
