#!/usr/bin/env node

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { install } from "../lib/install.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function printHelp() {
  console.log(`Uso: cdd init [opções] [diretório-alvo]

Instala a estrutura Context-Driven Development (CDD) no projeto:
  - .cursor/rules/ e .cursor/skills/
  - docs/ (templates, guidelines e diretórios vazios)
  - docs/README.md (manual da metodologia)

Opções:
  -h, --help       Mostra esta ajuda
  -n, --dry-run    Mostra o que seria feito sem alterar arquivos
  -f, --force      Sobrescreve arquivos do framework CDD
  --force-all      Sobrescreve todos os arquivos, inclusive CONTEXT.md e pitfalls.md

Exemplos:
  npx cdd init
  npx cdd init ./meu-projeto
  npx cdd init --force
  npx cdd init --dry-run

Por padrão, arquivos existentes não são sobrescritos.`);
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    force: false,
    forceAll: false,
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
  install(packageRoot, targetDir, options);
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
}
