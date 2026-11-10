import type {
  Blueprint,
  BlueprintBlock,
  BlockState,
  BuildStep,
} from '../domain/blueprint'

const blocks: BlueprintBlock[] = []

function add(
  stepId: string,
  x: number,
  y: number,
  z: number,
  block: string,
  states?: BlockState,
  materialUnits?: number,
) {
  blocks.push({ x, y, z, block, stepId, states, materialUnits })
}

const steps: BuildStep[] = [
  {
    id: 'foundation-frame',
    title: 'Marque a fundação',
    description: 'Crie um perímetro 11x9 de cobblestone. Esta moldura define a escala da casa antes de qualquer detalhe.',
    layer: 0,
    kind: 'foundation',
    concept: 'footprint',
    tip: 'Conte os cantos duas vezes ao medir: 11 blocos de largura por 9 de profundidade.',
    challenge: {
      prompt: 'Sem revelar a solução, marque no terreno um retângulo 11x9 e escolha onde deixaria a entrada principal.',
      hint: 'Uma casa inicial funciona melhor quando a porta fica centralizada em uma das faces curtas.',
      reflection: 'O footprint precisa ser grande o bastante para ser funcional, mas pequeno o bastante para terminar cedo no Survival.',
    },
  },
  {
    id: 'foundation-floor',
    title: 'Preencha o piso',
    description: 'Complete o interior da fundação com spruce planks. O contraste entre pedra e madeira já cria uma leitura de base + estrutura.',
    layer: 0,
    kind: 'foundation',
    concept: 'material hierarchy',
    tip: 'Se ainda não encontrou spruce, use oak e troque depois. A forma importa mais que a paleta nesta etapa.',
  },
  {
    id: 'walls-base',
    title: 'Primeira faixa das paredes',
    description: 'Suba os pilares estruturais e feche a primeira faixa das paredes. Instale também a metade inferior da porta.',
    layer: 1,
    kind: 'structure',
    concept: 'rhythm',
    tip: 'Observe que os pilares quebram as paredes longas em módulos. Isso evita a sensação de uma caixa lisa.',
    challenge: {
      prompt: 'Antes de revelar, tente decidir onde colocaria pilares verticais para quebrar as fachadas em módulos menores.',
      hint: 'Priorize cantos, centro das paredes longas e pontos próximos da entrada.',
      reflection: 'Estrutura aparente cria ritmo antes mesmo de adicionarmos decoração.',
    },
  },
  {
    id: 'walls-windows',
    title: 'Faixa das janelas',
    description: 'Continue os pilares e abra janelas na altura dos olhos. A porta recebe sua metade superior.',
    layer: 2,
    kind: 'shell',
    concept: 'negative space',
    tip: 'Evite janelas perfeitamente repetidas em todas as faces. Pequena assimetria deixa a construção menos artificial.',
  },
  {
    id: 'walls-top',
    title: 'Feche as paredes',
    description: 'Complete a terceira faixa das paredes mantendo os pilares contínuos.',
    layer: 3,
    kind: 'shell',
    concept: 'proportion',
    tip: 'Três blocos de parede útil deixam o interior confortável sem achatar o telhado.',
  },
  {
    id: 'ring-beam',
    title: 'Faça a cinta estrutural',
    description: 'Use logs horizontais em todo o perímetro para separar visualmente paredes e telhado.',
    layer: 4,
    kind: 'structure',
    concept: 'horizontal break',
    tip: 'Essa linha horizontal funciona como uma cornija simples e dá uma sombra forte na fachada.',
  },
  {
    id: 'roof-01',
    title: 'Comece o beiral',
    description: 'Inicie o telhado um bloco para fora da parede e monte a primeira linha dos frontões.',
    layer: 5,
    kind: 'roof',
    concept: 'depth',
    tip: 'O beiral é uma das formas mais baratas de criar profundidade real.',
    challenge: {
      prompt: 'Onde você começaria o telhado para que ele não fique colado na parede?',
      hint: 'Projete a primeira linha um bloco para fora em todas as extremidades.',
      reflection: 'Profundidade física costuma funcionar melhor do que tentar decorar uma parede totalmente plana.',
    },
  },
  {
    id: 'roof-02',
    title: 'Segunda faixa do telhado',
    description: 'Suba um bloco e recue um bloco. Continue o frontão acompanhando a inclinação.',
    layer: 6,
    kind: 'roof',
    concept: 'slope',
    tip: 'A repetição subir 1 / recuar 1 produz uma inclinação legível e fácil de reproduzir.',
  },
  {
    id: 'roof-03',
    title: 'Janela do frontão',
    description: 'Continue a inclinação e preserve a janela vertical no frontão frontal.',
    layer: 7,
    kind: 'roof',
    concept: 'focal point',
    tip: 'Uma abertura pequena perto do topo ajuda a quebrar uma massa grande de madeira.',
  },
  {
    id: 'roof-04',
    title: 'Afine a silhueta',
    description: 'Continue fechando o frontão e aproximando as duas águas do telhado.',
    layer: 8,
    kind: 'roof',
    concept: 'silhouette',
    tip: 'Avalie a casa de longe. Nesta altura, a silhueta já deve parecer mais alta do que larga.',
  },
  {
    id: 'roof-05',
    title: 'Última faixa inclinada',
    description: 'Faça a última linha de stairs antes da cumeeira.',
    layer: 9,
    kind: 'roof',
    concept: 'silhouette',
    tip: 'Não compense uma silhueta fraca com detalhes. Acerte a massa primeiro.',
  },
  {
    id: 'roof-ridge',
    title: 'Feche a cumeeira',
    description: 'Una as duas águas com spruce slabs ao longo de todo o comprimento.',
    layer: 10,
    kind: 'roof',
    concept: 'finish',
    tip: 'Slabs deixam a cumeeira menos pesada do que uma linha inteira de blocos.',
  },
  {
    id: 'starter-interior',
    title: 'Interior mínimo funcional',
    description: 'Adicione crafting table, furnace, chest e cama. A casa agora funciona como base dos primeiros dias.',
    layer: 1,
    kind: 'interior',
    concept: 'function before decoration',
    tip: 'Deixe espaço livre para circulação. Decoração vem depois que a base já funciona.',
    challenge: {
      prompt: 'Tente organizar cama, baú, crafting table e furnace sem bloquear a circulação entre a porta e o centro da casa.',
      hint: 'Encoste utilidades nas paredes e preserve um corredor central.',
      reflection: 'Interiores melhores normalmente começam por circulação e função, não por decoração.',
    },
  },
]

// Foundation: stone frame, then wooden floor.
for (let x = 0; x <= 10; x += 1) {
  for (let z = 0; z <= 8; z += 1) {
    const perimeter = x === 0 || x === 10 || z === 0 || z === 8
    add(
      perimeter ? 'foundation-frame' : 'foundation-floor',
      x,
      0,
      z,
      perimeter ? 'minecraft:cobblestone' : 'minecraft:spruce_planks',
    )
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

const wallStepByLayer: Record<number, string> = {
  1: 'walls-base',
  2: 'walls-windows',
  3: 'walls-top',
}

for (let y = 1; y <= 3; y += 1) {
  for (let x = 0; x <= 10; x += 1) {
    for (let z = 0; z <= 8; z += 1) {
      const perimeter = x === 0 || x === 10 || z === 0 || z === 8
      if (!perimeter) continue

      const key = x + ',' + z
      const isDoor = x === 0 && z === 4 && (y === 1 || y === 2)
      if (isDoor) continue

      const stepId = wallStepByLayer[y]

      if (supports.has(key)) {
        add(stepId, x, y, z, 'minecraft:spruce_log', { axis: 'y' })
      } else if (y === 2 && windows.has(key)) {
        add(stepId, x, y, z, 'minecraft:glass_pane')
      } else {
        add(stepId, x, y, z, 'minecraft:spruce_planks')
      }
    }
  }
}

add('walls-base', 0, 1, 4, 'minecraft:spruce_door', { facing: 'west', half: 'bottom' }, 1)
add('walls-windows', 0, 2, 4, 'minecraft:spruce_door', { facing: 'west', half: 'top' }, 0)

// Structural ring beam.
for (let x = 0; x <= 10; x += 1) {
  add('ring-beam', x, 4, 0, 'minecraft:spruce_log', { axis: 'x' })
  add('ring-beam', x, 4, 8, 'minecraft:spruce_log', { axis: 'x' })
}
for (let z = 1; z <= 7; z += 1) {
  add('ring-beam', 0, 4, z, 'minecraft:spruce_log', { axis: 'z' })
  add('ring-beam', 10, 4, z, 'minecraft:spruce_log', { axis: 'z' })
}

const roofStepByY: Record<number, string> = {
  5: 'roof-01',
  6: 'roof-02',
  7: 'roof-03',
  8: 'roof-04',
  9: 'roof-05',
}

const gableRows = [
  { y: 5, minZ: 0, maxZ: 8 },
  { y: 6, minZ: 1, maxZ: 7 },
  { y: 7, minZ: 2, maxZ: 6 },
  { y: 8, minZ: 3, maxZ: 5 },
  { y: 9, minZ: 4, maxZ: 4 },
]

for (const row of gableRows) {
  const stepId = roofStepByY[row.y]

  for (const x of [0, 10]) {
    for (let z = row.minZ; z <= row.maxZ; z += 1) {
      const frontWindow = x === 0 && z === 4 && (row.y === 6 || row.y === 7)
      add(stepId, x, row.y, z, frontWindow ? 'minecraft:glass_pane' : 'minecraft:spruce_planks')
    }
  }
}

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
    add(roofStepByY[row.y], x, row.y, row.z, 'minecraft:spruce_stairs', { facing: 'south' })
  }
  for (const row of southRoof) {
    add(roofStepByY[row.y], x, row.y, row.z, 'minecraft:spruce_stairs', { facing: 'north' })
  }
  add('roof-ridge', x, 10, 4, 'minecraft:spruce_slab', { half: 'bottom' })
}

// Minimal functional interior.
add('starter-interior', 2, 1, 2, 'minecraft:crafting_table')
add('starter-interior', 2, 1, 3, 'minecraft:furnace')
add('starter-interior', 8, 1, 2, 'minecraft:chest', { facing: 'west' })
add('starter-interior', 7, 1, 6, 'minecraft:red_bed', { facing: 'west', part: 'foot' }, 1)
add('starter-interior', 8, 1, 6, 'minecraft:red_bed', { facing: 'west', part: 'head' }, 0)

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
  steps,
  materialSubstitutions: {
    'minecraft:spruce_log': ['minecraft:oak_log', 'minecraft:dark_oak_log'],
    'minecraft:spruce_planks': ['minecraft:oak_planks', 'minecraft:dark_oak_planks'],
    'minecraft:spruce_stairs': ['minecraft:oak_stairs', 'minecraft:dark_oak_stairs'],
    'minecraft:spruce_slab': ['minecraft:oak_slab', 'minecraft:dark_oak_slab'],
    'minecraft:spruce_door': ['minecraft:oak_door', 'minecraft:dark_oak_door'],
  },
  blocks,
}
