# Context-Driven Development (CDD)

A methodology for working with AI coding agents — focused on building and maintaining structured project context so tools like Cursor, Claude Code, and Codex can work with consistency and reliability across sessions.

---

## The problem this solves

AI agents have no memory between sessions. Every new conversation starts from zero. Without structured context, the model makes assumptions — about architecture, conventions, decisions already made — and those assumptions are often wrong.

CDD solves this by treating the project repository as the agent's persistent memory. Every decision, convention, and architectural choice lives in the codebase, not in your head or in a chat history.

---

## Core principles

- **Decisions belong in the repo.** If a decision isn't written down, it doesn't exist for the agent.
- **You decide, the agent executes.** Discovery, architecture, and validation are human responsibilities. Generating structured artifacts and writing code are the agent's.
- **Context should be earned.** Don't document everything — document what the agent would get wrong without guidance.
- **Stale docs are worse than no docs.** A small, accurate context beats a large, outdated one.

---

## Workflow

| Step | Where |
|------|-------|
| Discovery | External chat (exploration, research, tradeoffs) |
| Architecture | Cursor + existing codebase context |
| Formalize architecture | `architecture-writer` skill → `/docs/architecture/` |
| Document decision | `adr-writer` skill → `/docs/adr/` |
| Write spec | `spec-writer` skill → `/docs/specs/` |
| Break into tasks | `task-breakdown` skill → `/docs/implementation-plan/` |
| Implement | Cursor (rules + guidelines active) |
| Validate | You (criteria defined in the spec) |
| Update context | Cursor suggests, you approve → `/docs/CONTEXT.md` |

---

## Repository structure

```
/docs
  CONTEXT.md                ← Single entry point for agent context
  pitfalls.md               ← Recurring model mistakes and corrections
  /discovery                ← Research notes (maintained manually)
  /architecture             ← Architecture documents per module
  /specs                    ← Feature specs (source of truth for behavior)
  /adr                      ← Architecture Decision Records
  /implementation-plan      ← Task checklists generated from specs
  /guidelines               ← Technology conventions with code examples

.cursor/
  rules/                    ← Agent behavior instructions (.mdc files)
    00-project-context.mdc
    01-spec-workflow.mdc
    02-docs-and-adrs.mdc
    03-guardrails.mdc
    04-testing-and-review.mdc
    05-guidelines.mdc
  skills/                   ← Skill definitions for Cursor
    spec-writer/
    adr-writer/
    task-breakdown/
    architecture-writer/
```

---

## Who does what

| Task | Owner |
|------|-------|
| Research and explore approaches | You |
| Decide architecture | You |
| Validate spec completeness | You |
| Review and approve tasks | You |
| Validate implementation | You |
| Formalize architecture doc | Agent (`architecture-writer`) |
| Write ADR | Agent (`adr-writer`) |
| Generate spec | Agent (`spec-writer`) |
| Generate implementation plan | Agent (`task-breakdown`) |
| Write code and tests | Agent |
| Suggest `CONTEXT.md` updates | Agent |

You make decisions. The agent executes and documents.

---

## Skills

Skills are structured instruction files that produce consistent, well-formatted artifacts. Each skill reads the project context before generating output.

| Skill | Triggers | Output |
|-------|----------|--------|
| `spec-writer` | "write spec", "create spec", "document feature" | `/docs/specs/[feature].md` |
| `adr-writer` | "create ADR", "document decision" | `/docs/adr/[number]-[title].md` |
| `task-breakdown` | "break into tasks", "implementation plan" | `/docs/implementation-plan/[feature].md` |
| `architecture-writer` | "document architecture", "formalize architecture" | `/docs/architecture/[module].md` |

---

## Key files

**`docs/CONTEXT.md`** — Stack, main architectural decisions, module responsibilities, active ADRs. The agent reads this at the start of every session. Keep it short and accurate.

**`.cursor/rules/`** — Behavioral instructions for the agent split across focused `.mdc` files: when to read which files, when to update context, what not to do. Five rules always apply; `05-guidelines` activates intelligently based on the technology in use.

**`docs/pitfalls.md`** — Mistakes the model has made and been corrected on. Grows organically during development. Over time becomes one of the most valuable files in the project.

**`docs/guidelines/`** — Technology conventions with concrete code examples (do this, not that). One file per technology.

---

## Compatibility

The doc structure is tool-agnostic. Each agent reads a different entry point file, all pointing to the same `/docs` folder.

| Tool | Entry point |
|------|-------------|
| Cursor | `.cursor/rules/` |
| Claude Code | `CLAUDE.md` |
| Codex | `AGENTS.md` |

---

## Context loading in practice

**Start a new Cursor session:**

```
Read @docs/CONTEXT.md before starting.
We're working on @docs/specs/auth-flow.md,
task 2.3 in @docs/implementation-plan/auth.md
```

**Before an architectural decision:**

```
Read @docs/architecture/event-driven.md
and @docs/adr/ before suggesting an approach
```

**When the agent makes a familiar mistake:**

Add it to `docs/pitfalls.md` — it won't repeat next session.
