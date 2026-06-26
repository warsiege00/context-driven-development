---
name: adr-writer
description: Gera Architecture Decision Records estruturados em /docs/adr/ com contexto, alternativas, decisão, tradeoffs e consequências. Aciona quando o usuário toma uma decisão arquitetural, menciona "criar ADR", "documentar decisão" ou "registrar arquitetura", ou quando uma decisão relevante surge durante implementação ou conversa de arquitetura.
---

# ADR Writer

Gera um arquivo ADR estruturado em `/docs/adr/` documentando uma decisão de arquitetura já tomada.

## Quando usar

- Usuário tomou uma decisão arquitetural e quer registrá-la
- Uma decisão relevante emergiu durante implementação
- Usuário menciona "criar ADR", "documentar decisão", "registrar arquitetura"

## Processo

### 1. Coletar contexto

Leia:

- `@docs/CONTEXT.md` — para entender o projeto e verificar se há decisões relacionadas
- ADRs existentes em `@docs/adr/` — para numerar corretamente e verificar se a decisão não contradiz ou substitui um ADR anterior
- Template em `@docs/adr/.template.md`

### 2. Determinar o número do ADR

Liste os arquivos em `/docs/adr/` e use o próximo número sequencial. Formato: `001`, `002`, `003`.

### 3. Entender a decisão

Se o usuário não forneceu claramente, pergunte apenas o que falta:

- **Qual o problema** que motivou a decisão
- **O que foi decidido**
- **Quais alternativas foram consideradas** e por que foram descartadas

Não pergunte o que já está claro na conversa.

### 4. Gerar o arquivo

Nome do arquivo: `docs/adr/[número]-[título-em-kebab-case].md`

```markdown
# ADR-[número]: [Título em uma frase direta]

**Data:** [data atual]
**Status:** aceito
**Substitui:** [ADR-XXX se esta decisão substituir uma anterior, senão omitir]
**Substituído por:** [deixar em branco — preenchido no futuro se necessário]

## Contexto
[Qual problema estava sendo resolvido. Descreva a situação que forçou
a decisão — restrições, requisitos, pressões. Seja factual, não justifique
a decisão aqui.]

## Alternativas consideradas
[Liste as opções que foram avaliadas antes da decisão:
- **Opção A:** [descrição breve] — descartada porque [motivo]
- **Opção B:** [descrição breve] — descartada porque [motivo]]

## Decisão
[O que foi escolhido e a razão principal. Uma decisão boa cabe em
2-3 parágrafos. Se precisar de mais, a decisão pode não estar clara.]

## Tradeoffs
**O que ganhamos:**
- [benefício concreto]

**O que abrimos mão:**
- [custo ou limitação aceita]

## Consequências
[O que muda no projeto a partir dessa decisão:
- Impacto em outros módulos
- Restrições que passam a existir
- O que precisa ser feito em seguida]
```

### 5. Atualizar CONTEXT.md

Após criar o ADR, verifique se a decisão deve ser refletida em `@docs/CONTEXT.md`:

- Se sim, sugira a atualização específica
- Se não, informe que o CONTEXT.md não precisa ser alterado

### 6. Verificar ADRs anteriores

Se a nova decisão substituir uma anterior, atualize o ADR substituído adicionando:

```
**Substituído por:** ADR-[novo número]
```

## Qualidade do ADR

Um bom ADR:

- É escrito no passado — a decisão já foi tomada
- Separa claramente contexto (fatos) de decisão (escolha)
- Lista tradeoffs honestamente, incluindo o que foi sacrificado
- É curto o suficiente para ser lido em 2 minutos

Um ADR ruim:

- Justifica a decisão em vez de documentá-la
- Omite as alternativas consideradas
- Não deixa claro o que muda no projeto
- É um documento de design, não de decisão
