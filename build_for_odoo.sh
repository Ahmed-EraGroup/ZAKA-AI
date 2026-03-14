#!/usr/bin/env bash
# build_for_odoo.sh
# Builds the React app and copies output into the Odoo module's static/dist folder.

set -e

echo "🔨 Building React app for Odoo..."
npm run build

echo "📦 Copying dist/ → zaka_website/static/dist/ ..."
rm -rf zaka_website/static/dist
cp -r dist zaka_website/static/dist

echo "✅ Done! Copy the zaka_website/ folder to your Odoo addons path, then:"
echo "   1. Activate developer mode in Odoo"
echo "   2. Apps → Update Apps List"
echo "   3. Search for 'Zaka' and Install"
