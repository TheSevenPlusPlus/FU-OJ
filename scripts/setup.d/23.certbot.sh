#!/usr/bin/env bash
# This script is used to set up the Certbot (Nginx) environment for FU-OJ

sudo apt-get install -y python3 python3-venv libaugeas0
sudo apt-get remove -y certbot

sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip

sudo /opt/certbot/bin/pip install certbot certbot-nginx

sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot

sudo certbot --domains "fuoj.tech" --nginx --non-interactive --agree-tos --email "thesevenplusplus@gmail.com"

sudo systemctl reload nginx

echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab >/dev/null
