import type { Blueprint, BlueprintBlock, BlockState } from '../domain/blueprint'

const blocks: BlueprintBlock[] = []

function add(
  x: number,
  y: number,
  z: number,
  block: string,
  states?: BlockState,
  materialUnits?: number,
) {
  blocks.push({ x, y, z, block, states, materialUnits })
}

// Foundation: stone perimeter with a wooden floor.
for (let x = 0; x <= 10; x += 1) {
  for (let z = 0; z <= 8; z += 1) {
    const perimeter = x === 0 || x === 10 || z === 0 || z === 8
    add(x, 0, z, perimeter ? 'minecraft:cobblestone' : 'minecraft:spruce_planks')
  }
}

const supports = new Set([
  '0,0', '0,3', '0,5', '0,8',
  '10,0', '10,4', '10,8',
  '5,0', '5,8',
])

const windows = new Set([
  '0,1', '0,7',
  '10,2', '10,6',
  '2,0', '8,0',
  '2,8', '8,8',
])

// Walls: visible structural posts, infill and windows.
for (let y = 1; y <= 3; y += 1) {
  for (let x = 0; x <= 10; x += 1) {
    for (let z = 0; z <= 8; z += 1) {
      const perimeter = x === 0 || x === 10 || z === 0 || z === 8
      if (!perimeter) continue

      const key = x + ',' + z
      const isDoor = x === 0 && z === 4 && (y === 1 || y === 2)

      if (isDoor) continue

      if (supports.has(key)) {
        add(x, y, z, 'minecraft:spruce_log', { axis: 'y' })
      } else if (y === 2 && windows.has(key)) {
        add(x, y, z, 'minecraft:glass_pane')
      } else {
        add(x, y, z, 'minecraft:spruce_planks')
      }
    }
  }
}

// Door uses two world blocks but only one inventory item.
add(0, 1, 4, 'minecraft:spruce_door', { facing: 'west', half: 'bottom' }, 1)
add(0, 2, 4, 'minecraft:spruce_door', { facing: 'west', half: 'top' }, 0)

// Structural ring beam.
for (let x = 0; x <= 10; x += 1) {
  add(x, 4, 0, 'minecraft:spruce_log', { axis: 'x' })
  add(x, 4, 8, 'minecraft:spruce_log', { axis: 'x' })
}
for (let z = 1; z <= 7; z += 1) {
  add(0, 4, z, 'minecraft:spruce_log', { axis: 'z' })
  add(10, 4, z, 'minecraft:spruce_log', { axis: 'z' })
}

// Gable infill. The front gets a two-block vertical window.
const gableRows = [
  { y: 5, minZ: 0, maxZ: 8 },
  { y: 6, minZ: 1, maxZ: 7 },
  { y: 7, minZ: 2, maxZ: 6 },
  { y: 8, minZ: 3, maxZ: 5 },
  { y: 9, minZ: 4, maxZ: 4 },
]

for (const row of gableRows) {
  for (const x of [0, 10]) {
    for (let z = row.minZ; z <= row.maxZ; z += 1) {
      const frontWindow = x === 0 && z === 4 && (row.y === 6 || row.y === 7)
      add(x, row.y, z, frontWindow ? 'minecraft:glass_pane' : 'minecraft:spruce_planks')
    }
  }
}

// Steep roof with one-block eaves on every side.
const northRoof = [
  { z: -1, y: 5 },
  { z: 0, y: 6 },
  { z: 1, y: 7 },
  { z: 2, y: 8 },
  { z: 3, y: 9 },
]
const southRoof = [
  { z: 9, y: 5 },
  { z: 8, y: 6 },
  { z: 7, y: 7 },
  { z: 6, y: 8 },
  { z: 5, y: 9 },
]

for (let x = -1; x <= 11; x += 1) {
  for (const row of northRoof) {
    add(x, row.y, row.z, 'minecraft:spruce_stairs', { facing: 'south' })
  }
  for (const row of southRoof) {
    add(x, row.y, row.z, 'minecraft:spruce_stairs', { facing: 'north' })
  }
  add(x, 10, 4, 'minecraft:spruce_slab', { half: 'bottom' })
}

// Minimal functional interior for the first nights.
add(2, 1, 2, 'minecraft:crafting_table')
add(2, 1, 3, 'minecraft:furnace')
add(8, 1, 2, 'minecraft:chest', { facing: 'west' })
add(7, 1, 6, 'minecraft:red_bed', { facing: 'west', part: 'foot' }, 1)
add(8, 1, 6, 'minecraft:red_bed', { facing: 'west', part: 'head' }, 0)

export const starterHouse: Blueprint = {
  id: 'starter-house-01',
  title: 'Casa Inicial',
  edition: 'bedrock',
  minimumVersion: '1.21',
  style: 'Medieval / fantasia survival',
  survivalTier: 'early',
  size: {
    width: 11,
    depth: 9,
    height: 11,
  },
  spawnReference: {
    description: 'Considere o canto frontal esquerdo da fundação como a origem (0, 0, 0).',
    origin: [0, 0, 0],
  },
  lessons: [
    {
      id: 'footprint',
      title: 'Comece pela massa, não pelos detalhes',
      concept: 'footprint',
      explanation:
        'O footprint 11x9 cria uma casa compacta, funcional e fácil de expandir sem cair no formato de uma caixa grande.',
    },
    {
      id: 'structure',
      title: 'Mostre a estrutura',
      concept: 'rhythm',
      explanation:
        'Os pilares e a cinta superior dividem paredes longas em módulos menores e dão ritmo visual à fachada.',
    },
    {
      id: 'depth',
      title: 'Use profundidade antes de decoração',
      concept: 'depth',
      explanation:
        'Telhado com beiral, pilares aparentes e janelas interrompem superfícies planas sem depender de dezenas de blocos decorativos.',
    },
    {
      id: 'roof',
      title: 'O telhado define a silhueta',
      concept: 'silhouette',
      explanation:
        'Um telhado mais alto que o habitual cria uma silhueta medieval clara. O beiral protege visualmente as paredes e dá sombra.',
    },
  ],
  layerNotes: {
    0: 'Marque primeiro o retângulo 11x9. Pedra no perímetro, madeira por dentro.',
    1: 'Suba os pilares, feche a primeira faixa das paredes e instale a parte inferior da porta.',
    2: 'Esta é a camada das janelas. Mantenha os pilares contínuos para preservar o ritmo estrutural.',
    3: 'Feche as paredes antes do telhado. Evite adicionar decoração ainda.',
    4: 'Faça a cinta estrutural horizontal. Ela separa visualmente parede e telhado.',
    5: 'Comece o beiral e a base dos dois frontões.',
    6: 'A segunda faixa do telhado avança um bloco para dentro e um para cima.',
    7: 'Continue o padrão. O frontão frontal recebe a janela vertical.',
    8: 'A silhueta começa a afunilar rapidamente.',
    9: 'Última faixa inclinada antes da cumeeira.',
    10: 'Feche a cumeeira com slabs. Depois disso a estrutura principal está concluída.',
  },
  materialSubstitutions: {
    'minecraft:spruce_log': ['minecraft:oak_log', 'minecraft:dark_oak_log'],
    'minecraft:spruce_planks': ['minecraft:oak_planks', 'minecraft:dark_oak_planks'],
    'minecraft:spruce_stairs': ['minecraft:oak_stairs', 'minecraft:dark_oak_stairs'],
    'minecraft:spruce_slab': ['minecraft:oak_slab', 'minecraft:dark_oak_slab'],
    'minecraft:spruce_door': ['minecraft:oak_door', 'minecraft:dark_oak_door'],
  },
  blocks,
}
