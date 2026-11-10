import type {
  Blueprint,
  BlueprintOperation,
  PaletteVariant,
} from '../domain/blueprint'

function applyPaletteToOperation(
  operation: BlueprintOperation,
  palette: PaletteVariant,
): BlueprintOperation {
  if (operation.type === 'remove') {
    return operation
  }

  return {
    ...operation,
    block: palette.replacements[operation.block] ?? operation.block,
  }
}

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
    operations: blueprint.operations?.map((operation) =>
      applyPaletteToOperation(operation, palette),
    ),
  }
}
