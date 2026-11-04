@echo off
title Farejador Games
cd /d "%~dp0"
echo Iniciando Farejador Games...
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8000
  py -m http.server 8000
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "" http://localhost:8000
    python -m http.server 8000
  ) else (
    echo Python nao foi encontrado. Instale o Python 3 e tente novamente.
    pause
  )
)
