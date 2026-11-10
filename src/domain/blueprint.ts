export type BlockFacing = 'north' | 'south' | 'east' | 'west'
export type BlockAxis = 'x' | 'y' | 'z'

export interface BlockState {
  facing?: BlockFacing
  axis?: BlockAxis
  half?: 'top' | 'bottom'
  upsideDown?: boolean
  waterlogged?: boolean
  [key: string]: string | number | boolean | undefined
}

export interface BlueprintBlock {
  x: number
  y: number
  z: number
  block: string
  states?: BlockState
  note?: string
}

export interface MaterialRequirement {
  block: string
  count: number
  optional?: boolean
  substitutions?: string[]
}

export interface BuildLesson {
  id: string
  title: string
  concept: string
  explanation: string
  checkpoints?: string[]
}

export interface Blueprint {
  id: string
  title: string
  edition: 'bedrock'
  minimumVersion: string
  style: string
  survivalTier: 'early' | 'mid' | 'late'
  size: { width: number; depth: number; height: number }
  spawnReference: { description: string; origin: [number, number, number] }
  lessons: BuildLesson[]
  materials: MaterialRequirement[]
  blocks: BlueprintBlock[]
}
