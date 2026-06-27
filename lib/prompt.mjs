import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { PLATFORM_LABELS, PLATFORMS } from "./platforms.mjs";

function isInteractive() {
  return Boolean(input.isTTY && output.isTTY);
}

export async function promptPlatform({ platform } = {}) {
  if (platform) {
    return platform;
  }

  if (!isInteractive()) {
    throw new Error(
      "Escolha a plataforma com --platform cursor|claude|codex (stdin não é interativo).",
    );
  }

  const rl = createInterface({ input, output });

  try {
    console.log("Qual IA você vai usar neste projeto?");
    PLATFORMS.forEach((id, index) => {
      console.log(`  ${index + 1}. ${PLATFORM_LABELS[id]}`);
    });
    console.log("");

    while (true) {
      const answer = await new Promise((resolve) => {
        rl.question("Escolha (1-3): ", resolve);
      });

      const trimmed = answer.trim();

      if (trimmed === "1" || /^cursor$/i.test(trimmed)) {
        return "cursor";
      }

      if (trimmed === "2" || /^claude/i.test(trimmed)) {
        return "claude";
      }

      if (trimmed === "3" || /^codex$/i.test(trimmed)) {
        return "codex";
      }

      console.log("Opção inválida. Digite 1, 2 ou 3.");
    }
  } finally {
    rl.close();
  }
}
