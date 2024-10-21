#!/usr/bin/env bash
# This script is used to set up configurations for FU-OJ

tee /etc/fuoj/default/secrets.conf >/dev/null <<EOF
POSRGRES_DEFAULT_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)
POSTGRES_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)
REDIS_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)
JWT_SECRET=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)
EOF

chmod 660 /etc/fuoj/secrets.conf
