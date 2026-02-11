@echo off
echo ========================================
echo  Sleep Tracker - Android Dev Client Rebuild
echo ========================================
echo.

:: Set JAVA_HOME to Android Studio's bundled JDK
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
echo JAVA_HOME set to %JAVA_HOME%

:: Set ANDROID_HOME to local Android SDK
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
echo ANDROID_HOME set to %ANDROID_HOME%
echo.

:: Kill any process using port 8081 (Metro bundler)
echo [1/4] Freeing port 8081...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo       Killing PID %%a
    taskkill /PID %%a /F >nul 2>&1
)
echo       Port 8081 is free
echo.

:: Clean Android build artifacts
echo [2/4] Cleaning Android build...
if exist android\app\build (
    rmdir /s /q android\app\build
    echo       Removed android\app\build
) else (
    echo       No build directory to clean
)

if exist android\.gradle (
    rmdir /s /q android\.gradle
    echo       Removed android\.gradle
) else (
    echo       No .gradle directory to clean
)

echo.

:: Install JS dependencies
echo [3/4] Installing dependencies...
call npm install
echo.

:: Build and run Android dev client
echo [4/4] Building Android dev client...
call npx expo run:android

echo.
echo ========================================
echo  Done!
echo ========================================
