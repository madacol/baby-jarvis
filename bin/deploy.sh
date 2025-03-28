#!/bin/bash

set -e

npm run build

echo "Deploying..."
npx gh-pages -d './build' --nojekyll
