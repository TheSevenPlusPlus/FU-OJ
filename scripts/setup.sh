#!/usr/bin/env bash
# This script is used to set up the environment for FU-OJ

load_env() {
    local env_file="$1"
    if [ -f "$env_file" ]; then
        while IFS='=' read -r key value; do
            if [[ ! "$key" =~ ^# && -n "$key" ]]; then
                export "$key=$value"
            fi
        done <"$env_file"
    fi
}

for script in scripts/setup.d/*.sh; do
    echo "Running $script"
    source "$script"
done
