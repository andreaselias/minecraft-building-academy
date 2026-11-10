# Minecraft Building Academy

Curso interativo de construção para Minecraft Bedrock. A proposta é ensinar arquitetura e composição enquanto o jogador evolui de uma casa inicial até uma vila completa e um Nether Hub.

## Primeiro vertical slice

A primeira experiência é a **Casa Inicial**:

- Survival-first;
- blueprint reproduzível bloco a bloco;
- navegação por camada;
- visualização 3D orbitável;
- vistas de topo, frente e lateral;
- camadas anteriores em modo ghost;
- materiais por camada e lista total;
- progresso salvo localmente;
- explicações sobre footprint, ritmo estrutural, profundidade e silhueta.

## Stack

- React 19
- TypeScript
- Vite
- MUI
- Three.js
- React Three Fiber / Drei

## Rodando localmente

```bash
npm install
npm run dev
```

Para validar a build de produção:

```bash
npm run build
```

## Estrutura

```text
src/
  components/       viewer 3D e representação dos blocos
  data/             blueprints do curso
  domain/           modelo de domínio
  utils/            cálculo de materiais e utilidades

docs/
  product.md        visão do produto e progressão do curso
  blueprint-format.md
```

## Progressão planejada

1. Casa inicial
2. Upgrade da casa
3. Oficina e depósito
4. Fazenda e celeiro
5. Caminhos e paisagismo
6. Base principal
7. Casas de aldeões
8. Ferreiro
9. Centro da vila
10. Variações residenciais
11. Landmark / torre
12. Muralha e portão
13. Construção do portal
14. Nether Hub

## Filosofia

O produto não deve ser apenas uma coleção de construções para copiar. Cada projeto precisa ensinar princípios reaproveitáveis para que, ao longo do curso, o jogador dependa cada vez menos do blueprint.
