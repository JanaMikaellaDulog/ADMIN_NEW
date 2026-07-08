#!/bin/bash
# ============================================
# Imperial DB Auto-Import Script (Server/Linux)
# Patakbuhin sa loob ng PuTTY pagkatapos ng git pull
# ============================================

DB_NAME="subdivision_management"
DB_USER="root"
DB_PASS="@ImperialInterns0987"      

# Kinukuha ang folder kung saan naka-save itong script mismo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/subdivision_management.sql"
BACKUP_DIR="$SCRIPT_DIR/backups"
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

echo ""
echo "=============================="
echo "  Imperial DB Auto Importer"
echo "=============================="
echo ""

echo "[1/4] Backing up current server DB (just in case) ..."
mkdir -p "$BACKUP_DIR"
mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null
echo "      Backup saved to $BACKUP_FILE"

echo "[2/4] Dropping existing database (if any)..."
mysql -u"$DB_USER" -p"$DB_PASS" -e "DROP DATABASE IF EXISTS $DB_NAME;"

echo "[3/4] Creating fresh database..."
mysql -u"$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE $DB_NAME;"

echo "[4/4] Importing $SQL_FILE into $DB_NAME..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$SQL_FILE"

echo ""
echo "=============================="
echo "  DONE! Database updated."
echo "=============================="
echo ""
