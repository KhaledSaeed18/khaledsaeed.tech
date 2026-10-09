import type { ObjectKind } from "@/lib/content/projects"

/** Sprite geometry shared by the studio that renders objects and the cards that show them. */
export const OBJECT_CELLS = 112
export const OBJECT_FRAMES = 16

export const OBJECTS: ObjectKind[] = [
  "grid",
  "layers",
  "cards",
  "toolbox",
  "cap",
  "key",
  "hourglass",
  "lens",
  "folder",
  "square",
  "scissors",
  "bubble",
  "bulb",
  "battery",
]
