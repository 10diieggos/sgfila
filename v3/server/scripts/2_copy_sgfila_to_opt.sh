#!/usr/bin/env bash
set -e
SRC=${1:-/mnt/win/Users/Diego/Downloads/nodep/sgfila}
sudo mkdir -p /opt/SGFila
sudo cp -r "$SRC" /opt/SGFila
echo OK
