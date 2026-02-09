#!/bin/sh
set -e

# Force redeploy check
echo "--- Entrypoint Script Starting ---"

if [ -z "$DB_URL" ]; then
    echo "ERROR: DB_URL environment variable is MISSING!"
    echo "Available keys:"
    env | cut -d= -f1
else
    echo "DB_URL is present. Original length: ${#DB_URL}"
fi

# Check for Render's postgres:// or postgresql:// format and convert to jdbc:postgresql://
# We use sed to strictly replace the start of the string
echo "Checking URL format..."
CURRENT_URL="$DB_URL"
# Replace postgres:// or postgresql:// with jdbc:postgresql://
NEW_URL=$(echo "$CURRENT_URL" | sed -E 's|^postgres(ql)?://|jdbc:postgresql://|')

if [ "$NEW_URL" != "$CURRENT_URL" ]; then
    echo "Detected Render URL format. Updating to JDBC format..."
    export DB_URL="$NEW_URL"
else
    echo "URL format appears compatible or unchanged."
fi

# Print protocol for verification (without revealing credentials)
case "$DB_URL" in
    jdbc:postgresql://*) echo "Final Protocol: jdbc:postgresql://" ;;
    *) echo "WARNING: Final URL does not start with jdbc:postgresql://. Value starts with: $(echo "$DB_URL" | cut -c 1-10)..." ;;
esac

echo "Starting Spring Boot Application..."
exec java -jar app.jar
