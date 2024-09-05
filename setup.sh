#!/bin/sh

mkdir src/temp

touch .env

yarn install

docker compose up -d