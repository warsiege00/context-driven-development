# Guidelines: Testes

## Princípios gerais
- Teste comportamento, não implementação
- Um teste deve quebrar por uma única razão
- Nomes de teste descrevem o cenário, não o método

## Estrutura
```

describe('[unidade sendo testada]', () => { it('[cenário] deve [comportamento esperado]', () => { // arrange // act // assert }) })

```

## Quando usar cada tipo

| Tipo | Usar para |
|------|-----------|
| Unitário | Funções puras, services, utils |
| Integração | Fluxos entre módulos, queries no banco |
| E2E | Fluxos críticos de usuário |

## Mocks
- Mocke dependências externas (APIs, banco), não lógica interna
- Prefira factories a fixtures estáticas

## Nomenclatura
- Arquivos: `[nome].test.ts` ao lado do arquivo testado
- Arquivos E2E: `[fluxo].e2e.ts` em /tests/e2e

