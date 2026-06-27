import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { install } from "../lib/install.mjs";
import { isValidPlatform, normalizePlatform } from "../lib/platforms.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

function createTargetDir() {
  return mkdtempSync(join(packageRoot, ".tmp-test-"));
}

test("normalizePlatform aceita aliases comuns", () => {
  assert.equal(normalizePlatform("cursor"), "cursor");
  assert.equal(normalizePlatform("Claude"), "claude");
  assert.equal(normalizePlatform("claude code"), "claude");
  assert.equal(normalizePlatform("CODEX"), "codex");
  assert.equal(normalizePlatform("invalid"), null);
});

test("install cursor copia rules e skills", () => {
  const targetDir = createTargetDir();

  try {
    install(packageRoot, targetDir, { platform: "cursor" });

    assert.ok(existsSync(join(targetDir, ".cursor", "rules", "00-project-context.mdc")));
    assert.ok(existsSync(join(targetDir, ".cursor", "skills", "spec-writer", "SKILL.md")));
    assert.ok(existsSync(join(targetDir, "docs", "CONTEXT.md")));
    assert.ok(!existsSync(join(targetDir, "CLAUDE.md")));
    assert.ok(!existsSync(join(targetDir, "AGENTS.md")));
  } finally {
    rmSync(targetDir, { recursive: true, force: true });
  }
});

test("install claude copia CLAUDE.md, rules e skills", () => {
  const targetDir = createTargetDir();

  try {
    install(packageRoot, targetDir, { platform: "claude" });

    assert.ok(existsSync(join(targetDir, "CLAUDE.md")));
    assert.ok(existsSync(join(targetDir, ".claude", "rules", "00-project-context.md")));
    assert.ok(existsSync(join(targetDir, ".claude", "skills", "spec-writer", "SKILL.md")));
    assert.ok(!existsSync(join(targetDir, ".cursor", "rules")));
    assert.ok(!existsSync(join(targetDir, "AGENTS.md")));
  } finally {
    rmSync(targetDir, { recursive: true, force: true });
  }
});

test("install codex copia AGENTS.md e skills", () => {
  const targetDir = createTargetDir();

  try {
    install(packageRoot, targetDir, { platform: "codex" });

    assert.ok(existsSync(join(targetDir, "AGENTS.md")));
    assert.ok(existsSync(join(targetDir, ".agents", "skills", "spec-writer", "SKILL.md")));
    assert.ok(!existsSync(join(targetDir, ".cursor", "rules")));
    assert.ok(!existsSync(join(targetDir, "CLAUDE.md")));
  } finally {
    rmSync(targetDir, { recursive: true, force: true });
  }
});

test("install não sobrescreve arquivos existentes sem force", () => {
  const targetDir = createTargetDir();

  try {
    mkdirSync(join(targetDir, "docs"), { recursive: true });
    cpSync(join(packageRoot, "docs", "CONTEXT.md"), join(targetDir, "docs", "CONTEXT.md"));
    const original = readFileSync(join(targetDir, "docs", "CONTEXT.md"), "utf8");

    install(packageRoot, targetDir, { platform: "codex" });

    assert.equal(readFileSync(join(targetDir, "docs", "CONTEXT.md"), "utf8"), original);
  } finally {
    rmSync(targetDir, { recursive: true, force: true });
  }
});

test("isValidPlatform valida plataformas suportadas", () => {
  assert.equal(isValidPlatform("cursor"), true);
  assert.equal(isValidPlatform("claude"), true);
  assert.equal(isValidPlatform("codex"), true);
  assert.equal(isValidPlatform("windsurf"), false);
});
