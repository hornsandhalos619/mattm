<#
.SYNOPSIS
    Horns & Halos Skinpack Installer
.DESCRIPTION
    Deploys the complete Horns & Halos duality skinpack
.NOTES
    Run as Administrator for full installation
#>

param(
    [switch]$Minimal,
    [switch]$Force,
    [string]$InstallPath = "$env:USERPROFILE\HornsHalos"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     HORNS & HALOS SKINPACK INSTALLER v1.0                " -ForegroundColor Cyan
Write-Host "     Cathedral of Flesh & Iron  |  Cathedral of Light     " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

function Test-Prerequisites {
    Write-Host "Checking prerequisites..." -ForegroundColor Yellow
    $checks = @(
        @{ Name="Rainmeter"; Path="C:\\Program Files\\Rainmeter\\Rainmeter.exe"; Required=$true },
        @{ Name="Wallpaper Engine"; Path="C:\\Program Files (x86)\\Steam\\steamapps\\common\\wallpaper_engine\\wallpaper32.exe"; Required=$true },
        @{ Name="AutoHotkey v2"; Path="C:\\Program Files\\AutoHotkey\\AutoHotkey64.exe"; Required=$true },
        @{ Name="WindowBlinds"; Path="C:\\Program Files (x86)\\Stardock\\WindowBlinds\\wbload.exe"; Required=$false }
    )
    foreach ($check in $checks) {
        if (Test-Path $check.Path) {
            Write-Host "  [$($check.Name)] found" -ForegroundColor Green
        } else {
            if ($check.Required) {
                Write-Host "  [$($check.Name)] NOT FOUND" -ForegroundColor Red
            } else {
                Write-Host "  [$($check.Name)] not found (optional)" -ForegroundColor Yellow
            }
        }
    }
}

Test-Prerequisites

Write-Host "`nCreating install directory..." -ForegroundColor Yellow
$installDir = $InstallPath
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    Write-Host "  Created: $installDir"
}

# Copy files
$scriptDir = $PSScriptRoot
$srcDir = Join-Path $scriptDir ".."

$dirsToCopy = @("Rainmeter", "WallpaperEngine", "Cursors", "Icons", "Sounds", "AutoHotkey", "Docs")

foreach ($dir in $dirsToCopy) {
    $src = Join-Path $srcDir $dir
    $dst = Join-Path $installDir $dir
    if (Test-Path $src) {
        Write-Host "  Copying $dir..." -ForegroundColor Cyan
        Copy-Item $src $dst -Recurse -Force
    }
}

# ─── INSTALL RAINMETER SKINS ───
Write-Host "`nInstalling Rainmeter skins..." -ForegroundColor Yellow
$rainmeterSkins = "$env:USERPROFILE\Documents\Rainmeter\Skins"
$hornsSkin = Join-Path $installDir "Rainmeter\HORNS"
$halosSkin = Join-Path $installDir "Rainmeter\HALOS"

if (Test-Path $hornsSkin) {
    $dstHorns = Join-Path $rainmeterSkins "HORNS"
    if (Test-Path $dstHorns -and !$Force) {
        Write-Host "  HORNS skin exists, skipping (use -Force to overwrite)" -ForegroundColor Yellow
    } else {
        Copy-Item $hornsSkin $dstHorns -Recurse -Force
        Write-Host "  [OK] HORNS skin installed"
    }
}

if (Test-Path $halosSkin) {
    $dstHalos = Join-Path $rainmeterSkins "HALOS"
    if (Test-Path $dstHalos -and !$Force) {
        Write-Host "  HALOS skin exists, skipping (use -Force to overwrite)" -ForegroundColor Yellow
    } else {
        Copy-Item $halosSkin $dstHalos -Recurse -Force
        Write-Host "  [OK] HALOS skin installed"
    }
}

if (Get-Process "Rainmeter" -ErrorAction SilentlyContinue) {
    & "C:\\Program Files\\Rainmeter\\Rainmeter.exe" !Refresh
    Write-Host "  Rainmeter refreshed"
}

# ─── INSTALL WALLPAPER ENGINE SCENES ───
Write-Host "`nInstalling Wallpaper Engine scenes..." -ForegroundColor Yellow
$weProjects = "$env:PROGRAMFILES (x86)\Steam\steamapps\common\wallpaper_engine\projects"
if (-not (Test-Path $weProjects)) {
    $weProjects = "$env:PROGRAMFILES\Steam\steamapps\common\wallpaper_engine\projects"
}

if (Test-Path $weProjects) {
    $weSrc = Join-Path $installDir "WallpaperEngine"
    Get-ChildItem $weSrc -Directory | ForEach-Object {
        $dst = Join-Path $weProjects $_.Name
        if (Test-Path $dst -and !$Force) {
            Write-Host "  $_ exists, skipping" -ForegroundColor Yellow
        } else {
            Copy-Item $_.FullName $dst -Recurse -Force
            Write-Host "  [OK] $_ installed"
        }
    }
} else {
    Write-Host "  Wallpaper Engine projects folder not found" -ForegroundColor Yellow
}

# ─── INSTALL CURSOR SCHEMES ───
Write-Host "`nInstalling cursor schemes..." -ForegroundColor Yellow
$cursorSrc = Join-Path $installDir "Cursors"
if (Test-Path $cursorSrc) {
    foreach ($theme in @("HORNS", "HALOS")) {
        $themeDir = Join-Path $cursorSrc $theme
        if (Test-Path $themeDir) {
            $inf = @"
[Version]
Signature="$Windows NT$"
Class=Mouse
Provider=Horns & Halos
DriverVer=08/26/2026,1.0.0

[DefaultInstall]
CopyFiles=CursorFiles
AddReg=CursorReg

[CursorFiles]
"@
        Get-ChildItem (Join-Path $themeDir "*.cur") | ForEach-Object {
            $inf += "`n`"$_`" = ,`"$_`""
        }
        $inf += @"

[CursorFiles]
[CursorReg]
HKCU,"Control Panel\Cursors",Arrow,,"%SystemRoot%\Cursors\$theme\arrow.cur"
HKCU,"Control Panel\Cursors",Help,,"%SystemRoot%\Cursors\$theme\help.cur"
HKCU,"Control Panel\Cursors",AppStarting,,"%SystemRoot%\Cursors\$theme\wait.cur"
HKCU,"Control Panel\Cursors",Wait,,"%SystemRoot%\Cursors\$theme\wait.cur"
HKCU,"Control Panel\Cursors",Crosshair,,"%SystemRoot%\Cursors\$theme\crosshair.cur"
HKCU,"Control Panel\Cursors",IBeam,,"%SystemRoot%\Cursors\$theme\ibeam.cur"
HKCU,"Control Panel\Cursors",NWPen,,"%SystemRoot%\Cursors\$theme\pen.cur"
HKCU,"Control Panel\Cursors",No,,"%SystemRoot%\Cursors\$theme\no.cur"
HKCU,"Control Panel\Cursors",SizeNS,,"%SystemRoot%\Cursors\$theme\size_ns.cur"
HKCU,"Control Panel\Cursors",SizeWE,,"%SystemRoot%\Cursors\$theme\size_we.cur"
HKCU,"Control Panel\Cursors",SizeNWSE,,"%SystemRoot%\Cursors\$theme\size_nwse.cur"
HKCU,"Control Panel\Cursors",SizeNESW,,"%SystemRoot%\Cursors\$theme\size_nesw.cur"
HKCU,"Control Panel\Cursors",SizeAll,,"%SystemRoot%\Cursors\$theme\size_all.cur"
HKCU,"Control Panel\Cursors",UpArrow,,"%SystemRoot%\Cursors\$theme\up_arrow.cur"

[DestinationDirs]
CursorFiles=12
"@
            $infPath = Join-Path $themeDir "install.inf"
            $inf | Out-File -FilePath $infPath -Encoding UTF8
            $sysCursors = "$env:SystemRoot\Cursors"
            $themeCursors = Join-Path $sysCursors $theme
            if (-not (Test-Path $themeCursors)) {
                New-Item -ItemType Directory -Path $themeCursors -Force | Out-Null
            }
            Copy-Item (Join-Path $cursorSrc $theme "\*.cur") $themeCursors -Force
            Write-Host "  [OK] $theme cursors copied to System32"
        }
    }
    Write-Host "  Cursor .inf installers created. Run as admin: Right-click install.inf -> Install"
}

# ─── INSTALL SOUND SCHEMES ───
Write-Host "`nCreating sound scheme registry files..." -ForegroundColor Yellow
$soundSrc = Join-Path $installDir "Sounds"
if (Test-Path $soundSrc) {
    foreach ($theme in @("HORNS", "HALOS")) {
        $themeDir = Join-Path $soundSrc $theme
        if (Test-Path $themeDir) {
            $reg = @"
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\.Default\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,64,00,65,00,66,00,61,00,75,00,6c,00,74,00,62,00,65,00,65,00,70,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\SystemStart\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,73,00,74,00,61,00,72,00,74,00,2d,00,72,00,69,00,74,00,75,00,61,00,6c,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\SystemExit\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,65,00,78,00,69,00,74,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\Minimize\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,6d,00,69,00,6e,00,69,00,6d,00,69,00,7a,00,65,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\Maximize\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,6d,00,61,00,78,00,69,00,6d,00,69,00,7a,00,65,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\RestoreUp\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,72,00,65,00,73,00,74,00,6f,00,72,00,65,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\Open\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,6f,00,70,00,65,00,6e,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\Close\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,63,00,6c,00,6f,00,73,00,65,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\SystemExclamation\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,65,00,78,00,63,00,6c,00,61,00,6d,00,61,00,74,00,69,00,6f,00,6e,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\SystemHand\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,65,00,72,00,72,00,6f,00,72,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\SystemQuestion\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,71,00,75,00,65,00,73,00,74,00,69,00,6f,00,6e,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\DefaultBeep\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,64,00,65,00,66,00,61,00,75,00,6c,00,74,00,62,00,65,00,65,00,70,00,2e,00,77,00,61,00,76,00,00,00

; Custom sounds
[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\SigilCast\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,73,00,69,00,67,00,69,00,6c,00,63,00,61,00,73,00,74,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\Transmute\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,74,00,72,00,61,00,6e,00,73,00,6d,00,75,00,74,00,65,00,2e,00,77,00,61,00,76,00,00,00

[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\BreathCycle\.Current]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,00,5c,00,4d,00,65,00,64,00,69,00,61,00,5c,00,$theme,00,5c,00,62,00,72,00,65,00,61,00,74,00,68,00,63,00,79,00,63,00,6c,00,65,00,2e,00,77,00,61,00,76,00,00,00

; Scheme name
[HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default\SchemeName]
@="$theme Ritual"
"@
            $regPath = Join-Path $themeDir "install.reg"
            $reg | Out-File -FilePath $regPath -Encoding Unicode
            Write-Host "  [OK] $theme sound scheme .reg created"
        }
    }
}

# ─── INSTALL WINDOWBLINDS THEMES ───
Write-Host "`nInstalling WindowBlinds themes..." -ForegroundColor Yellow
$wbSrc = Join-Path $installDir "WindowBlinds"
if (-not (Test-Path $wbSrc)) {
    $wbSrc = Join-Path $installDir ".." "WindowBlinds"
}
if (Test-Path $wbSrc) {
    $wbDst = "$env:USERPROFILE\Documents\WindowBlinds"
    if (-not (Test-Path $wbDst)) {
        New-Item -ItemType Directory -Path $wbDst -Force | Out-Null
    }
    Copy-Item (Join-Path $wbSrc "*.wba") $wbDst -Force
    Write-Host "  [OK] WindowBlinds .wba files copied to $wbDst"
}

# ─── INSTALL AUTOHOTKEY SWITCHER ───
Write-Host "`nInstalling AutoHotkey switcher..." -ForegroundColor Yellow
$ahkSrc = Join-Path $installDir "AutoHotkey"
$startupDir = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"
$ahkDst = Join-Path $startupDir "HornsHalosSwitcher.exe"

if (Test-Path (Join-Path $ahkSrc "switcher.exe")) {
    Copy-Item (Join-Path $ahkSrc "switcher.exe") $ahkDst -Force
    Write-Host "  [OK] Switcher installed to startup"
} else {
    Write-Host "  [WARN] switcher.exe not found. Compile switcher.ahk first (see AutoHotkey\\COMPILE_GUIDE.md)" -ForegroundColor Yellow
}

# Copy config
New-Item -ItemType Directory -Path "$env:APPDATA\HornsHalos" -Force | Out-Null
Copy-Item (Join-Path $ahkSrc "duality.ini") "$env:APPDATA\HornsHalos\duality.ini" -Force

# ─── SET DEFAULT THEME ───
Write-Host "`nApplying default theme (HORNS)..." -ForegroundColor Yellow
& "C:\\Program Files\\Rainmeter\\Rainmeter.exe" "!ActivateConfig HORNS Taskbar.ini"
& "C:\\Program Files\\Rainmeter\\Rainmeter.exe" "!ActivateConfig HORNS Start.ini"
& "C:\\Program Files\\Rainmeter\\Rainmeter.exe" "!ActivateConfig HORNS System.ini"
& "C:\\Program Files\\Rainmeter\\Rainmeter.exe" "!ActivateConfig HORNS Widgets.ini"

# ─── COMPLETION ───
Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  INSTALLATION COMPLETE                                     " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Install cursor schemes: Right-click Cursors\HORNS\install.inf -> Install (as Admin)" -ForegroundColor White
Write-Host "  2. Install sound schemes: Double-click Sounds\HORNS\install.reg (as Admin)" -ForegroundColor White
Write-Host "  3. Compile AutoHotkey switcher (see AutoHotkey\\COMPILE_GUIDE.md)" -ForegroundColor White
Write-Host "  4. Load WindowBlinds themes from WindowBlinds control panel" -ForegroundColor White
Write-Host "  5. Press Win+` to toggle HORNS <-> HALOS" -ForegroundColor White
Write-Host ""
Write-Host "Enjoy your transmutable desktop!" -ForegroundColor Magenta
