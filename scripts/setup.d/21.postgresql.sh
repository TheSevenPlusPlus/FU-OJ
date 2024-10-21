#!/usr/bin/env bash
# This script is used to set up PostgreSQL for FU-OJ

sudo apt-get install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -i -p -v 16

load_env /etc/fuoj/default/secerts.conf

sudo -u postgres psql -c "ALTER USER postgres PASSWORD '$POSTGRES_PASSWORD';"
sudo -u postgres psql -c "CREATE USER fuoj WITH PASSWORD '$POSTGRES_USER_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE fuoj_db OWNER fuoj;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fuoj_db TO fuoj;"
sudo -u postgres psql -c "CREATE DATABASE fuoj_judge_db OWNER fuoj;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fuoj_judge_db TO fuoj;"

sudo -u postgres mkdir -p /etc/postgresql/16/main/postgresql.conf.d
echo "include_dir = '/etc/postgresql/16/main/postgresql.conf.d'" | sudo -u postgres tee -a /etc/postgresql/16/main/postgresql.conf
sudo -u postgres ln -s /etc/fuoj/postgresql.conf /etc/postgresql/16/main/postgresql.conf.d/fuoj.conf

sudo -u postgres mkdir -p /etc/postgresql/16/main/pg_hba.conf.d
echo "include_dir '/etc/postgresql/16/main/pg_hba.conf.d'" | sudo -u postgres tee -a /etc/postgresql/16/main/pg_hba.conf
sudo -u postgres ln -s /etc/fuoj/pg_hba.conf /etc/postgresql/16/main/pg_hba.conf.d/fuoj.conf

sudo systemctl enable postgresql
sudo systemctl start postgresql
