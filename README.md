# Minecraft Building Academy

Curso interativo de construção para Minecraft Bedrock. A proposta é ensinar arquitetura e composição enquanto o jogador evolui de uma casa inicial até uma vila completa e um Nether Hub.

## Primeiro vertical slice

A primeira experiência é a **Casa Inicial**:

- Survival-first;
- blueprint reproduzível bloco a bloco;
- 13 etapas guiadas;
- mais de uma etapa dentro da mesma camada;
- modos **Learn** e **Build**;
- desafios que podem esconder a solução até a tentativa;
- visualização 3D orbitável;
- vistas de topo, frente e lateral;
- etapas anteriores em modo ghost;
- materiais por etapa e lista total;
- seleção de bloco com coordenadas e orientação;
- progresso salvo localmente;
- trilha do curso até o Nether Hub.

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
  components/       viewer 3D e componentes da experiência
  data/             blueprints e trilha do curso
  domain/           modelos de blueprint e curso
  utils/            cálculo de materiais e utilidades

docs/
  product.md
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
