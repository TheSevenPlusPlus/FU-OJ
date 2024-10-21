#!/usr/bin/env bash
# This script is used to build the FU-OJ project
SRCROOT=/usr/src/fuoj
OUTDIR=/var/www/fuoj
ENVFILE=/etc/fuoj/fuoj.env

if [ -f "$ENVFILE" ]; then
    while IFS='=' read -r key value; do
        if [[ ! "$key" =~ ^# && -n "$key" ]]; then
            export "$key=$value"
        fi
    done <"$ENVFILE"
fi

cd $SRCROOT || exit 1
git stash
git pull

cd $SRCROOT/fu.oj.client/ || exit 1
npm install
npm run build

cd $SRCROOT/FU.OJ.Server/ || exit 1
cp -r $SRCROOT/fu.oj.client/dist $SRCROOT/FU.OJ.Server/wwwroot
dotnet publish -c Release -o $OUTDIR
dotnet ef database update
