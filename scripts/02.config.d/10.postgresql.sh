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

# PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '$POSTGRES_DEFAULT_PASSWORD';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$POSTGRES_USER'" | grep -q 1 ||
    sudo -u postgres psql -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"
sudo -u postgres psql -c "ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'" | grep -q 1 ||
    sudo -u postgres psql -c "CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER;"
sudo -u postgres psql -c "ALTER DATABASE $POSTGRES_DB OWNER TO $POSTGRES_USER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"

echo "include_dir = '/etc/postgresql/16/main/postgresql.conf.d'" | sudo -u postgres tee -a /etc/postgresql/16/main/postgresql.conf
sudo -u postgres mkdir -p /etc/postgresql/16/main/postgresql.conf.d
sudo -u postgres ln -sf /etc/fuoj/postgresql.conf /etc/postgresql/16/main/postgresql.conf.d/fuoj.conf

echo "include_dir /etc/postgresql/16/main/pg_hba.conf.d" | sudo -u postgres tee -a /etc/postgresql/16/main/pg_hba.conf
sudo -u postgres mkdir -p /etc/postgresql/16/main/pg_hba.conf.d
sudo -u postgres ln -sf /etc/fuoj/pg_hba.conf /etc/postgresql/16/main/pg_hba.conf.d/fuoj.conf

if ! sudo systemctl is-enabled postgresql; then
    sudo systemctl enable postgresql
fi

if ! sudo systemctl is-active postgresql; then
    sudo systemctl start postgresql
else
    sudo systemctl restart postgresql
fi
