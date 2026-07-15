export const CELL_WIDTH = 192
export const CELL_HEIGHT = 208
export const ATLAS_COLS = 8

export const CODEX_PET_STATES = [
  { name: 'idle',          label: 'Idle',         row: 0, frames: 6 },
  { name: 'running-right', label: 'Run right',     row: 1, frames: 8 },
  { name: 'running-left',  label: 'Run left',      row: 2, frames: 8 },
  { name: 'waving',        label: 'Waving',        row: 3, frames: 4 },
  { name: 'jumping',       label: 'Jumping',       row: 4, frames: 5 },
  { name: 'failed',        label: 'Failed',        row: 5, frames: 8 },
  { name: 'waiting',       label: 'Waiting',       row: 6, frames: 6 },
  { name: 'running',       label: 'Running',       row: 7, frames: 6 },
  { name: 'review',        label: 'Review',        row: 8, frames: 6 },
] as const

export type PetStateName = (typeof CODEX_PET_STATES)[number]['name']
