# Context-Driven Development

Este projeto segue a metodologia CDD (Context-Driven Development).

## Contexto do projeto

Antes de iniciar qualquer tarefa, leia `docs/CONTEXT.md` para entender as decisões arquiteturais e convenções do projeto.

Antes de implementar qualquer coisa, consulte `docs/pitfalls.md`. Se um padrão descrito lá for relevante para a tarefa atual, siga a correção indicada.

## Fluxo de spec

Antes de escrever código, leia:

- `docs/specs/[spec-atual].md` — fonte de verdade do comportamento; não interprete além do que define
- `docs/implementation-plan/[plano-atual].md` — checklist de tarefas; marque itens concluídos à medida que avança

Foque apenas nas tarefas não marcadas. Não implemente nada fora do plano sem perguntar. Não pule etapas sem justificativa explícita.

## Manutenção do CONTEXT.md

Ao finalizar uma tarefa, consulte a seção "Quando atualizar este arquivo" em `docs/CONTEXT.md`. Se algum item se aplica, atualize o arquivo antes de encerrar.

Quando uma decisão de arquitetura for tomada durante a implementação, sugira a criação de um ADR em `docs/adr/` seguindo `docs/adr/.template.md`.

## O que não fazer

- Não sugira trocar libs ou padrões que já têm ADR registrado sem antes apontar o ADR existente e perguntar se a decisão deve ser revisada
- Não crie abstrações antecipadas — implemente o mínimo que a spec exige
- Não atualize docs de discovery ou architecture automaticamente — esses são mantidos manualmente

## Testes

Toda implementação de spec deve incluir testes conforme a estratégia definida na própria spec e em `docs/guidelines/testing.md`.

Não considere uma tarefa concluída se a estratégia de teste definida na spec não foi cumprida.

## Self-review

Antes de encerrar qualquer tarefa, revise o próprio output verificando:

- O código faz exatamente o que a spec define, nem mais nem menos
- Não há lógica duplicada ou abstrações desnecessárias
- Casos de borda da spec foram cobertos
- Os testes cobrem os critérios de aceite
- Nenhuma convenção de `docs/CONTEXT.md` foi violada

Se algum item não passou, corrija antes de entregar.

## Guidelines de tecnologia

Para tarefas envolvendo tecnologias com guideline em `docs/guidelines/`, leia o arquivo correspondente antes de escrever código.

## Skills

Skills reutilizáveis estão em `.agents/skills/`:

- `spec-writer` — gera specs em `docs/specs/`
- `adr-writer` — gera ADRs em `docs/adr/`
- `task-breakdown` — gera planos em `docs/implementation-plan/`
- `architecture-writer` — gera documentos em `docs/architecture/`

## Iniciar uma sessão

```
Read docs/CONTEXT.md before starting.
We're working on docs/specs/[feature].md,
task [X] in docs/implementation-plan/[feature].md
```
