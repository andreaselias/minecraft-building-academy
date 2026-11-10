import type {
  Blueprint,
  BlueprintBlock,
  ReplaceBlockOperation,
} from '../domain/blueprint'

export interface MaterialSummary {
  block: string
  count: number
}

export function summarizeMaterials(blocks: BlueprintBlock[]): MaterialSummary[] {
  const totals = new Map<string, number>()

  for (const block of blocks) {
    const units = block.materialUnits ?? 1
    if (units <= 0) continue
    totals.set(block.block, (totals.get(block.block) ?? 0) + units)
  }

  return [...totals.entries()]
    .map(([block, count]) => ({ block, count }))
    .sort((a, b) => b.count - a.count)
}

function replacementAsBlock(
  operation: ReplaceBlockOperation,
): BlueprintBlock {
  return {
    x: operation.x,
    y: operation.y,
    z: operation.z,
    block: operation.block,
    stepId: operation.stepId,
    states: operation.states,
    materialUnits: operation.materialUnits,
  }
}

export function summarizeBlueprintMaterials(
  blueprint: Blueprint,
  stepId?: string,
): MaterialSummary[] {
  const blocks = stepId
    ? blueprint.blocks.filter((block) => block.stepId === stepId)
    : blueprint.blocks

  const replacements = (blueprint.operations ?? [])
    .filter(
      (operation): operation is ReplaceBlockOperation =>
        operation.type === 'replace' &&
        (!stepId || operation.stepId === stepId),
    )
    .map(replacementAsBlock)

  return summarizeMaterials([...blocks, ...replacements])
}

export function summarizeLayer(blocks: BlueprintBlock[], layer: number) {
  return summarizeMaterials(blocks.filter((block) => block.y === layer))
}

export function blockDisplayName(block: string) {
  return block
    .replace('minecraft:', '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
