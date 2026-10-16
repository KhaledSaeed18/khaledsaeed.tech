/**
 * A WebGL canvas can only be read in the same task that drew it (its buffer
 * is not preserved), so the printer's loupe cannot copy the portrait on its
 * own schedule. Canvases that want to show up under the loupe call `tap`
 * right after they draw, and register `redraw` so the loupe can ask for a
 * frame when nothing is animating.
 */
type Tap = (source: HTMLCanvasElement) => void

const taps = new Set<Tap>()
const redraws = new Set<() => void>()

export const loupeTap = {
  /** Called by a canvas after every frame it draws. */
  tap(source: HTMLCanvasElement) {
    if (taps.size) taps.forEach((t) => t(source))
  },
  /** Called by the loupe to receive frames. Returns the unsubscribe. */
  listen(t: Tap) {
    taps.add(t)
    redraws.forEach((r) => r())
    return () => void taps.delete(t)
  },
  /** Called by a canvas to be asked for a frame. Returns the unsubscribe. */
  onRedraw(r: () => void) {
    redraws.add(r)
    return () => void redraws.delete(r)
  },
}
