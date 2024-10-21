#!/usr/bin/env bash

CONFIG_DIR=${1:-"/etc/fuoj"}
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Directory $CONFIG_DIR does not exist."
    exit 1
fi

JUDGE0_DEFAULT_CONFIG_FILE="$CONFIG_DIR/judge0.default.conf"
JUDGE0_OVERRIDE_CONFIG_FILE="$CONFIG_DIR/judge0.override.conf"
FUOJ_CONFIG_FILE="$CONFIG_DIR/fuoj.conf"
JUDGE0_CONFIG_FILE="$CONFIG_DIR/judge0.conf"

declare -A config
if [ ! -f "$JUDGE0_DEFAULT_CONFIG_FILE" ]; then
    echo "File $JUDGE0_DEFAULT_CONFIG_FILE does not exist."
    exit 1
else
    while IFS='=' read -r key value; do
        if [[ ! "$key" =~ ^# && -n "$key" ]]; then
            config["$key"]="$value"
        fi
    done <"$JUDGE0_DEFAULT_CONFIG_FILE"

    while IFS='=' read -r key value; do
        if [[ ! "$key" =~ ^# && -n "$key" ]]; then
            config["$key"]="$value"
        fi
    done <"$FUOJ_CONFIG_FILE"

    if [ -f "$JUDGE0_OVERRIDE_CONFIG_FILE" ]; then
        while IFS='=' read -r key value; do
            if [[ ! "$key" =~ ^# && -n "$key" ]]; then
                config["$key"]="$value"
            fi
        done <"$JUDGE0_OVERRIDE_CONFIG_FILE"
    fi
fi

tee "$JUDGE0_CONFIG_FILE" >/dev/null <<EOF
# Judge0 Configuration
# DO NOT MODIFY THIS FILE MANUALLY

$(for key in "${!config[@]}"; do echo "$key=${config[$key]}"; done)

EOF
