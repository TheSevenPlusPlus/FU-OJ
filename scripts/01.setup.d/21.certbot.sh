#!/usr/bin/env bash

sudo apt-get remove -y certbot python3-certbot python3-certbot-nginx

sudo apt-get update
sudo apt-get install -y python3 python3-venv libaugeas0

sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip

sudo /opt/certbot/bin/pip install certbot certbot-nginx

sudo ln -sf /opt/certbot/bin/certbot /usr/bin/certbot
