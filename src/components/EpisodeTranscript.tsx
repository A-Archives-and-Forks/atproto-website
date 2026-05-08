import { Prose } from './Prose'

interface EpisodeTranscriptProps {
  /** The default export of the transcript MDX module. */
  Transcript: React.ComponentType
}

export function EpisodeTranscript({ Transcript }: EpisodeTranscriptProps) {
  return (
    <details className="group mt-12 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <summary className="cursor-pointer list-none p-4 font-mono text-sm font-medium uppercase tracking-wide text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
        <span className="mr-2 inline-block transition group-open:rotate-90">▸</span>
        Transcript
      </summary>
      <div className="border-t border-zinc-200 p-6 dark:border-zinc-800">
        <Prose className="prose-sm">
          <Transcript />
        </Prose>
      </div>
    </details>
  )
}
