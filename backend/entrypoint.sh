#!/bin/sh
set -e

echo "--- Entrypoint Script Starting ---"

if [ -z "$DB_URL" ]; then
    echo "ERROR: DB_URL environment variable is MISSING!"
    exit 1
fi

echo "Original DB_URL length: ${#DB_URL}"

# 1. Convert postgres:// -> jdbc:postgresql://
# 2. Strip user:password@ authority section (Driver doesn't support it in jdbc:postgresql://)
# Regex explanation:
# s|^postgres(?:ql)?://|jdbc:postgresql://|  -> Replace protocol
# s|//[^@]*@|//|                             -> Remove everything between // and @ (the user:pass part)

CLEAN_URL=$(echo "$DB_URL" | sed -E 's|^postgres(ql)?://|jdbc:postgresql://|' | sed -E 's|//[^@]+@|//|')

if [ "$CLEAN_URL" != "$DB_URL" ]; then
    echo "Sanitized DB_URL for JDBC compliance (stripped user info & fixed protocol)."
    export DB_URL="$CLEAN_URL"
fi

# Print safe part of URL
echo "Final DB_URL (safe): $(echo "$DB_URL" | sed 's|//.*@|//***@|')"

# Check for separate credentials (required since we stripped them from URL)
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
    echo "WARNING: DB_USER or DB_PASSWORD is missing! "
    echo "Ensure these are set in Render Dashboard Environment Variables."
fi

echo "Starting Spring Boot..."
# Memory: 256m Heap + JVM overhead fits comfortably in 512m container
exec java -Xms128m -Xmx256m -jar app.jar
