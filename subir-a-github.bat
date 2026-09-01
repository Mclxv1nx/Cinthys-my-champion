@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

set REPO=https://github.com/Mclxv1nx/Cinthys-my-champion.git

echo.
echo ============================================
echo   Subiendo la pagina de Cinthy a GitHub
echo ============================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [X] No tienes Git instalado.
  echo     Bajalo de https://git-scm.com/download/win y vuelve a correr esto.
  echo.
  pause
  exit /b 1
)

if not exist ".git" (
  echo ^> Iniciando el repositorio...
  git init -b main
) else (
  echo ^> El repositorio ya existe, sigo.
  git checkout -B main
)

rem  Si nunca configuraste git, le ponemos nombre y correo solo para este proyecto.
git config user.name  >nul 2>nul || git config user.name  "Adrian Urresta"
git config user.email >nul 2>nul || git config user.email "sanchezadrianu@gmail.com"

echo ^> Agregando archivos...
git add -A

echo ^> Guardando el commit...
git commit -m "Landing para Cinthy" || echo    (no habia nada nuevo que guardar, sigo)

echo ^> Apuntando al repositorio...
git remote remove origin >nul 2>nul
git remote add origin %REPO%

echo ^> Subiendo...
echo.
echo   Si te pide iniciar sesion, se abre el navegador. Entra con tu
echo   cuenta de GitHub (Mclxv1nx) y autoriza. Solo pasa la primera vez.
echo.
git push -u origin main

if errorlevel 1 (
  echo.
  echo [X] El push fallo. Lo mas comun:
  echo     - Cancelaste el inicio de sesion.
  echo     - El repo ya tiene commits. En ese caso corre esto y vuelve a intentar:
  echo         git pull origin main --allow-unrelated-histories
  echo.
) else (
  echo.
  echo [OK] Listo. Revisa https://github.com/Mclxv1nx/Cinthys-my-champion
  echo.
)

pause
endlocal
