import type { Blueprint } from '../domain/blueprint'

const floor = Array.from({ length: 9 }, (_, z) =>
  Array.from({ length: 11 }, (_, x) => ({
    x,
    y: 0,
    z,
    block: 'minecraft:cobblestone',
  })),
).flat()

const cornerPosts = [
  [0, 1, 0], [10, 1, 0], [0, 1, 8], [10, 1, 8],
  [0, 2, 0], [10, 2, 0], [0, 2, 8], [10, 2, 8],
  [0, 3, 0], [10, 3, 0], [0, 3, 8], [10, 3, 8],
].map(([x, y, z]) => ({
  x,
  y,
  z,
  block: 'minecraft:spruce_log',
  states: { axis: 'y' as const },
}))

export const starterHouse: Blueprint = {
  id: 'starter-house-01',
  title: 'Casa Inicial',
  edition: 'bedrock',
  minimumVersion: '1.21',
  style: 'Medieval / fantasia survival',
  survivalTier: 'early',
  size: { width: 11, depth: 9, height: 8 },
  spawnReference: {
    description: 'O canto noroeste da fundação é a origem do blueprint.',
    origin: [0, 0, 0],
  },
  lessons: [
    {
      id: 'footprint',
      title: 'Comece pela massa, não pelos detalhes',
      concept: 'footprint',
      explanation: 'A fundação 11x9 cria espaço suficiente para uma casa funcional sem virar uma caixa grande demais para o início do Survival.',
      checkpoints: ['A casa precisa caber perto do spawn.', 'A forma deve permitir expansão posterior.'],
    },
    {
      id: 'depth',
      title: 'Crie profundidade desde a estrutura',
      concept: 'depth',
      explanation: 'Os pilares serão usados como elementos estruturais aparentes para evitar uma fachada completamente plana.',
    },
  ],
  materials: [
    { block: 'minecraft:cobblestone', count: 99, substitutions: ['minecraft:stone', 'minecraft:stone_bricks'] },
    { block: 'minecraft:spruce_log', count: 12, substitutions: ['minecraft:oak_log'] },
  ],
  blocks: [...floor, ...cornerPosts],
}
