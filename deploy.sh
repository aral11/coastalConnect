#!/bin/bash

echo "Building CoastalConnect for production..."

# Clean previous build
rm -rf dist/spa

# Build the application
npm run build:client

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! Deploy files are in dist/spa/"
    echo ""
    echo "To deploy to Netlify, you can:"
    echo "1. Use Netlify CLI: netlify deploy --prod --dir=dist/spa"
    echo "2. Or drag and drop the dist/spa folder to https://app.netlify.com/sites/coastalconnect/deploys"
    echo ""
    echo "Files ready for deployment:"
    ls -la dist/spa/
else
    echo "Build failed!"
    exit 1
fi
