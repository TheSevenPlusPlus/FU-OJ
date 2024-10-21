#!/usr/bin/env bash
# This script is used to generate the config file for FU-OJ

# merge 'secrets.conf and default.conf' to fuoj.conf (overwrite the default value)

SOURCES=(
    /etc/fuoj/default/secrets.conf
    /etc/fuoj/default/fuoj.conf
)

DESTINATION=/etc/fuoj/fuoj.conf

declare -A env_vars

for file in "${SOURCES[@]}"; do
    if [ -f "$file" ]; then
        while IFS='=' read -r key value; do
            if [[ ! "$key" =~ ^# && -n "$key" ]]; then
                env_vars["$key"]="$value"
            fi
        done <"$file"
    fi
done

# write to `fuoj.conf`
tee "$DESTINATION" >/dev/null <<EOF
# FU-OJ Auto-generated Configuration
# DO NOT MODIFY THIS FILE MANUALLY

$(for key in "${!env_vars[@]}"; do echo "$key=${env_vars[$key]}"; done)
EOF

chmod 660 "$DESTINATION"
