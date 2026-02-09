#!/bin/sh

# Render provides DB_URL as 'postgres://user:pass@host:port/dbname'
# Spring Boot needs 'jdbc:postgresql://host:port/dbname?user=user&password=pass' or separate user/pass
# Since we provide DB_USER and DB_PASSWORD separately in render.yaml, we just need to fix the protocol prefix.

if echo "$DB_URL" | grep -q "^postgres://"; then
  echo "Detected 'postgres://' URL from Render. Converting to 'jdbc:postgresql://'..."
  # Replace 'postgres://' with 'jdbc:postgresql://'
  export DB_URL="jdbc:postgresql://${DB_URL#postgres://}"
fi

echo "Starting application with DB_URL: $DB_URL"
exec java -jar app.jar
