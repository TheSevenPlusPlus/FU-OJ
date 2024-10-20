#!/usr/bin/env bash
# This script is used to set up configurations for FU-OJ

tee /etc/fuoj/secrets.conf >/dev/null <<EOF
POSRGRES_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)
POSTGRES_USER_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)
REDIS_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)
JWT_SECRET=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)
EOF

chmod 660 /etc/fuoj/secrets.conf
