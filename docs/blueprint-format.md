# Formato de blueprint

O blueprint é o contrato entre o conteúdo do curso, o viewer e a camada didática.

## Coordenadas

Cada bloco possui coordenadas inteiras locais:

- `x`: esquerda → direita;
- `y`: altura;
- `z`: frente → fundo.

A camada física continua sendo representada por `y`, mas a navegação principal acontece por **etapas**.

## Bloco

Cada bloco pertence obrigatoriamente a uma etapa por meio de `stepId`.

```ts
{
  x: 4,
  y: 3,
  z: 1,
  block: 'minecraft:spruce_stairs',
  stepId: 'roof-03',
  states: {
    facing: 'south'
  }
}
```

Isso permite dividir uma mesma camada em intenções diferentes. Exemplo: na camada `y = 0`, a fundação de pedra pode ser uma etapa e o piso de madeira outra.

## Etapa

Uma etapa descreve **o que o jogador está tentando aprender ou executar**, não apenas a altura dos blocos.

```ts
{
  id: 'foundation-frame',
  title: 'Marque a fundação',
  layer: 0,
  kind: 'foundation',
  concept: 'footprint',
  description: 'Crie um perímetro 11x9...',
  tip: 'Acerte a massa antes dos detalhes.',
  challenge: {
    prompt: 'Tente marcar o footprint antes de revelar.',
    hint: 'Comece pelos quatro cantos.',
    reflection: 'O footprint controla escala e proporção.'
  }
}
```

## Desafios do modo Learn

`challenge` é opcional.

Quando existe:

1. o viewer pode esconder os blocos da etapa atual;
2. o usuário tenta resolver o problema;
3. a dica pode ser revelada sem mostrar a solução;
4. a solução libera os blocos;
5. `reflection` explica o princípio observado.

O modo Build ignora esse bloqueio e mostra a etapa imediatamente.

## Estados

O modelo usa estados normalizados para a aplicação:

- `facing`: north, south, east ou west;
- `axis`: x, y ou z;
- `half`: top ou bottom;
- `upsideDown`;
- estados adicionais podem ser adicionados por bloco.

Nesta fase esses estados servem ao renderer. Uma futura camada de exportação fará a conversão para os estados nativos da versão Bedrock alvo.

## Contagem de materiais

Por padrão, cada posição do blueprint consome uma unidade do material.

`materialUnits` permite corrigir blocos que ocupam mais de uma posição no mundo, mas consomem apenas um item. Exemplo: uma porta ocupa dois blocos de altura; a metade inferior usa `materialUnits: 1` e a superior `materialUnits: 0`.

A mesma função de cálculo é usada para:

- lista total;
- lista da etapa atual;
- futuramente, materiais restantes.

## Substituições

Cada construção pode declarar alternativas de paleta. Isso permite preservar a forma da build quando o jogador ainda não encontrou o bioma/material ideal.

## Próximas extensões

- grupos estruturais e decorativos;
- variantes de paleta selecionáveis;
- dependências entre capítulos;
- exportação para formatos de estrutura;
- validação automática contra a versão Bedrock alvo;
- importação de estruturas para acelerar a autoria de novos blueprints.
