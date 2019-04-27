#!/bin/bash

set -eux

rm -rf node_modules
npm install --unsafe-perm
git submodule init && git submodule update