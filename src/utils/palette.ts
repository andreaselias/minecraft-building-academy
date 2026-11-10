import type { Blueprint, PaletteVariant } from '../domain/blueprint'

export function applyPalette(
  blueprint: Blueprint,
  palette: PaletteVariant | undefined,
): Blueprint {
  if (!palette || Object.keys(palette.replacements).length === 0) {
    return blueprint
  }

  return {
    ...blueprint,
    blocks: blueprint.blocks.map((block) => ({
      ...block,
      block: palette.replacements[block.block] ?? block.block,
    })),
  }
}
