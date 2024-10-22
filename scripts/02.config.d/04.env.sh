#!/usr/bin/env bash

CONFIG_DIR=${1:-"/etc/fuoj"}

if [ ! -d "$CONFIG_DIR" ]; then
    echo "Directory $CONFIG_DIR does not exist."
    exit 1
fi

FUOJ_CONFIG_FILE="$CONFIG_DIR/fuoj.conf"
FUOJ_ENV_FILE="$CONFIG_DIR/fuoj.env"

if [ ! -f "$FUOJ_CONFIG_FILE" ]; then
    echo "File $FUOJ_CONFIG_FILE does not exist."
    exit 1
else
    while IFS='=' read -r key value; do
        if [[ ! "$key" =~ ^# && -n "$key" ]]; then
            export "$key=$value"
        fi
    done <"$FUOJ_CONFIG_FILE"
fi

tee "$FUOJ_ENV_FILE" >/dev/null <<EOF
# FU-OJ Environment Variables
# DO NOT MODIFY THIS FILE MANUALLY

ClientUrl=${FUOJ_CLIENT_URL}
JudgeServerUrl=${JUDGE0_SERVER_URL}
ConnectionStrings__PostgreSQL=Host=${POSTGRES_HOST};Port=${POSTGRES_PORT};Database=${POSTGRES_DB};Username=${POSTGRES_USER};Password=${POSTGRES_PASSWORD};
JWT__Issuer=${FUOJ_CLIENT_URL}
JWT__Audience=${FUOJ_CLIENT_URL}
JWT__SigningKey=${JWT_SECRET}
EmailSettings__SenderName=${EMAIL_SENDER_NAME}
EmailSettings__SenderEmail=${EMAIL_SENDER_EMAIL}
EmailSettings__SmtpServer=${EMAIL_SMTP_HOST}
EmailSettings__SmtpPort=${EMAIL_SMTP_PORT}
EmailSettings__SmtpUsername=${EMAIL_SMTP_USERNAME}
EmailSettings__SmtpPassword=${EMAIL_SMTP_PASSWORD}

EOF
