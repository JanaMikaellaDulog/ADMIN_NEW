@echo off
REM ============================================
REM Imperial DB Auto-Export Script
REM Ginagawa: kinukuha lahat ng laman ng local DB mo
REM at isinusulat papunta sa subdivision_management.sql
REM (parehong file na ginagamit ng import_db.bat)
REM ============================================

SET MYSQLDUMP_PATH=C:\xampp\mysql\bin\mysqldump.exe
SET DB_NAME=subdivision_management
SET DB_USER=root
SET DB_PASS=

SET SCRIPT_DIR=%~dp0
SET SQL_FILE=%SCRIPT_DIR%subdivision_management.sql

echo.
echo ==============================
echo   Imperial DB Auto Exporter
echo ==============================
echo.

echo Exporting %DB_NAME% into %SQL_FILE% ...
"%MYSQLDUMP_PATH%" -u%DB_USER% %DB_NAME% > "%SQL_FILE%"

echo.
echo ==============================
echo   DONE! SQL file updated.
echo   Puwede mo na i-commit/push sa git.
echo ==============================
echo.
pause
