import type { Blueprint } from '../domain/blueprint'

export const BASE_BUILD_STEP_ID = '__base_build__'

export function composeBlueprint(
  baseBlueprint: Blueprint,
  extensionBlueprint: Blueprint,
): Blueprint {
  return {
    ...extensionBlueprint,
    blocks: [
      ...baseBlueprint.blocks.map((block) => ({
        ...block,
        stepId: BASE_BUILD_STEP_ID,
        materialUnits: 0,
      })),
      ...extensionBlueprint.blocks,
    ],
  }
}
