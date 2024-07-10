#!/bin/bash

echo "Starting debug script..."

# Print environment variables
echo "Environment Variables:"
printenv

# List current directory contents
echo "Current Directory Contents:"
ls -l /usr/src/app

# Attempt to start the Flask app and capture output
echo "Starting Flask app..."
python3 app.py &

# Sleep to allow the app to start and log output
sleep 30

# Capture logs and process output
echo "Logs:"
cat /usr/src/app/logfile.log

# Exit to trigger container stop
echo "Debug script completed."
exit 1
