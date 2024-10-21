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

if [ -z "$CERTBOT_EMAIL" ]; then
    echo "CERTBOT_EMAIL is not set."
    exit 1
fi

if [ -z "$FUOJ_CLIENT_URL" ]; then
    echo "FUOJ_CLIENT_URL is not set."
    exit 1
fi

if ! sudo systemctl is-active nginx; then
    echo "Nginx is not running."
    exit 1
fi

sudo certbot \
    --non-interactive \
    --agree-tos \
    --email "$CERTBOT_EMAIL" \
    --domains "${CERTBOT_DOMAIN:-$FUOJ_CLIENT_URL}" \
    --domains "*.${CERTBOT_DOMAIN:-$FUOJ_CLIENT_URL}" \
    --nginx

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
