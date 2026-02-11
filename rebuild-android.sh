#!/bin/bash
echo "========================================"
echo " Sleep Tracker - Android Dev Client Rebuild"
echo "========================================"
echo ""

# Set JAVA_HOME to Android Studio's bundled JDK
export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
echo "JAVA_HOME set to $JAVA_HOME"

# Set ANDROID_HOME to local Android SDK
export ANDROID_HOME="$LOCALAPPDATA/Android/Sdk"
echo "ANDROID_HOME set to $ANDROID_HOME"
echo ""

# Kill any process using port 8081 (Metro bundler)
echo "[1/4] Freeing port 8081..."
PIDS=$(netstat -ano 2>/dev/null | grep ":8081" | grep "LISTENING" | awk '{print $5}' | sort -u)
if [ -n "$PIDS" ]; then
    for PID in $PIDS; do
        echo "      Killing PID $PID"
        taskkill //PID "$PID" //F > /dev/null 2>&1
    done
else
    echo "      No process on port 8081"
fi
echo "      Port 8081 is free"
echo ""

# Clean Android build artifacts
echo "[2/4] Cleaning Android build..."
if [ -d "android/app/build" ]; then
    rm -rf android/app/build
    echo "      Removed android/app/build"
else
    echo "      No build directory to clean"
fi

if [ -d "android/.gradle" ]; then
    rm -rf android/.gradle
    echo "      Removed android/.gradle"
else
    echo "      No .gradle directory to clean"
fi
echo ""

# Install JS dependencies
echo "[3/4] Installing dependencies..."
npm install
echo ""

# Build and run Android dev client
echo "[4/4] Building Android dev client..."
npx expo run:android

echo ""
echo "========================================"
echo " Done!"
echo "========================================"