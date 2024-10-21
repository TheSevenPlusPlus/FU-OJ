#!/usr/bin/env bash

CONFIG_DIR=${1:-"/etc/fuoj"}
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Directory $CONFIG_DIR does not exist."
    exit 1
fi

FUOJ_SECRET_FILE="$CONFIG_DIR/secrets.generated.conf"
FOOJ_DEFAULT_CONFIG_FILE="$CONFIG_DIR/fuoj.default.conf"
FOOJ_OVERRIDE_CONFIG_FILE="$CONFIG_DIR/fuoj.override.conf"
FOOJ_CONFIG_FILE="$CONFIG_DIR/fuoj.conf"

declare -A config
if [ ! -f "$FOOJ_DEFAULT_CONFIG_FILE" ]; then
    echo "File $FOOJ_DEFAULT_CONFIG_FILE does not exist."
    exit 1
else
    while IFS='=' read -r key value; do
        if [[ ! "$key" =~ ^# && -n "$key" ]]; then
            config["$key"]="$value"
        fi
    done <"$FOOJ_DEFAULT_CONFIG_FILE"

    while IFS='=' read -r key value; do
        if [[ ! "$key" =~ ^# && -n "$key" ]]; then
            config["$key"]="$value"
        fi
    done <"$FUOJ_SECRET_FILE"

    if [ -f "$FOOJ_OVERRIDE_CONFIG_FILE" ]; then
        while IFS='=' read -r key value; do
            if [[ ! "$key" =~ ^# && -n "$key" ]]; then
                config["$key"]="$value"
            fi
        done <"$FOOJ_OVERRIDE_CONFIG_FILE"
    fi
fi

tee "$FOOJ_CONFIG_FILE" >/dev/null <<EOF
# FU-OJ Configuration
# DO NOT MODIFY THIS FILE MANUALLY

$(for key in "${!config[@]}"; do echo "$key=${config[$key]}"; done)

EOF
