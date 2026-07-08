@echo off
REM ============================================
REM Imperial DB Auto-Import Script
REM ============================================

SET MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
SET DB_NAME=subdivision_management
SET DB_USER=root
SET DB_PASS=

REM %~dp0 = folder kung saan naka-save itong .bat file mismo
REM kaya kahit iba-iba ang path ng bawat isa (Cath, teammate, etc), gagana pa rin
SET SCRIPT_DIR=%~dp0
SET SQL_FILE=%SCRIPT_DIR%subdivision_management.sql

echo.
echo ==============================
echo   Imperial DB Auto Importer
echo ==============================
echo.

echo [1/3] Dropping existing database (if any)...
"%MYSQL_PATH%" -u%DB_USER% -e "DROP DATABASE IF EXISTS %DB_NAME%;"

echo [2/3] Creating fresh database...
"%MYSQL_PATH%" -u%DB_USER% -e "CREATE DATABASE %DB_NAME%;"

echo [3/3] Importing %SQL_FILE% into %DB_NAME%...
"%MYSQL_PATH%" -u%DB_USER% %DB_NAME% < "%SQL_FILE%"

echo.
echo ==============================
echo   DONE! Database updated.
echo ==============================
echo.
pause