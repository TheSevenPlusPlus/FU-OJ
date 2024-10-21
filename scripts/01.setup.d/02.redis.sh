#!/usr/bin/env bash
# This script is used to set up PostgreSQL for FU-OJ

sudo add-apt-repository -y ppa:redislabs/redis

sudo apt-get update
sudo apt-get install -y redis

sudo systemctl enable redis
