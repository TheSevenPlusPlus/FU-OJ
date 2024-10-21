#!/usr/bin/env bash

SOURCE_DIR=/usr/src/fuoj
CONFIG_DIR=/etc/fuoj

if [ ! -d "$CONFIG_DIR" ]; then
    sudo mkdir -p "$CONFIG_DIR"
    sudo chown -R fuoj:fuoj "$CONFIG_DIR"
fi

cp -r "$SOURCE_DIR/config"/* "$CONFIG_DIR"
