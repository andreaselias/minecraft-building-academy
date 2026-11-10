import { Edges } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { BlueprintBlock, BlockFacing } from '../domain/blueprint'

interface BlockMeshProps {
  block: BlueprintBlock
  position: [number, number, number]
  ghost?: boolean
  selected?: boolean
  onSelect?: (block: BlueprintBlock) => void
}

const blockColors: Record<string, string> = {
  'minecraft:cobblestone': '#77756f',
  'minecraft:spruce_log': '#5b3a24',
  'minecraft:spruce_planks': '#8a5d35',
  'minecraft:spruce_stairs': '#7c4f2d',
  'minecraft:spruce_slab': '#7c4f2d',
  'minecraft:spruce_door': '#6d4428',
  'minecraft:oak_log': '#80603d',
  'minecraft:oak_planks': '#b18a55',
  'minecraft:oak_stairs': '#a77d49',
  'minecraft:oak_slab': '#a77d49',
  'minecraft:oak_door': '#9a713f',
  'minecraft:glass_pane': '#b9e1e6',
  'minecraft:crafting_table': '#8b5a2b',
  'minecraft:furnace': '#6f6f6f',
  'minecraft:chest': '#a66a2d',
  'minecraft:red_bed': '#a73b35',
}

function colorFor(block: string) {
  return blockColors[block] ?? '#9a8f7a'
}

function upperStepOffset(facing: BlockFacing | undefined): [number, number, number] {
  switch (facing) {
    case 'north':
      return [0, 0.25, -0.25]
    case 'south':
      return [0, 0.25, 0.25]
    case 'east':
      return [0.25, 0.25, 0]
    case 'west':
      return [-0.25, 0.25, 0]
    default:
      return [0, 0.25, 0.25]
  }
}

function BoxPart({
  size,
  offset = [0, 0, 0],
  color,
  opacity,
  edges,
  edgeColor,
}: {
  size: [number, number, number]
  offset?: [number, number, number]
  color: string
  opacity: number
  edges: boolean
  edgeColor: string
}) {
  const transparent = opacity < 1

  return (
    <mesh position={offset} castShadow={!transparent} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent={transparent}
        opacity={opacity}
        depthWrite={!transparent}
        roughness={0.9}
      />
      {edges && <Edges threshold={15} color={edgeColor} />}
    </mesh>
  )
}

export function BlockMesh({
  block,
  position,
  ghost = false,
  selected = false,
  onSelect,
}: BlockMeshProps) {
  const color = colorFor(block.block)
  const isGlass = block.block.includes('glass')
  const opacity = ghost ? 0.13 : isGlass ? 0.42 : 1
  const edges = !ghost
  const edgeColor = selected ? '#ffffff' : '#151515'

  function handleClick(event: ThreeEvent<MouseEvent>) {
    if (!onSelect) return
    event.stopPropagation()
    onSelect(block)
  }

  if (block.block.endsWith('_stairs')) {
    const upsideDown = block.states?.upsideDown === true
    const baseY = upsideDown ? 0.25 : -0.25
    const [stepX, , stepZ] = upperStepOffset(block.states?.facing)
    const stepY = upsideDown ? -0.25 : 0.25
    const northSouth = block.states?.facing === 'north' || block.states?.facing === 'south'

    return (
      <group position={position} onClick={handleClick}>
        <BoxPart size={[1, 0.5, 1]} offset={[0, baseY, 0]} color={color} opacity={opacity} edges={edges} edgeColor={edgeColor} />
        <BoxPart
          size={northSouth ? [1, 0.5, 0.5] : [0.5, 0.5, 1]}
          offset={[stepX, stepY, stepZ]}
          color={color}
          opacity={opacity}
          edges={edges}
          edgeColor={edgeColor}
        />
      </group>
    )
  }

  if (block.block.endsWith('_slab')) {
    const top = block.states?.half === 'top'
    return (
      <group position={position} onClick={handleClick}>
        <BoxPart
          size={[1, 0.5, 1]}
          offset={[0, top ? 0.25 : -0.25, 0]}
          color={color}
          opacity={opacity}
          edges={edges}
          edgeColor={edgeColor}
        />
      </group>
    )
  }

  if (block.block.endsWith('_door')) {
    const facing = block.states?.facing
    const alongX = facing === 'north' || facing === 'south'
    return (
      <group position={position} onClick={handleClick}>
        <BoxPart
          size={alongX ? [0.9, 1, 0.12] : [0.12, 1, 0.9]}
          color={color}
          opacity={opacity}
          edges={edges}
          edgeColor={edgeColor}
        />
      </group>
    )
  }

  if (block.block.includes('glass_pane')) {
    return (
      <group position={position} onClick={handleClick}>
        <BoxPart size={[0.12, 1, 0.9]} color={color} opacity={opacity} edges={edges} edgeColor={edgeColor} />
        <BoxPart size={[0.9, 1, 0.12]} color={color} opacity={opacity} edges={edges} edgeColor={edgeColor} />
      </group>
    )
  }

  if (block.block.endsWith('_bed')) {
    return (
      <group position={position} onClick={handleClick}>
        <BoxPart size={[0.95, 0.55, 0.95]} offset={[0, -0.225, 0]} color={color} opacity={opacity} edges={edges} edgeColor={edgeColor} />
      </group>
    )
  }

  return (
    <group position={position} onClick={handleClick}>
      <BoxPart size={[0.96, 0.96, 0.96]} color={color} opacity={opacity} edges={edges} edgeColor={edgeColor} />
    </group>
  )
}
