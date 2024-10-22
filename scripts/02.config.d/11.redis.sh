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

redis_version=$(redis-server --version | awk '{print $3}' | cut -d'=' -f2 | cut -d'.' -f1-2)

# Redis
# remove current password
if ! sudo systemctl is-active redis-server; then
    sudo systemctl stop redis-server
fi
sudo -u redis curl -sL "https://raw.githubusercontent.com/redis/redis/$redis_version/redis.conf" -o /etc/redis/redis.conf

sudo systemctl start redis-server

sudo -u redis redis-cli config set requirepass "$REDIS_PASSWORD"
sudo -u redis redis-cli config set include /etc/redis/redis.d/*.conf
sudo -u redis mkdir -p /etc/redis/redis.d
sudo -u redis ln -s /etc/fuoj/redis.conf /etc/redis/redis.d/fuoj.conf
sudo -u redis redis-cli config rewrite

if ! sudo systemctl is-enabled redis-server; then
    sudo systemctl enable redis-server
fi

if ! sudo systemctl is-active redis-server; then
    sudo systemctl start redis-server
else
    sudo systemctl restart redis-server
fi
