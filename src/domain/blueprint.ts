export type BlockFacing = 'north' | 'south' | 'east' | 'west'
export type BlockAxis = 'x' | 'y' | 'z'
export type BuildStepKind = 'foundation' | 'structure' | 'shell' | 'roof' | 'interior' | 'detail'

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
  stepId: string
  states?: BlockState
  note?: string
  materialUnits?: number
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

export interface BuildChallenge {
  prompt: string
  hint?: string
  reflection?: string
}

export interface BuildStep {
  id: string
  title: string
  description: string
  layer: number
  kind: BuildStepKind
  concept?: string
  tip?: string
  challenge?: BuildChallenge
}

export interface Blueprint {
  id: string
  title: string
  edition: 'bedrock'
  minimumVersion: string
  targetVersion: string
  style: string
  survivalTier: 'early' | 'mid' | 'late'
  size: {
    width: number
    depth: number
    height: number
  }
  spawnReference: {
    description: string
    origin: [number, number, number]
  }
  lessons: BuildLesson[]
  steps: BuildStep[]
  blocks: BlueprintBlock[]
  materialSubstitutions?: Record<string, string[]>
  materials?: MaterialRequirement[]
}
