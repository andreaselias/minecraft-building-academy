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
    id: 'arrival-path',
    title: 'Crie uma chegada',
    description:
      'Estenda um pequeno caminho de cobblestone em frente à porta. O objetivo é fazer a construção começar antes da parede.',
    layer: 0,
    kind: 'detail',
    concept: 'arrival sequence',
    tip: 'Uma construção parece mais integrada quando o terreno conduz o jogador até a entrada.',
    challenge: {
      prompt:
        'Antes de revelar, escolha de onde o jogador deve enxergar a porta pela primeira vez e marque um eixo simples de chegada.',
      hint: 'A porta está no centro da fachada curta. Comece alinhando o caminho com ela.',
      reflection:
        'Arquitetura no Minecraft também é percurso: caminho, varanda e porta formam uma sequência.',
    },
  },
  {
    id: 'porch-deck',
    title: 'Adicione a varanda',
    description:
      'Projete um pequeno deck de madeira dois blocos para fora da fachada principal.',
    layer: 0,
    kind: 'foundation',
    concept: 'depth',
    tip: 'A varanda cria profundidade sem aumentar muito a área interna da casa.',
  },
  {
    id: 'porch-posts-01',
    title: 'Suba os postes da varanda',
    description:
      'Comece dois postes simétricos na borda externa do deck.',
    layer: 1,
    kind: 'structure',
    concept: 'framing',
    tip: 'Os postes funcionam como uma moldura para a entrada.',
  },
  {
    id: 'porch-posts-02',
    title: 'Continue a moldura',
    description:
      'Suba a segunda faixa dos postes preservando a abertura central.',
    layer: 2,
    kind: 'structure',
    concept: 'framing',
  },
  {
    id: 'porch-posts-03',
    title: 'Finalize os postes',
    description:
      'Complete a altura dos dois postes antes de adicionar a cobertura.',
    layer: 3,
    kind: 'structure',
    concept: 'proportion',
  },
  {
    id: 'window-eyebrows',
    title: 'Dê sombra às janelas',
    description:
      'Adicione pequenas abas de madeira sobre as duas janelas frontais.',
    layer: 3,
    kind: 'detail',
    concept: 'micro depth',
    tip: 'Um único slab projetado para fora já cria uma sombra que faz a janela parecer encaixada na fachada.',
  },
  {
    id: 'porch-canopy',
    title: 'Cubra a entrada',
    description:
      'Faça uma cobertura baixa sobre a varanda para criar um segundo plano antes do telhado principal.',
    layer: 4,
    kind: 'roof',
    concept: 'layering',
    tip: 'O telhado principal continua dominante; a cobertura da varanda é um volume secundário.',
  },
  {
    id: 'woodshed-floor',
    title: 'Quebre a simetria com um anexo',
    description:
      'Adicione um pequeno piso lateral para lenha e materiais de uso frequente.',
    layer: 0,
    kind: 'foundation',
    concept: 'controlled asymmetry',
    challenge: {
      prompt:
        'Qual lado da casa você deixaria visualmente mais pesado para evitar que todas as fachadas pareçam perfeitamente simétricas?',
      hint: 'Um único volume lateral pequeno é suficiente para alterar a composição.',
      reflection:
        'Assimetria controlada deixa a construção mais orgânica sem perder a linguagem visual.',
    },
  },
  {
    id: 'woodshed-posts-01',
    title: 'Estruture o anexo',
    description:
      'Suba os postes externos do pequeno depósito lateral.',
    layer: 1,
    kind: 'structure',
    concept: 'secondary volume',
  },
  {
    id: 'woodshed-posts-02',
    title: 'Continue o anexo',
    description:
      'Complete a segunda faixa dos postes e mantenha o espaço aberto.',
    layer: 2,
    kind: 'structure',
    concept: 'secondary volume',
  },
  {
    id: 'woodshed-posts-03',
    title: 'Feche a altura do anexo',
    description:
      'Finalize os postes do volume lateral sem competir com a altura da casa.',
    layer: 3,
    kind: 'structure',
    concept: 'hierarchy',
  },
  {
    id: 'woodshed-roof',
    title: 'Adicione a cobertura lateral',
    description:
      'Cubra o anexo com slabs para manter sua silhueta mais baixa que a construção principal.',
    layer: 4,
    kind: 'roof',
    concept: 'hierarchy',
    tip: 'Volumes secundários ficam mais convincentes quando têm telhado mais baixo e forma mais simples.',
  },
]

// Arrival path aligned with the front door (front of house is x = 0).
for (let x = -6; x <= -3; x += 1) {
  add('arrival-path', x, 0, 4, 'minecraft:cobblestone')
}

// Two-block-deep porch centered on the door.
for (let x = -2; x <= -1; x += 1) {
  for (let z = 3; z <= 5; z += 1) {
    add('porch-deck', x, 0, z, 'minecraft:spruce_planks')
  }
}

// Porch posts.
for (const y of [1, 2, 3]) {
  const stepId = 'porch-posts-0' + y
  add(stepId, -2, y, 3, 'minecraft:spruce_log', { axis: 'y' })
  add(stepId, -2, y, 5, 'minecraft:spruce_log', { axis: 'y' })
}

// Small eyebrows over front windows.
add('window-eyebrows', -1, 3, 1, 'minecraft:spruce_slab', { half: 'bottom' })
add('window-eyebrows', -1, 3, 7, 'minecraft:spruce_slab', { half: 'bottom' })

// Flat secondary canopy over the porch.
for (let x = -3; x <= -1; x += 1) {
  for (let z = 2; z <= 6; z += 1) {
    add('porch-canopy', x, 4, z, 'minecraft:spruce_slab', { half: 'bottom' })
  }
}

// Open-sided woodshed on one side of the house.
for (let x = 6; x <= 9; x += 1) {
  for (let z = 9; z <= 11; z += 1) {
    add('woodshed-floor', x, 0, z, 'minecraft:spruce_planks')
  }
}

for (const y of [1, 2, 3]) {
  const stepId = 'woodshed-posts-0' + y
  for (const x of [6, 9]) {
    add(stepId, x, y, 11, 'minecraft:spruce_log', { axis: 'y' })
  }
}

for (let x = 5; x <= 10; x += 1) {
  for (let z = 9; z <= 12; z += 1) {
    add('woodshed-roof', x, 4, z, 'minecraft:spruce_slab', { half: 'bottom' })
  }
}

export const houseUpgrade: Blueprint = {
  id: 'house-upgrade-01',
  title: 'Upgrade da Casa Inicial',
  baseBlueprintId: 'starter-house-01',
  edition: 'bedrock',
  minimumVersion: '1.21',
  targetVersion: '26.60',
  style: 'Medieval / fantasia survival',
  survivalTier: 'early',
  size: {
    width: 18,
    depth: 14,
    height: 11,
  },
  spawnReference: {
    description:
      'Use a Casa Inicial pronta como referência. As coordenadas permanecem no mesmo sistema do capítulo anterior.',
    origin: [0, 0, 0],
  },
  lessons: [
    {
      id: 'arrival',
      title: 'A construção começa no caminho',
      concept: 'arrival sequence',
      explanation:
        'Caminho, varanda e porta passam a formar uma sequência visual em vez de uma parede com uma abertura.',
    },
    {
      id: 'asymmetry',
      title: 'Assimetria controlada',
      concept: 'composition',
      explanation:
        'Um anexo em apenas um lado muda a massa da casa sem destruir sua linguagem original.',
    },
    {
      id: 'hierarchy',
      title: 'Volumes têm hierarquia',
      concept: 'hierarchy',
      explanation:
        'A casa continua sendo o volume principal; varanda e depósito ficam menores e mais baixos.',
    },
  ],
  steps,
  palettes: [
    {
      id: 'spruce',
      title: 'Spruce',
      description: 'Mantém a paleta original da Casa Inicial.',
      replacements: {},
    },
    {
      id: 'oak',
      title: 'Oak',
      description: 'Mantém o mesmo upgrade usando a alternativa de early game.',
      replacements: {
        'minecraft:spruce_log': 'minecraft:oak_log',
        'minecraft:spruce_planks': 'minecraft:oak_planks',
        'minecraft:spruce_slab': 'minecraft:oak_slab',
      },
    },
  ],
  materialSubstitutions: {
    'minecraft:spruce_log': ['minecraft:oak_log'],
    'minecraft:spruce_planks': ['minecraft:oak_planks'],
    'minecraft:spruce_slab': ['minecraft:oak_slab'],
  },
  blocks,
}
