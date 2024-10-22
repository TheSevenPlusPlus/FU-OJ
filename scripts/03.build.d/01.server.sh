#!/usr/bin/env bash

SOURCE_DIR=/usr/src/fuoj/FU.OJ.Server
OUT_DIR=/var/www/fuoj
ENV_FILE=/etc/fuoj/fuoj.env

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: $SOURCE_DIR does not exist."
    exit 1
else
    cd "$SOURCE_DIR" || exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE does not exist."
    exit 1
else
    while IFS='=' read -r key value; do
        if [ "$key" == "OUT_DIR" ]; then
            OUT_DIR="$value"
        fi
    done <"$ENV_FILE"
fi

if [ ! -d "$OUT_DIR" ]; then
    sudo mkdir -p "$OUT_DIR"
    sudo chown -R fuoj:fuoj "$OUT_DIR"
fi

dotnet publish -c Release -o "$OUT_DIR" -r linux-x64 --self-contained

dotnet ef database update

sudo systemctl restart fuoj-server
