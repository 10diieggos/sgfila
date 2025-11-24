#!/bin/sh
set -eu
BASE_DIR=$(cd "$(dirname "$0")" && pwd)
RUNTIME_DIR="$BASE_DIR/../_runtime/node"
for d in "$RUNTIME_DIR"/*/bin; do
  PATH="$d:$PATH"
  export PATH
  break
done
HOST=0.0.0.0
PORT=${PORT:-3000}
IP=$(ip -4 route get 1.1.1.1 | awk '{print $7; exit}')
NODE_ENV=production
CORS_ORIGIN="http://$IP:$PORT"
export HOST PORT NODE_ENV CORS_ORIGIN
cd "$BASE_DIR/.."
node dist/server/src/server.js
