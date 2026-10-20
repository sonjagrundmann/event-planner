#!/bin/bash
set -e

npx prisma generate
npx prisma migrate deploy

if [ "$VERCEL_ENV" = "preview" ]; then
  npx prisma db seed
fi

npx next build