#!/bin/sh
set -e

echo "✅ Database is healthy, running seed script once..."

pnpm run seed:country

echo "🚀 Starting backend app..."

pnpm start && pnpm doc