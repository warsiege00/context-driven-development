---
name: architecture-writer
description: Formaliza decisões de arquitetura em documentos estruturados em /docs/architecture/ com componentes, fluxos e dependências. Aciona quando o usuário quer documentar a arquitetura de um módulo ou sistema, menciona "documentar arquitetura", "escrever documento de arquitetura" ou "formalizar a arquitetura", ou quando uma conversa de arquitetura chegou a conclusões que precisam ser registradas antes da spec ou implementação.
---

# Architecture Writer

Transforma decisões tomadas em uma conversa de arquitetura em um documento formal em `/docs/architecture/`.

## Quando usar

- Conversa de arquitetura chegou a conclusões e usuário quer formalizar
- Usuário quer documentar como um módulo ou sistema foi projetado
- Usuário menciona "documentar arquitetura", "escrever doc de arquitetura", "formalizar"

## Importante

Esta skill documenta arquitetura **já decidida**. Não é para explorar ou refinar — isso é feito na conversa. Se o usuário ainda está em dúvida sobre a abordagem, sugira continuar discutindo antes de documentar.

## Processo

### 1. Coletar contexto

Leia:

- `@docs/CONTEXT.md` — stack, módulos, convenções do projeto
- Conversa atual — extraia as decisões, componentes e fluxos discutidos
- ADRs relacionados em `@docs/adr/` se existirem

### 2. Entender o escopo

Se não estiver claro na conversa, pergunte apenas:

- **Qual o nome do módulo ou sistema** sendo documentado
- **Qual o nível de detalhe** — visão geral ou design detalhado

Não pergunte o que já está claro na conversa.

### 3. Gerar o arquivo

Nome do arquivo: `docs/architecture/[nome-do-modulo].md` em kebab-case.

```markdown
# Arquitetura: [Nome do Módulo ou Sistema]

**Data:** [data atual]
**Status:** definido
**ADRs relacionados:** [links para /docs/adr/... se existirem]
**Specs relacionadas:** [links para /docs/specs/... se existirem]

## Visão geral
[2-3 parágrafos descrevendo o que este módulo/sistema faz, seu papel
no projeto e os princípios que guiam seu design.]

## Responsabilidades
[O que este módulo faz — lista clara e objetiva:]
- [responsabilidade 1]
- [responsabilidade 2]

**Fora do escopo deste módulo:**
- [o que explicitamente não é responsabilidade deste módulo]

## Componentes

### [Nome do Componente]
**Tipo:** [service | handler | repository | hook | component | worker | etc]
**Responsabilidade:** [uma frase]

[Descrição de como funciona e por que foi estruturado assim.]

### [Próximo Componente]
...

## Fluxos principais

### [Nome do Fluxo]
[Descreva o fluxo em passos numerados:]
1. [passo 1]
2. [passo 2]
3. [passo 3]

[Repita para cada fluxo relevante]

## Dependências
**Internas:**
- [módulo interno que este módulo consome]

**Externas:**
- [serviço, lib ou API externa]

## Decisões de design
[Escolhas não óbvias feitas no design e o motivo:]
- **[Escolha]:** [por que foi feita dessa forma e não de outra]

[Para decisões com mais peso, crie um ADR separado e referencie aqui.]

## Evolução esperada
[O que provavelmente precisará mudar neste módulo no futuro.
Omitir se não houver nada relevante a registrar.]
```

### 4. Verificar consistência

Após gerar, verifique:

- O documento não contradiz decisões em ADRs existentes
- Os componentes descritos estão alinhados com as convenções do CONTEXT.md
- Se alguma decisão dentro do documento merece um ADR próprio — se sim, sugira criá-lo

### 5. Confirmar com o usuário

Pergunte:

- "Os fluxos principais estão completos ou falta algum cenário importante?"
- "Alguma decisão de design precisa de um ADR separado?"

Não faça as duas perguntas se uma já estiver respondida na conversa.

## Qualidade do documento

Um bom documento de arquitetura:

- Explica o **porquê** das escolhas, não só o **o quê**
- É específico o suficiente para guiar a implementação
- Fica atualizado — se ficar desatualizado, é pior do que não existir

Um documento ruim:

- Descreve o código em vez da arquitetura
- É tão genérico que poderia ser de qualquer projeto
- Mistura decisão de arquitetura com detalhes de implementação
