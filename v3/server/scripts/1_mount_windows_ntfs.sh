#!/usr/bin/env bash
set -e
DEV=${1:?}
sudo mkdir -p /mnt/win
sudo mount -t ntfs3 -o ro "$DEV" /mnt/win
echo OK
