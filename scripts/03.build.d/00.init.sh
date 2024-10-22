#!/usr/bin/env bash

SOURCE_DIR=/usr/src/fuoj

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: $SOURCE_DIR does not exist."
    exit 1
else
    cd "$SOURCE_DIR" || exit 1
fi

git stash
git pull origin main
git stash pop
