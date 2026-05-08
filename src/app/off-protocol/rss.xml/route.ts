// src/app/off-protocol/rss.xml/route.ts
//
// Lives OUTSIDE the [locale] segment because:
//   1. Podcatchers expect a single canonical feed URL (no /{locale}/ prefix).
//   2. The i18n middleware matcher in src/middleware.js excludes paths
//      containing ".", so /{locale}/off-protocol/rss.xml is not reachable
//      at the bare /off-protocol/rss.xml URL anyway.
import * as fs from 'fs/promises'
import * as path from 'path'
import { episodes, SHOW } from '@/lib/episodes'
import { buildPodcastFeed, type FeedEpisode } from '@/lib/podcast-feed'
import {
  mdxBodyToHtml,
  stripMdxFrontmatter,
} from '@/lib/podcast-feed-content'

async function loadEpisodeContentHtml(slug: string): Promise<string> {
  // Show notes live alongside the episode pages under [locale]; we always
  // read the English MDX for the (English-only) feed.
  const mdxPath = path.join(
    process.cwd(),
    'src',
    'app',
    '[locale]',
    'off-protocol',
    slug,
    'en.mdx',
  )
  try {
    const raw = await fs.readFile(mdxPath, 'utf-8')
    const body = stripMdxFrontmatter(raw)
    return await mdxBodyToHtml(body)
  } catch {
    return '<p></p>'
  }
}

export async function GET() {
  const feedEpisodes: FeedEpisode[] = await Promise.all(
    episodes.map(async (e) => ({
      ...e,
      contentHtml: await loadEpisodeContentHtml(e.slug),
    })),
  )

  const xml = buildPodcastFeed(SHOW, feedEpisodes)

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
