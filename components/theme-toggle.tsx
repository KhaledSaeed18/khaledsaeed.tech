"use client"

import * as React from "react"
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

/**
 * Visible companion to the existing "d" hotkey theme switch. Additive only —
 * it calls next-themes' setTheme and does not alter the provider or hotkey.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // next-themes can only resolve the active theme on the client; the mount
  // guard avoids a hydration mismatch on the icon.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        <HugeiconsIcon
          icon={isDark ? Sun03Icon : Moon02Icon}
          className="size-[1.15rem]"
          strokeWidth={1.6}
        />
      ) : (
        <span className="size-[1.15rem]" />
      )}
    </Button>
  )
}
