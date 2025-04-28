@echo off
title Chrome Extension Scraper
echo Chrome Extension Scraper
echo ========================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python from https://www.python.org/downloads/
    echo Be sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

REM Run the scraper
python chrome_extension_scraper.py

echo.
echo Process complete. Check the output files in this directory.
echo.
pause 