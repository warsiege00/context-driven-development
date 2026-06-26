---
name: spec-writer
description: Gera specs estruturadas para features em /docs/specs/ com objetivo, comportamento, casos de borda, critérios de aceite e estratégia de teste. Aciona quando o usuário quer criar ou documentar uma spec, transformar requisitos em spec formal, ou menciona "escrever spec", "gerar spec", "criar spec" ou "documentar feature".
---

# Spec Writer

Gera um arquivo de spec estruturado em `/docs/specs/` a partir de requisitos e decisões já tomadas pelo usuário.

## Quando usar

- Usuário quer documentar uma feature antes de implementar
- Usuário tem requisitos definidos e quer transformar em spec formal
- Usuário menciona "escrever spec", "gerar spec", "documentar feature"

## Processo

### 1. Coletar contexto

Antes de gerar, leia:

- `@docs/CONTEXT.md` — stack, convenções, módulos do projeto
- Template em `@docs/specs/.template.md`
- Arquivos relevantes em `@docs/architecture/` se existirem para a feature
- ADRs relacionados em `@docs/adr/` se existirem

### 2. Entender o input do usuário

Se o usuário não forneceu, pergunte apenas:

- **O que a feature faz** em uma frase
- **Quem usa** (usuário final, sistema interno, outro serviço)
- **O que está fora do escopo** nessa iteração

Não pergunte o que pode ser inferido do CONTEXT.md ou da conversa.

### 3. Gerar o arquivo

Nome do arquivo: `docs/specs/[nome-da-feature].md` em kebab-case.

```markdown
# Spec: [Nome da Feature]

**Status:** rascunho
**Data:** [data atual]
**Arquitetura relacionada:** [link para /docs/architecture/... se existir]
**ADRs relacionados:** [links para /docs/adr/... se existirem]

## Objetivo
[O que essa feature resolve em uma frase. Foco no problema, não na solução.]

## Comportamento esperado
[Descrição funcional clara do que o sistema deve fazer.
Escreva do ponto de vista do comportamento observável, não da implementação.
Use linguagem direta: "O sistema deve...", "Quando X, então Y".]

## Casos de borda
[Situações não ideais que devem ser tratadas:
- O que acontece se o input for inválido
- O que acontece em falhas de dependências externas
- Limites e restrições]

## Fora do escopo
[O que explicitamente NÃO será implementado nessa iteração.
Isso é tão importante quanto o que será feito.]

## Critérios de aceite
- [ ] [Comportamento verificável 1]
- [ ] [Comportamento verificável 2]
- [ ] [Cada item deve ser testável — evite critérios subjetivos]

## Estratégia de teste
- **Unitário:** [funções/services que precisam de cobertura unitária]
- **Integração:** [fluxos entre módulos que precisam ser testados juntos]
- **E2E:** [fluxos críticos de usuário que precisam de validação ponta a ponta]

## Notas de implementação
[Restrições técnicas relevantes, libs a usar, padrões a seguir conforme CONTEXT.md.
Deixe em branco se não houver restrições específicas além das convenções já documentadas.]
```

### 4. Confirmar com o usuário

Após gerar, pergunte:

- "Os critérios de aceite cobrem tudo que você precisa validar?"
- "Há algo que deve ser explicitamente marcado como fora do escopo?"

Não pergunte as duas ao mesmo tempo se uma já estiver clara na conversa.

## Qualidade da spec

Uma boa spec:

- Descreve **o quê**, não o **como**
- Tem critérios de aceite que qualquer desenvolvedor consegue verificar sem ambiguidade
- É pequena o suficiente para ser implementada em uma sessão focada — se ficou grande, sugira dividir
- Não contradiz decisões registradas em ADRs existentes

Uma spec ruim:

- Descreve detalhes de implementação nos critérios de aceite
- Tem critérios vagos como "deve ser rápido" ou "deve ser fácil de usar"
- Mistura múltiplas features em um único documento
