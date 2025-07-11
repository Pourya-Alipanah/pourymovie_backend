#!/bin/sh

echo "✅ Database is healthy, running seed script once..."

pnpm seed:country

echo "🚀 Starting backend app..."

pnpm start:prod
