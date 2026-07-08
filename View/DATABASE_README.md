# Imperial Homes — Database Import/Export Guide

This covers how to sync `subdivision_management.sql` between your local machine (Windows/XAMPP) and the live server, using the provided scripts.

> ⚠️ **Note (per Sir Jeff):** The `.sh` server scripts are a **temporary solution for the demo phase only**. We will be moving to a different database platform later, and this drop-and-reimport workflow will be replaced at that point.

---

## Golden Rule

**Always EXPORT → commit → push *before* you PULL → IMPORT.**

Import always wipes and replaces the target database. If you import without exporting your own changes first, whatever wasn't pushed to git will be lost (aside from the automatic backup safety net on the server — see below).

Quick way to remember it:
- **Export** = save your current DB state **out** to the `.sql` file
- **Import** = wipe the DB and load someone else's state **in** from the `.sql` file

---

## 🖥️ Local Setup (Windows / XAMPP) — `.bat` files

### Requirements
- XAMPP installed with MySQL running
- `root` user with a **blank password** (default XAMPP setup)
- `export_db.bat`, `import_db.bat`, and `subdivision_management.sql` in the same folder

### Export (save your local DB changes)
1. Make your changes locally via phpMyAdmin / the app.
2. Double-click **`export_db.bat`**.
3. This overwrites `subdivision_management.sql` in the same folder with your current local DB.
4. Push it to git:
   ```
   git add subdivision_management.sql
   git commit -m "export local changes"
   git push
   ```

### Import (load the latest DB from git)
1. `git pull` first to get the latest `.sql` file.
2. Double-click **`import_db.bat`**.
3. This drops your local `subdivision_management` DB, recreates it, and imports the `.sql` file fresh.

### What's happening under the hood
| Script | Command it runs |
|---|---|
| Export | `mysqldump -uroot subdivision_management > subdivision_management.sql` |
| Import (drop) | `mysql -uroot -e "DROP DATABASE IF EXISTS subdivision_management;"` |
| Import (create) | `mysql -uroot -e "CREATE DATABASE subdivision_management;"` |
| Import (load) | `mysql -uroot subdivision_management < subdivision_management.sql` |

---

## 🌐 Server Setup (Linux / PuTTY / SSH) — `.sh` files — **TEMPORARY, DEMO ONLY**

### Requirements
- SSH/PuTTY access to the server
- `export_db_server.sh` and `import_db_server.sh` made executable once:
  ```
  chmod +x export_db_server.sh import_db_server.sh
  ```

### Export (pull live server data back into git)
1. SSH into the server.
2. `cd` into the scripts' folder.
3. Run:
   ```
   ./export_db_server.sh
   ```
4. This overwrites `subdivision_management.sql` **on the server** with the current live data.
5. Commit and push (from the server, or download the file and push from your machine):
   ```
   git add subdivision_management.sql
   git commit -m "sync live server data"
   git push
   ```

### Import (update the live server with the latest git version)
1. `git pull` on the server first.
2. Run:
   ```
   ./import_db_server.sh
   ```
3. This automatically:
   - Backs up the current live DB into a timestamped file under `backups/` (safety net)
   - Drops the existing database
   - Recreates it
   - Imports `subdivision_management.sql` fresh

### What's happening under the hood
| Script | Command it runs |
|---|---|
| Export | `mysqldump -uroot -p subdivision_management > subdivision_management.sql` |
| Import (backup) | `mysqldump -uroot -p subdivision_management > backups/backup_<timestamp>.sql` |
| Import (drop) | `mysql -uroot -p -e "DROP DATABASE IF EXISTS subdivision_management;"` |
| Import (create) | `mysql -uroot -p -e "CREATE DATABASE subdivision_management;"` |
| Import (load) | `mysql -uroot -p subdivision_management < subdivision_management.sql` |

---

## Quick Reference

| I want to... | Where | Run |
|---|---|---|
| Save my local changes | Windows | `export_db.bat` |
| Load latest DB locally | Windows | `import_db.bat` |
| Save live server changes | Server | `./export_db_server.sh` |
| Load latest DB on server | Server | `./import_db_server.sh` |

---

## ⚠️ Reminders

- These scripts assume `root` with a **blank password** everywhere (local and server). If anyone's MySQL setup differs, the scripts (and `db_connect.php`) will fail with an access error.
- Import **always destroys and replaces** the target database — there is no merge. Export/push first, always.
- The server `.sh` scripts are a **demo-phase workaround**. Once the team moves to a different DB platform, this entire import/export process will be replaced with that platform's proper migration/backup tools.
