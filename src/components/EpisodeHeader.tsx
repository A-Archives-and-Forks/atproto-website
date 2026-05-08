import Image from 'next/image'
import { SHOW, type Episode } from '@/lib/episodes'
import { SubscribeLinks } from './SubscribeLinks'

export interface EpisodeHeaderProps
  extends Omit<Episode, 'slug' | 'hasTranscript' | 'blueskyPostUrl'> {}

export function EpisodeHeader(props: EpisodeHeaderProps) {
  const cover = props.coverImage ?? SHOW.coverImage
  const host = props.host ?? SHOW.defaultHost
  const mimeType = props.audioMimeType ?? 'audio/mpeg'

  return (
    <header className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Image
          src={cover}
          alt={`Cover art for ${props.title}`}
          width={200}
          height={200}
          className="h-40 w-40 flex-shrink-0 rounded-lg sm:h-48 sm:w-48"
          unoptimized
        />
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3 text-sm text-zinc-500 dark:text-zinc-500">
            <span className="font-mono">Episode {props.episodeNumber}</span>
            <time dateTime={props.pubDate}>{props.date}</time>
            <span aria-hidden="true">·</span>
            <span>{props.duration}</span>
          </div>
          <h1 className="font-mono text-3xl font-medium md:text-4xl">
            {props.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {props.description}
          </p>
          {props.guests && props.guests.length > 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              With {props.guests.join(', ')}
            </p>
          )}
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Hosted by {host}
          </p>
        </div>
      </div>

      {/*
        preload="metadata" gets us the duration and seek bar without
        downloading the full episode on every page load.
      */}
      <audio
        controls
        preload="metadata"
        className="w-full"
        aria-label={`Audio player for ${props.title}`}
      >
        <source src={props.audioUrl} type={mimeType} />
        Your browser does not support the audio element.{' '}
        <a href={props.audioUrl} className="underline">
          Download the MP3
        </a>{' '}
        instead.
      </audio>

      <SubscribeLinks />
    </header>
  )
}
