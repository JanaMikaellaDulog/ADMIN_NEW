#!/bin/bash
# ============================================
# Imperial DB Auto-Export Script (Server/Linux)
# Patakbuhin sa loob ng PuTTY/SSH kapag may
# bagong data na idinagdag directly sa live server
# na kailangan i-sync pabalik sa git.
# ============================================

DB_NAME="subdivision_management"
DB_USER="root"
DB_PASS=""          # ilagay dito password ng MySQL user sa server (kung meron)

# Kinukuha ang folder kung saan naka-save itong script mismo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/subdivision_management.sql"

echo ""
echo "=============================="
echo "  Imperial DB Auto Exporter"
echo "=============================="
echo ""

echo "Exporting $DB_NAME into $SQL_FILE ..."
mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$SQL_FILE"

echo ""
echo "=============================="
echo "  DONE! SQL file updated."
echo "  Puwede mo na i-commit/push sa git:"
echo "    git add subdivision_management.sql"
echo "    git commit -m \"sync live server data\""
echo "    git push"
echo "=============================="
echo ""
