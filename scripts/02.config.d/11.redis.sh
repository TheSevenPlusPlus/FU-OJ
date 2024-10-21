#!/usr/bin/env bash

CONFIG_DIR=${1:-"/etc/fuoj"}
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Directory $CONFIG_DIR does not exist."
    exit 1
fi

FUOJ_CONFIG_FILE="$CONFIG_DIR/fuoj.conf"

if [ ! -f "$FUOJ_CONFIG_FILE" ]; then
    echo "File $FUOJ_CONFIG_FILE does not exist."
    exit 1
fi

while IFS='=' read -r key value; do
    if [[ ! "$key" =~ ^# && -n "$key" ]]; then
        export "$key=$value"
    fi
done <"$FUOJ_CONFIG_FILE"

# Redis
sudo -u redis redis-cli config set requirepass "$REDIS_PASSWORD"
sudo -u redis redis-cli config set include /etc/redis/redis.d/*.conf
sudo -u redis mkdir -p /etc/redis/redis.d
sudo -u redis ln -s /etc/fuoj/redis.conf /etc/redis/redis.d/fuoj.conf

if ! sudo systemctl is-enabled redis-server; then
    sudo systemctl enable redis-server
fi

if ! sudo systemctl is-active redis-server; then
    sudo systemctl start redis-server
else
    sudo systemctl restart redis-server
fi
