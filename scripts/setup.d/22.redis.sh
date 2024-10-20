#!/usr/bin/env bash
# This script is used to set up the Redis Server for FU-OJ

sudo apt-get install lsb-release curl gpg
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list >/dev/null
sudo apt-get update
sudo apt-get install -y redis

load_env /etc/fuoj/secrets.conf

sudo -u redis mkdir -p /etc/redis/redis.conf.d
echo "include /etc/redis/redis.conf.d/*.conf" | sudo -u redis tee -a /etc/redis/redis.conf
sudo -u redis ln -s /etc/fuoj/redis.conf /etc/redis/redis.conf.d/fuoj.conf
sudo echo "requirepass $REDIS_PASSWORD" | sudo -u redis tee /etc/redis/redis.conf.d/security.conf

sudo systemctl enable redis-server
sudo systemctl start redis-server
