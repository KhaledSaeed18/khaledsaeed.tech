"use client"

import * as React from "react"

import { CopyGlyph } from "@/components/print/glyphs"
import type { Install } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/**
 * How to get the project running: each command on its own line of a code
 * block, with a copy button that says so for a moment. Commands are plain
 * text selected from the content file, never user input.
 */
export function TryIt({ install }: { install: Install[] }) {
  return (
    <ol className="grid gap-px overflow-hidden border border-border bg-border">
      {install.map((step, i) => (
        <li
          key={step.command}
          data-reveal
          style={{ "--reveal-delay": i } as React.CSSProperties}
          className="bg-background p-5 sm:p-6"
        >
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-brand">{"//"}</span>
              <span className="ml-2">{step.label}</span>
            </p>
            {step.note && (
              <p className="hidden font-mono text-xs text-muted-foreground sm:block">
                {step.note}
              </p>
            )}
          </div>
          <Command command={step.command} />
          {step.note && (
            <p className="mt-2 font-mono text-xs text-muted-foreground sm:hidden">
              {step.note}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}

function Command({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(id)
  }, [copied])

  return (
    <div className="mt-3 flex items-stretch gap-px">
      <pre className="min-w-0 flex-1 overflow-x-auto border border-border bg-card px-4 py-3 font-mono text-sm leading-relaxed text-foreground">
        <code>
          <span aria-hidden="true" className="text-muted-foreground select-none">
            ${" "}
          </span>
          {command}
        </code>
      </pre>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(command)
            setCopied(true)
          } catch {
            // nothing to fall back to; the command is right there to select
          }
        }}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 border border-border px-3 font-mono text-xs transition-colors hover:border-brand/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          copied ? "text-brand" : "text-muted-foreground"
        )}
        title="Copy the command"
      >
        <CopyGlyph done={copied} className="size-4" />
        <span aria-live="polite" className="hidden sm:inline">
          {copied ? "copied" : "copy"}
        </span>
        <span className="sr-only">
          {copied ? "" : ` the command ${command}`}
        </span>
      </button>
    </div>
  )
}
