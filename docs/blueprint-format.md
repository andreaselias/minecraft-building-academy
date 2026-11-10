# Formato de blueprint

O blueprint é o contrato entre o conteúdo do curso e o viewer.

## Coordenadas

Cada bloco possui coordenadas inteiras locais:

- `x`: esquerda → direita;
- `y`: altura;
- `z`: frente → fundo.

A camada exibida na interface corresponde ao valor de `y`.

## Exemplo

```ts
{
  x: 4,
  y: 3,
  z: 1,
  block: 'minecraft:spruce_stairs',
  states: {
    facing: 'south'
  }
}
```

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

## Substituições

Cada construção pode declarar alternativas de paleta. Isso permite preservar a forma da build quando o jogador ainda não encontrou o bioma/material ideal.

## Próximas extensões

O formato será expandido para suportar:

- passos dentro de uma mesma camada;
- grupos estruturais e decorativos;
- dependências entre etapas;
- variantes de paleta;
- exportação para formatos de estrutura;
- validação automática contra a versão Bedrock alvo.
