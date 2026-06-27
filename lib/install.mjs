import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const DOC_DIRS = [
  "discovery",
  "architecture",
  "specs",
  "adr",
  "implementation-plan",
  "guidelines",
];

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
  const settings = {
    dryRun: false,
    force: false,
    forceAll: false,
    targetDir: resolvedTarget,
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
  log(`  origem:  ${resolvedSource}`);
  log(`  destino: ${resolvedTarget}`);
  log("");

  log("Cursor rules e skills");
  copyTree(
    join(resolvedSource, ".cursor", "rules"),
    join(resolvedTarget, ".cursor", "rules"),
    "framework",
    settings,
    log,
  );
  copyTree(
    join(resolvedSource, ".cursor", "skills"),
    join(resolvedTarget, ".cursor", "skills"),
    "framework",
    settings,
    log,
  );

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
  log("  1. Preencha docs/CONTEXT.md com o contexto do seu projeto");
  log("  2. Leia docs/README.md para entender o fluxo de trabalho");
  log("  3. Inicie uma sessão no Cursor com: Read @docs/CONTEXT.md before starting.");
}
