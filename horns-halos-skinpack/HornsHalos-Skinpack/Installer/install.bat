@echo off
REM Horns & Halos Skinpack Installer
REM Run as Administrator

powershell.exe -ExecutionPolicy Bypass -File "%~dp0Install-Skinpack.ps1" %*

pause
