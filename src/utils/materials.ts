import type { BlueprintBlock } from '../domain/blueprint'

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
