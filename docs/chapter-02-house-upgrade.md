# Capítulo 2 — Upgrade da Casa Inicial

## Objetivo

Evoluir a primeira casa sem demoli-la e sem trocar sua linguagem visual.

O capítulo introduz o conceito de **construção incremental**: o blueprint `house-upgrade-01` declara `baseBlueprintId: starter-house-01` e contém apenas os blocos novos.

## O que muda

A Casa Inicial recebe:

- um caminho alinhado com a entrada;
- uma pequena varanda;
- uma cobertura secundária;
- abas sobre as janelas frontais;
- um depósito lateral aberto.

Nenhum bloco da casa original precisa ser removido nesta primeira versão do sistema de upgrades.

## O que o jogador aprende

### Arrival sequence

A construção não começa na parede. Caminho, varanda e porta formam uma sequência de chegada.

### Controlled asymmetry

Um único volume lateral é suficiente para tirar a construção da simetria perfeita.

### Hierarchy

A casa continua sendo o volume dominante. Varanda e depósito são menores e mais baixos.

### Layering

A cobertura da varanda cria um plano intermediário entre o terreno e o telhado principal.

## Motivo técnico para ser additive-only

O primeiro upgrade foi desenhado sem remoções para validarmos o modelo de blueprints encadeados antes de introduzir operações destrutivas.

Uma evolução futura poderá suportar:

- `remove`;
- `replace`;
- abertura de paredes;
- troca de telhado;
- reforma de interior.

## Sequência

1. chegada;
2. deck da varanda;
3. postes da varanda;
4. detalhes das janelas;
5. cobertura da varanda;
6. piso do depósito lateral;
7. postes do depósito;
8. cobertura do depósito.

O capítulo reutiliza as mesmas paletas Spruce e Oak do primeiro projeto.
