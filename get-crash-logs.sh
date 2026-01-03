#!/bin/bash

echo "=== AmrutDhara Crash Log Collector ==="
echo ""
echo "1. Clearing logcat..."
adb logcat -c

echo "2. Monitoring for crashes. Install and launch the app now..."
echo "   Press Ctrl+C when the app crashes"
echo ""

# Monitor logcat for crashes
adb logcat | grep --line-buffered -E "amrutdhara|AmrutDhara|com.amrutdhara|FATAL|AndroidRuntime" | while read line; do
    echo "$line"
    # Save to file
    echo "$line" >> crash-log.txt
done
