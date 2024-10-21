#!/usr/bin/env bash
# This script is used to add the systemd service for FU-OJ

sudo ln -sf /etc/fuoj/systemd/fuoj.service /etc/systemd/system/fuoj.service
sudo systemctl daemon-reload
sudo systemctl enable fuoj
sudo systemctl start fuoj
