import type {
  Blueprint,
  BlueprintBlock,
  BlueprintOperation,
} from '../domain/blueprint'

export const BASE_BUILD_STEP_ID = '__base_build__'

function positionKey({
  x,
  y,
  z,
}: {
  x: number
  y: number
  z: number
}) {
  return x + ':' + y + ':' + z
}

function replacementBlock(
  operation: Extract<BlueprintOperation, { type: 'replace' }>,
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

export function composeBlueprint(
  baseBlueprint: Blueprint,
  extensionBlueprint: Blueprint,
  appliedStepIds: string[],
): Blueprint {
  let inheritedBlocks: BlueprintBlock[] = baseBlueprint.blocks.map((block) => ({
    ...block,
    stepId: BASE_BUILD_STEP_ID,
    materialUnits: 0,
  }))

  const generatedReplacementBlocks: BlueprintBlock[] = []
  const appliedSteps = new Set(appliedStepIds)

  for (const operation of extensionBlueprint.operations ?? []) {
    if (!appliedSteps.has(operation.stepId)) continue

    const target = positionKey(operation)
    inheritedBlocks = inheritedBlocks.filter(
      (block) => positionKey(block) !== target,
    )

    if (operation.type === 'replace') {
      generatedReplacementBlocks.push(replacementBlock(operation))
    }
  }

  return {
    ...extensionBlueprint,
    blocks: [
      ...inheritedBlocks,
      ...extensionBlueprint.blocks,
      ...generatedReplacementBlocks,
    ],
  }
}
