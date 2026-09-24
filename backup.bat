@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   JV GOLD ^& CO LLC - BACKUP SCRIPT (WINDOWS)
echo ===================================================

:: Configurar variables
set BACKUP_DIR=backups
set TIMESTAMP=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set CURRENT_BACKUP_DIR=%BACKUP_DIR%\backup_%TIMESTAMP%

echo [1/4] Creando directorio de respaldo: %CURRENT_BACKUP_DIR%
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
mkdir "%CURRENT_BACKUP_DIR%"

echo [2/4] Respaldando Base de Datos PostgreSQL...
:: Asegurate de que pg_dump este en tu PATH
:: Puedes usar DATABASE_URL desde .env o variables quemadas para el volcado
set DB_URL="postgresql://postgres:postgres@localhost:5432/jewelry_prime?schema=public"
pg_dump %DB_URL% -F c -b -v -f "%CURRENT_BACKUP_DIR%\database.backup"
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo respaldar la base de datos.
) else (
    echo [OK] Base de datos respaldada.
)

echo [3/4] Respaldando Archivos Subidos (Uploads)...
if exist "backend\uploads" (
    xcopy /E /I /H /Y "backend\uploads" "%CURRENT_BACKUP_DIR%\uploads" >nul
    echo [OK] Archivos multimedia respaldados.
) else if exist "uploads" (
    xcopy /E /I /H /Y "uploads" "%CURRENT_BACKUP_DIR%\uploads" >nul
    echo [OK] Archivos multimedia respaldados.
) else (
    echo [INFO] No se encontro directorio de uploads.
)

echo [4/4] Respaldando Configuracion del Entorno (.env)...
if exist "backend\.env" (
    copy "backend\.env" "%CURRENT_BACKUP_DIR%\backend.env" >nul
    echo [OK] .env respaldado.
) else (
    echo [INFO] No se encontro backend\.env.
)

echo ===================================================
echo   RESPALDO COMPLETADO EN: %CURRENT_BACKUP_DIR%
echo ===================================================
pause
