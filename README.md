# Context-Driven Development (CDD)

Uma metodologia para trabalhar com agentes de código com IA — focada em construir e manter contexto estruturado do projeto para que ferramentas como Cursor, Claude Code e Codex possam trabalhar com consistência e confiabilidade entre sessões.

---

## Instalação em outro projeto

### Via npm (recomendado)

Instale como dependência de desenvolvimento e execute o comando de setup:

```bash
npm install -D context-driven-dev
npx cdd init
```

Na primeira execução, o comando pergunta qual IA você vai usar:

1. **Cursor** — instala `.cursor/rules/` e `.cursor/skills/`
2. **Claude Code** — instala `CLAUDE.md`, `.claude/rules/` e `.claude/skills/`
3. **Codex** — instala `AGENTS.md` e `.agents/skills/`

Para pular a pergunta interativa (CI ou scripts):

```bash
npx cdd init --platform cursor
npx cdd init --platform claude
npx cdd init --platform codex
```

Para atualizar rules e templates depois de uma nova versão do pacote:

```bash
npm update context-driven-dev
npx cdd init --force
```

Opcionalmente, adicione um script no `package.json` do projeto:

```json
{
  "scripts": {
    "cdd:init": "cdd init",
    "cdd:update": "cdd init --force"
  }
}
```

### Via script local

Clone este repositório (ou baixe o script) e execute a instalação no diretório do projeto alvo:

```bash
git clone https://github.com/USER/CDD.git /tmp/cdd
/tmp/cdd/install.sh /caminho/para/seu-projeto
```

Ou, a partir do diretório do projeto:

```bash
/path/to/CDD/install.sh .
```

### O que é instalado

O comando `cdd init` (ou `install.sh`) copia:

- `docs/` com templates, guidelines e diretórios vazios (`discovery`, `architecture`, `specs`, `adr`, `implementation-plan`, `guidelines`)
- `docs/README.md` — este manual, para consulta dentro do projeto
- Arquivos da plataforma escolhida:
  - **Cursor:** `.cursor/rules/` e `.cursor/skills/`
  - **Claude Code:** `CLAUDE.md`, `.claude/rules/` e `.claude/skills/`
  - **Codex:** `AGENTS.md` e `.agents/skills/`

Por padrão, arquivos que já existem no destino **não são sobrescritos**. Use `--force` para atualizar rules, skills e templates do framework; use `--force-all` para sobrescrever também `CONTEXT.md` e `pitfalls.md`.

```bash
npx cdd init --dry-run   # pré-visualiza sem alterar nada
npx cdd init --force     # atualiza arquivos do framework CDD
```

Após instalar, preencha `docs/CONTEXT.md` com o contexto do seu projeto.

---

## O problema que isso resolve

Agentes de IA não têm memória entre sessões. Toda nova conversa começa do zero. Sem contexto estruturado, o modelo faz suposições — sobre arquitetura, convenções, decisões já tomadas — e essas suposições costumam estar erradas.

O CDD resolve isso tratando o repositório do projeto como a memória persistente do agente. Toda decisão, convenção e escolha arquitetural vive no código, não na sua cabeça nem no histórico de chat.

---

## Princípios centrais

- **Decisões pertencem ao repositório.** Se uma decisão não está escrita, ela não existe para o agente.
- **Você decide, o agente executa.** Descoberta, arquitetura e validação são responsabilidades humanas. Gerar artefatos estruturados e escrever código são do agente.
- **Contexto deve ser conquistado.** Não documente tudo — documente o que o agente erraria sem orientação.
- **Documentação desatualizada é pior que nenhuma documentação.** Um contexto pequeno e preciso vale mais que um grande e desatualizado.

---

## Fluxo de trabalho

Para um passo a passo completo com projeto de exemplo (app de tarefas), veja **[docs/tutorial.md](docs/tutorial.md)** — material de apoio neste repositório.

| Etapa | Onde |
|-------|------|
| Descoberta | Chat externo (exploração, pesquisa, tradeoffs) |
| Arquitetura | Cursor + contexto do codebase existente |
| Formalizar arquitetura | skill `architecture-writer` → `/docs/architecture/` |
| Documentar decisão | skill `adr-writer` → `/docs/adr/` |
| Escrever spec | skill `spec-writer` → `/docs/specs/` |
| Quebrar em tarefas | skill `task-breakdown` → `/docs/implementation-plan/` |
| Implementar | Cursor (rules + guidelines ativas) |
| Validar | Você (critérios definidos na spec) |
| Atualizar contexto | Cursor sugere, você aprova → `/docs/CONTEXT.md` |

---

## Estrutura do repositório

```
/docs
  CONTEXT.md                ← Ponto de entrada único para contexto do agente
  pitfalls.md               ← Erros recorrentes do modelo e correções
  /discovery                ← Notas de pesquisa (mantidas manualmente)
  /architecture             ← Documentos de arquitetura por módulo
  /specs                    ← Specs de features (fonte de verdade do comportamento)
  /adr                      ← Architecture Decision Records
  /implementation-plan      ← Checklists de tarefas geradas a partir das specs
  /guidelines               ← Convenções de tecnologia com exemplos de código

.cursor/
  rules/                    ← Instruções de comportamento do agente (arquivos .mdc)
    00-project-context.mdc
    01-spec-workflow.mdc
    02-docs-and-adrs.mdc
    03-guardrails.mdc
    04-testing-and-review.mdc
    05-guidelines.mdc
  skills/                   ← Definições de skills para o Cursor
    spec-writer/
    adr-writer/
    task-breakdown/
    architecture-writer/
```

---

## Quem faz o quê

| Tarefa | Responsável |
|--------|-------------|
| Pesquisar e explorar abordagens | Você |
| Decidir arquitetura | Você |
| Validar completude da spec | Você |
| Revisar e aprovar tarefas | Você |
| Validar implementação | Você |
| Formalizar documento de arquitetura | Agente (`architecture-writer`) |
| Escrever ADR | Agente (`adr-writer`) |
| Gerar spec | Agente (`spec-writer`) |
| Gerar plano de implementação | Agente (`task-breakdown`) |
| Escrever código e testes | Agente |
| Sugerir atualizações em `CONTEXT.md` | Agente |

Você toma as decisões. O agente executa e documenta.

---

## Skills

Skills são arquivos de instrução estruturados que produzem artefatos consistentes e bem formatados. Cada skill lê o contexto do projeto antes de gerar a saída.

| Skill | Gatilhos | Saída |
|-------|----------|-------|
| `spec-writer` | "escrever spec", "criar spec", "documentar feature" | `/docs/specs/[feature].md` |
| `adr-writer` | "criar ADR", "documentar decisão" | `/docs/adr/[number]-[title].md` |
| `task-breakdown` | "quebrar em tarefas", "plano de implementação" | `/docs/implementation-plan/[feature].md` |
| `architecture-writer` | "documentar arquitetura", "formalizar arquitetura" | `/docs/architecture/[module].md` |

---

## Arquivos-chave

**`docs/CONTEXT.md`** — Stack, principais decisões arquiteturais, responsabilidades dos módulos, ADRs ativos. O agente lê este arquivo no início de cada sessão. Mantenha curto e preciso.

**`.cursor/rules/`** — Instruções de comportamento para o agente divididas em arquivos `.mdc` focados: quando ler quais arquivos, quando atualizar o contexto, o que não fazer. Cinco rules sempre se aplicam; `05-guidelines` é ativada de forma inteligente com base na tecnologia em uso.

**`docs/pitfalls.md`** — Erros que o modelo cometeu e foram corrigidos. Cresce organicamente durante o desenvolvimento. Com o tempo, torna-se um dos arquivos mais valiosos do projeto.

**`docs/guidelines/`** — Convenções de tecnologia com exemplos concretos de código (faça isso, não aquilo). Um arquivo por tecnologia.

---

## Compatibilidade

A estrutura de documentação é agnóstica em relação à ferramenta. Cada agente lê um arquivo de entrada diferente, todos apontando para a mesma pasta `/docs`.

| Ferramenta | Ponto de entrada | Skills |
|------------|------------------|--------|
| Cursor | `.cursor/rules/` | `.cursor/skills/` |
| Claude Code | `CLAUDE.md` + `.claude/rules/` | `.claude/skills/` |
| Codex | `AGENTS.md` | `.agents/skills/` |

---

## Carregamento de contexto na prática

**Iniciar uma nova sessão no Cursor:**

```
Read @docs/CONTEXT.md before starting.
We're working on @docs/specs/auth-flow.md,
task 2.3 in @docs/implementation-plan/auth.md
```

**Antes de uma decisão arquitetural:**

```
Read @docs/architecture/event-driven.md
and @docs/adr/ before suggesting an approach
```

**Quando o agente comete um erro familiar:**

Adicione em `docs/pitfalls.md` — ele não repetirá na próxima sessão.
