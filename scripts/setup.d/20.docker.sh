#!/usr/bin/env bash
# This script is used to set up the Docker environment for FU-OJ

curl -fsSL https://get.docker.com | sudo -E bash -
sudo chmod a+rw /var/run/docker.sock
