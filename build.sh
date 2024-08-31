#!/bin/bash

FILE="./services/api.ts"
PATTERN="from '\.\./server/[0-9]*';"
REPLACEMENT="from '../server/$1';"

echo "Building $1"

echo "Original line:"
grep -E "$PATTERN" "$FILE"

sed -i -E "s|$PATTERN|$REPLACEMENT|g" "$FILE"

echo "Modified line:"
grep -E "$REPLACEMENT" "$FILE"

next build
