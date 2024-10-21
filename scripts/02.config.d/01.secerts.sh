#!/usr/bin/env bash

pwdgen() {
    # get length of password from first argument or default to 32
    local length=${1:-32}

    # get pattern from second argument or default to alphanumeric
    local pattern=${2:-'a-zA-Z0-9'}

    # generate password
    tr -dc "$pattern" </dev/urandom | head -c "$length"
}

CONFIG_DIR=${1:-"/etc/fuoj"}
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Directory $CONFIG_DIR does not exist."
    exit 1
fi

FUOJ_SECRETS_FILE="$CONFIG_DIR/secrets.generated.conf"

tee "$FUOJ_SECRETS_FILE" >/dev/null <<EOF
# FU-OJ Auto-generated Secrets
# DO NOT MODIFY THIS FILE MANUALLY

# PostgreSQL
POSTGRES_DEFAULT_PASSWORD=$(pwdgen 32)
POSTGRES_PASSWORD=$(pwdgen 32)

# Redis
REDIS_PASSWORD=$(pwdgen 32)

# Json Web Token
JWT_SECRET=$(pwdgen 32)

EOF
