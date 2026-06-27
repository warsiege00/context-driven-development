#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v node >/dev/null 2>&1; then
  exec node "$SOURCE_DIR/bin/cdd.js" init "$@"
fi

echo "Erro: Node.js 18+ é necessário para executar a instalação."
echo "Instale Node.js ou use: npm install -D context-driven-dev && npx cdd init"
exit 1
