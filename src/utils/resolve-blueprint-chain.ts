import type { Blueprint, PaletteVariant } from '../domain/blueprint'
import { composeBlueprint } from './compose-blueprint'
import { applyPalette } from './palette'

function paletteFor(
  blueprint: Blueprint,
  paletteId: string,
): PaletteVariant | undefined {
  return (
    blueprint.palettes?.find((palette) => palette.id === paletteId) ??
    blueprint.palettes?.[0]
  )
}

export function composeCompletedBaseChain(
  registry: Record<string, Blueprint>,
  blueprint: Blueprint,
  paletteId: string,
): Blueprint | undefined {
  if (!blueprint.baseBlueprintId) return undefined

  const directBase = registry[blueprint.baseBlueprintId]
  if (!directBase) return undefined

  const effectiveDirectBase = applyPalette(
    directBase,
    paletteFor(directBase, paletteId),
  )

  const ancestorBase = composeCompletedBaseChain(
    registry,
    directBase,
    paletteId,
  )

  if (!ancestorBase) {
    return effectiveDirectBase
  }

  return composeBlueprint(
    ancestorBase,
    effectiveDirectBase,
    effectiveDirectBase.steps.map((step) => step.id),
  )
}
