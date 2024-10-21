#!/usr/bin/env bash

SCRIPT_ROOT=$(dirname "$(realpath "$0")")

sudo apt-get update && sudo apt-get upgrade -y

for script in "$SCRIPT_ROOT/01.setup.d"/*; do
    bash "$script"
done

for script in "$SCRIPT_ROOT/02.config.d"/*; do
    bash "$script"
done
