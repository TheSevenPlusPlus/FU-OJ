#!/usr/bin/env bash

CONFIG_DIR=${1:-"/etc/fuoj"}
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Directory $CONFIG_DIR does not exist."
    exit 1
fi

NGINX_CONFIG_FILE="$CONFIG_DIR/nginx.conf"

if [ ! -f "$NGINX_CONFIG_FILE" ]; then
    echo "File $NGINX_CONFIG_FILE does not exist."
    exit 1
fi

sudo ln -sf "$NGINX_CONFIG_FILE" /etc/nginx/sites-available/fuoj
sudo ln -sf /etc/nginx/sites-available/fuoj /etc/nginx/sites-enabled/fuoj

if ! sudo systemctl is-enabled nginx; then
    sudo systemctl enable nginx
fi

if ! sudo nginx -t; then
    echo "Nginx configuration is invalid."
    exit 1
else
    if ! sudo systemctl is-active nginx; then
        sudo systemctl start nginx
    else
        sudo systemctl restart nginx
    fi
fi
