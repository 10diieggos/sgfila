#!/usr/bin/env bash
set -e
IFACE=${1:?}
IP_CIDR=${2:?}
GATEWAY=${3:?}
DNS=${4:-"1.1.1.1,8.8.8.8"}
YAML="/etc/netplan/01-sgfila.yaml"
TMP=$(mktemp)
cat > "$TMP" <<EOF
network:
  version: 2
  ethernets:
    $IFACE:
      addresses: [$IP_CIDR]
      gateway4: $GATEWAY
      nameservers:
        addresses: [${DNS}]
EOF
sudo mv "$TMP" "$YAML"
sudo chmod 644 "$YAML"
sudo netplan apply
echo OK
