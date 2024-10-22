#!/usr/bin/env bash

CONFIG_DIR=${1:-"/etc/fuoj"}
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Directory $CONFIG_DIR does not exist."
    exit 1
fi

SERIVCES_DIR=${2:-"/etc/fuoj/systemd"}
SYSTEMD_SERVICES_DIR="/etc/systemd/system"

if [ ! -d "$SERIVCES_DIR" ]; then
    echo "Directory $SERIVCES_DIR does not exist."
    exit 1
fi

for service in "$SERIVCES_DIR"/*; do
    if [ -f "$service" ]; then
        sudo ln -sf "$service" "$SYSTEMD_SERVICES_DIR"
        sudo systemctl enable "$(basename "$service")"
    fi
done
