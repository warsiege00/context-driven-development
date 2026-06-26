---
name: task-breakdown
description: Decompõe specs aprovadas em tarefas atômicas e gera implementation plans em /docs/implementation-plan/. Aciona quando o usuário quer quebrar uma spec em tarefas, menciona "gerar implementation plan", "criar checklist de implementação" ou "planejar implementação", ou quando uma spec aprovada está pronta para implementação.
---

# Task Breakdown

Lê uma spec aprovada e gera um arquivo de implementation plan em `/docs/implementation-plan/` com tarefas atômicas ordenadas e prontas para o Cursor executar.

## Quando usar

- Spec está aprovada e usuário quer começar a implementar
- Usuário quer decompor uma feature em tarefas menores
- Usuário menciona "quebrar em tarefas", "gerar plano", "implementation plan"

## Processo

### 1. Ler a spec

Leia o arquivo de spec em `@docs/specs/[feature].md`. Se o usuário não informou qual spec, pergunte.

Leia também:

- `@docs/CONTEXT.md` — convenções e módulos do projeto
- Arquivos de arquitetura referenciados na spec
- ADRs relacionados

### 2. Identificar camadas de implementação

Antes de gerar tarefas, mapeie mentalmente as camadas envolvidas:

- Tipos e interfaces
- Lógica de domínio / services
- Persistência / integrações externas
- API / handlers
- UI / componentes (se aplicável)
- Testes

### 3. Gerar o arquivo

Nome do arquivo: `docs/implementation-plan/[nome-da-feature].md`

```markdown
# Implementation Plan: [Nome da Feature]

**Spec:** [link para /docs/specs/feature.md]
**Status:** pendente
**Data:** [data atual]

## Contexto
[Uma frase resumindo o que será implementado e por quê essa ordem faz sentido.]

## Tarefas

### Fase 1: Fundação
- [ ] **[1.1]** [Tarefa atômica — uma coisa só, verificável]
  - _O que fazer:_ [instrução clara]
  - _Critério de conclusão:_ [como saber que está pronto]

- [ ] **[1.2]** [Próxima tarefa que depende da anterior]
  - _O que fazer:_ [instrução clara]
  - _Critério de conclusão:_ [como saber que está pronto]

### Fase 2: Lógica principal
- [ ] **[2.1]** ...

### Fase 3: Integração
- [ ] **[3.1]** ...

### Fase 4: Testes
- [ ] **[4.1]** [Testes unitários para X]
  - _O que fazer:_ cobrir os critérios de aceite [1] e [2] da spec
  - _Critério de conclusão:_ todos os testes passando

- [ ] **[4.2]** [Testes de integração para Y]

### Fase 5: Revisão
- [ ] **[5.1]** Verificar que todos os critérios de aceite da spec foram cumpridos
- [ ] **[5.2]** Atualizar CONTEXT.md se alguma decisão nova emergiu durante a implementação

## Dependências externas
[Libs, serviços, variáveis de ambiente necessários antes de começar. Omitir se não houver.]

## Riscos
[O que pode dar errado ou precisar de revisão durante a implementação. Omitir se não houver.]
```

### 4. Princípios para gerar boas tarefas

**Atômica:** cada tarefa deve ser completável em uma única sessão do Cursor sem contexto adicional.

**Verificável:** o critério de conclusão deve ser objetivo — não "implementar o service" mas "o service deve aceitar X e retornar Y sem lançar exceção para inputs válidos".

**Ordenada:** respeite dependências — nunca coloque um handler antes do service que ele chama.

**Testes junto:** não agrupe todos os testes no final — quando fizer sentido, inclua o teste logo após a tarefa que implementa a unidade correspondente.

**Sem over-engineering:** se a spec não pede abstração, não crie tarefa para ela.

### 5. Confirmar com o usuário

Após gerar, informe:

- Número total de tarefas
- Estimativa de fases
- Se identificou algum risco ou dependência que merece atenção antes de começar

Pergunte se a granularidade está adequada — algumas pessoas preferem tarefas maiores, outras menores.
