#!/usr/bin/env bash
# This script is used to set up the Nginx environment for FU-OJ

sudo apt-get install -y nginx

sudo ln -s /etc/fuoj/nginx.conf /etc/nginx/conf.d/fuoj.conf

sudo systemctl enable nginx
sudo systemctl start nginx
