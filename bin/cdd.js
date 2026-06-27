#!/usr/bin/env node

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { install } from "../lib/install.mjs";
import { promptPlatform } from "../lib/prompt.mjs";
import { isValidPlatform, normalizePlatform } from "../lib/platforms.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function printHelp() {
  console.log(`Uso: cdd init [opções] [diretório-alvo]

Instala a estrutura Context-Driven Development (CDD) no projeto:
  - docs/ (templates, guidelines e diretórios vazios)
  - docs/README.md (manual da metodologia)
  - Arquivos da plataforma escolhida:
      cursor → .cursor/rules/ e .cursor/skills/
      claude → CLAUDE.md, .claude/rules/ e .claude/skills/
      codex  → AGENTS.md e .agents/skills/

Opções:
  -h, --help              Mostra esta ajuda
  -n, --dry-run           Mostra o que seria feito sem alterar arquivos
  -f, --force             Sobrescreve arquivos do framework CDD
  --force-all             Sobrescreve todos os arquivos, inclusive CONTEXT.md e pitfalls.md
  -p, --platform <nome>   Plataforma: cursor, claude ou codex (padrão: pergunta interativamente)

Exemplos:
  npx cdd init
  npx cdd init --platform claude
  npx cdd init --platform codex ./meu-projeto
  npx cdd init --force
  npx cdd init --dry-run

Por padrão, arquivos existentes não são sobrescritos.`);
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    force: false,
    forceAll: false,
    platform: null,
  };
  let targetDir = ".";

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    switch (arg) {
      case "-h":
      case "--help":
        printHelp();
        process.exit(0);
        break;
      case "-n":
      case "--dry-run":
        options.dryRun = true;
        break;
      case "-f":
      case "--force":
        options.force = true;
        break;
      case "--force-all":
        options.forceAll = true;
        break;
      case "-p":
      case "--platform": {
        const value = argv[i + 1];
        if (!value || value.startsWith("-")) {
          console.error("Erro: --platform requer um valor (cursor, claude ou codex).");
          process.exit(1);
        }
        const platform = normalizePlatform(value);
        if (!platform) {
          console.error(`Plataforma inválida: ${value}`);
          console.error("Use: cursor, claude ou codex.");
          process.exit(1);
        }
        options.platform = platform;
        i += 1;
        break;
      }
      default:
        if (arg.startsWith("-")) {
          console.error(`Opção desconhecida: ${arg}`);
          printHelp();
          process.exit(1);
        } else {
          targetDir = arg;
        }
        break;
    }
  }

  return { targetDir, options };
}

const [command, ...rest] = process.argv.slice(2);

if (!command || command === "-h" || command === "--help") {
  printHelp();
  process.exit(command ? 0 : 1);
}

if (command !== "init") {
  console.error(`Comando desconhecido: ${command}`);
  console.error('Use "cdd init" para instalar a estrutura CDD.');
  process.exit(1);
}

const { targetDir, options } = parseArgs(rest);

try {
  const platform = options.platform ?? (await promptPlatform());
  if (!isValidPlatform(platform)) {
    throw new Error(`Plataforma inválida: ${platform}`);
  }

  install(packageRoot, targetDir, { ...options, platform });
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
}
