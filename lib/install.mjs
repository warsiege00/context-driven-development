import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { PLATFORM_LABELS } from "./platforms.mjs";

const DOC_DIRS = [
  "discovery",
  "architecture",
  "specs",
  "adr",
  "implementation-plan",
  "guidelines",
];

const PLATFORM_CONFIG = {
  cursor: {
    label: PLATFORM_LABELS.cursor,
    logSection: "Cursor rules e skills",
    steps: [
      {
        src: ".cursor/rules",
        dest: ".cursor/rules",
        kind: "framework",
      },
      {
        src: ".cursor/skills",
        dest: ".cursor/skills",
        kind: "framework",
      },
    ],
    nextSteps: [
      "Preencha docs/CONTEXT.md com o contexto do seu projeto",
      "Leia docs/README.md para entender o fluxo de trabalho",
      "Inicie uma sessão no Cursor com: Read @docs/CONTEXT.md before starting.",
    ],
  },
  claude: {
    label: PLATFORM_LABELS.claude,
    logSection: "Claude Code (CLAUDE.md, rules e skills)",
    steps: [
      {
        src: "CLAUDE.md",
        dest: "CLAUDE.md",
        kind: "framework",
      },
      {
        src: ".claude/rules",
        dest: ".claude/rules",
        kind: "framework",
      },
      {
        src: ".cursor/skills",
        dest: ".claude/skills",
        kind: "framework",
      },
    ],
    nextSteps: [
      "Preencha docs/CONTEXT.md com o contexto do seu projeto",
      "Leia docs/README.md para entender o fluxo de trabalho",
      "Inicie uma sessão no Claude Code com: Read docs/CONTEXT.md before starting.",
    ],
  },
  codex: {
    label: PLATFORM_LABELS.codex,
    logSection: "Codex (AGENTS.md e skills)",
    steps: [
      {
        src: "AGENTS.md",
        dest: "AGENTS.md",
        kind: "framework",
      },
      {
        src: ".cursor/skills",
        dest: ".agents/skills",
        kind: "framework",
      },
    ],
    nextSteps: [
      "Preencha docs/CONTEXT.md com o contexto do seu projeto",
      "Leia docs/README.md para entender o fluxo de trabalho",
      "Inicie uma sessão no Codex com: Read docs/CONTEXT.md before starting.",
    ],
  },
};

function walkFiles(dir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (stat.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function shouldSkip(dest, kind, { force, forceAll }) {
  if (!existsSync(dest)) {
    return false;
  }

  if (forceAll) {
    return false;
  }

  if (kind === "starter" && !force) {
    return true;
  }

  if (kind === "framework" && !force) {
    return true;
  }

  return false;
}

function copyFile(src, dest, kind, options, log) {
  if (shouldSkip(dest, kind, options)) {
    log(`  ignorado (já existe): ${relative(options.targetDir, dest)}`);
    return;
  }

  mkdirSync(dirname(dest), { recursive: true });

  if (!options.dryRun) {
    cpSync(src, dest);
  }

  log(`  copiado: ${relative(options.targetDir, dest)}`);
}

function copyTree(srcDir, destDir, kind, options, log) {
  if (!existsSync(srcDir)) {
    log(`  aviso: diretório de origem não encontrado: ${srcDir}`);
    return;
  }

  for (const file of walkFiles(srcDir)) {
    const rel = relative(srcDir, file);
    copyFile(file, join(destDir, rel), kind, options, log);
  }
}

function copyStep(sourceDir, targetDir, step, options, log) {
  const src = join(sourceDir, step.src);
  const dest = join(targetDir, step.dest);

  if (existsSync(src) && statSync(src).isDirectory()) {
    copyTree(src, dest, step.kind, options, log);
    return;
  }

  copyFile(src, dest, step.kind, options, log);
}

function ensureDocDir(targetDir, dirName, options, log) {
  const dir = join(targetDir, "docs", dirName);
  const gitkeep = join(dir, ".gitkeep");

  if (options.dryRun) {
    log(`[dry-run] mkdir -p ${relative(targetDir, dir)}`);
    if (!existsSync(gitkeep)) {
      log(`[dry-run] touch ${relative(targetDir, gitkeep)}`);
    }
    return;
  }

  mkdirSync(dir, { recursive: true });

  if (!existsSync(gitkeep)) {
    writeFileSync(gitkeep, "");
    log(`  criado: docs/${dirName}/`);
  } else {
    log(`  já existe: docs/${dirName}/`);
  }
}

export function install(sourceDir, targetDir, options = {}) {
  const resolvedSource = resolve(sourceDir);
  const resolvedTarget = resolve(targetDir);
  const platform = options.platform ?? "cursor";
  const platformConfig = PLATFORM_CONFIG[platform];

  if (!platformConfig) {
    throw new Error(`Plataforma desconhecida: ${platform}`);
  }

  const settings = {
    dryRun: false,
    force: false,
    forceAll: false,
    targetDir: resolvedTarget,
    platform,
    ...options,
  };

  if (settings.forceAll) {
    settings.force = true;
  }

  const log = settings.logger ?? ((message) => console.log(message));

  if (!existsSync(join(resolvedSource, "README.md"))) {
    throw new Error(`Não foi possível localizar o pacote CDD em ${resolvedSource}`);
  }

  log("CDD install");
  log(`  plataforma: ${platformConfig.label}`);
  log(`  origem:  ${resolvedSource}`);
  log(`  destino: ${resolvedTarget}`);
  log("");

  log(platformConfig.logSection);
  for (const step of platformConfig.steps) {
    copyStep(resolvedSource, resolvedTarget, step, settings, log);
  }

  log("");
  log("Documentação");

  const docFiles = [
    ["docs/CONTEXT.md", "starter"],
    ["docs/pitfalls.md", "starter"],
    ["docs/specs/.template.md", "framework"],
    ["docs/adr/.template.md", "framework"],
    ["docs/guidelines/.template.md", "framework"],
    ["docs/guidelines/testing.md", "framework"],
  ];

  for (const [relPath, kind] of docFiles) {
    copyFile(
      join(resolvedSource, relPath),
      join(resolvedTarget, relPath),
      kind,
      settings,
      log,
    );
  }

  copyFile(
    join(resolvedSource, "README.md"),
    join(resolvedTarget, "docs", "README.md"),
    "framework",
    settings,
    log,
  );

  log("");
  log("Diretórios");

  for (const dir of DOC_DIRS) {
    ensureDocDir(resolvedTarget, dir, settings, log);
  }

  log("");
  log("Instalação concluída.");
  log("");
  log("Próximos passos:");
  platformConfig.nextSteps.forEach((step, index) => {
    log(`  ${index + 1}. ${step}`);
  });
}

export { PLATFORM_CONFIG };
