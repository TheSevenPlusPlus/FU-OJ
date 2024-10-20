#!/usr/bin/env bash
# This script is used to set up configurations for FU-OJ

sudo mkdir -p /etc/fuoj
sudo chown -R fuoj:fuoj /etc/fuoj
cp -r /usr/src/fuoj/config/* /etc/fuoj/

sudo mkdir -p /var/www/fuoj
sudo chown -R fuoj:fuoj /var/www/fuoj
