#!/usr/bin/env bash

SOURCE_DIR=/usr/src/fuoj/fu.oj.client
OUT_DIR=/var/www/fuoj-client

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: $SOURCE_DIR does not exist."
    exit 1
else
    cd "$SOURCE_DIR" || exit 1
fi

if [ ! -d "$OUT_DIR" ]; then
    sudo mkdir -p "$OUT_DIR"
    sudo chown -R fuoj:fuoj "$OUT_DIR"
fi

npm install
npm run build

sudo systemctl restart fuoj-client
