# AutoHotkey Switcher Compilation Guide

## Prerequisites
1. Install AutoHotkey v2: https://www.autohotkey.com/
2. Ensure `Ahk2Exe.exe` is in PATH (installed with AutoHotkey)

## Compile
```cmd
Ahk2Exe.exe /in "switcher.ahk" /out "switcher.exe" /bin "C:\Program Files\AutoHotkey\AutoHotkey64.exe" /icon "Icons\switcher.ico"
```

## Install
1. Copy `switcher.exe` to startup folder:
   `shell:startup` (Win+R → shell:startup)
2. Or create scheduled task: Run at logon, highest privileges

## Required Assets
Place these in `AutoHotkey\Icons\`:
- `switcher.ico` - Main tray icon (dual theme)
- `horns_tray.ico` - HORNS tray icon
- `halos_tray.ico` - HALOS tray icon
- `default_tray.ico` - Fallback

Place sound files in `AutoHotkey\Sounds\`:
- `HORNS	ransmute.wav`
- `HALOS	ransmute.wav`

## Configuration
Settings stored in `duality.ini`:
- CurrentTheme: HORNS/HALOS
- TransitionMs: 1500
- SyncRainmeter/Wallpaper/Cursors/Sounds/WindowBlinds/Accent: 1/0

## Notes
- Requires Rainmeter, Wallpaper Engine, WindowBlinds installed
- Cursor/Sound schemes need .inf/.reg installation (run as admin once)
- WindowBlinds requires Stardock WindowBlinds installed
