#!/usr/bin/env bash

sudo apt remove -y "dotnet-*" "aspnetcore-*" "netstandard-*"

sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0 aspnetcore-runtime-8.0
