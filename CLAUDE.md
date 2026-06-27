# Context-Driven Development

Este projeto segue a metodologia CDD (Context-Driven Development).

## Antes de começar

1. Leia `docs/CONTEXT.md` — stack, decisões arquiteturais e convenções do projeto
2. Consulte `docs/pitfalls.md` — erros recorrentes do modelo e como evitá-los

## Fluxo de trabalho

- **Implementar features:** leia a spec em `docs/specs/` e o plano em `docs/implementation-plan/` indicados pelo usuário antes de escrever código
- **Formalizar arquitetura:** use a skill `architecture-writer` → `docs/architecture/`
- **Documentar decisões:** use a skill `adr-writer` → `docs/adr/`
- **Escrever specs:** use a skill `spec-writer` → `docs/specs/`
- **Quebrar em tarefas:** use a skill `task-breakdown` → `docs/implementation-plan/`

Regras detalhadas de comportamento estão em `.claude/rules/`. Skills reutilizáveis em `.claude/skills/`.

## Iniciar uma sessão

```
Read docs/CONTEXT.md before starting.
We're working on docs/specs/[feature].md,
task [X] in docs/implementation-plan/[feature].md
```
