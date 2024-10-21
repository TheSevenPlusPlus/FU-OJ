#!/usr/bin/env bash
# This script is used to generate the environment variables file for FU-OJ

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

# read `fuoj.conf`
load_env /etc/fuoj/fuoj.conf

# write to `fuoj.env`
tee /etc/fuoj/fuoj.env >/dev/null <<EOF
# FU-OJ Auto-generated Environment Variables
# DO NOT MODIFY THIS FILE MANUALLY

ClientUrl=${FUOJ_CLIENT_URL}
JudgeServerUrl=${JUDGE0_SERVER_URL}
ConnectionStrings__PostgreSQL=Host=${POSTGRES_HOST};Port=${POSTGRES_PORT};Database=${POSTGRES_DB};Username=${POSTGRES_USER};Password=${POSTGRES_PASSWORD};
ConnectionStrings__Redis=${REDIS_HOST}:${REDIS_PORT},password=${REDIS_PASSWORD}
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

chmod 660 /etc/fuoj/fuoj.env
