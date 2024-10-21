#!/usr/bin/env bash
# This script is used to set up the ASP.NET Core environment for FU-OJ

# Install the Microsoft package repository
sudo apt-get install -y dotnet-sdk-8.0 aspnetcore-runtime-8.0
dotnet tool install -g dotnet-ef
