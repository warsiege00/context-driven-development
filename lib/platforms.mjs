export const PLATFORMS = ["cursor", "claude", "codex"];

export const PLATFORM_LABELS = {
  cursor: "Cursor",
  claude: "Claude Code",
  codex: "Codex",
};

export function isValidPlatform(value) {
  return PLATFORMS.includes(value);
}

export function normalizePlatform(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value).trim().toLowerCase();

  if (normalized === "claude code") {
    return "claude";
  }

  return isValidPlatform(normalized) ? normalized : null;
}
