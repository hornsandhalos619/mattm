#Requires AutoHotkey v2.0
#SingleInstance Force
#NoEnv
#Warn All, Off
SetWorkingDir A_ScriptDir
SendMode Input

; ─── HORNS & HALOS DUALITY SWITCHER ───
; Win+` (Grave) toggles themes
; Applies: Rainmeter, Wallpaper Engine, Cursors, Sounds, WindowBlinds, Accent

global CurrentTheme := "HORNS"
global ConfigFile := A_ScriptDir "\duality.ini"
global Themes := ["HORNS", "HALOS"]

; ─── CONFIG ───
if FileExist(ConfigFile) {
    IniRead CurrentTheme, %ConfigFile%, Settings, CurrentTheme, HORNS
} else {
    IniWrite %CurrentTheme%, %ConfigFile%, Settings, CurrentTheme
    IniWrite 1500, %ConfigFile%, Settings, TransitionMs
    IniWrite 1, %ConfigFile%, Settings, SyncRainmeter
    IniWrite 1, %ConfigFile%, Settings, SyncWallpaper
    IniWrite 1, %ConfigFile%, Settings, SyncCursors
    IniWrite 1, %ConfigFile%, Settings, SyncSounds
    IniWrite 1, %ConfigFile%, Settings, SyncWindowBlinds
    IniWrite 1, %ConfigFile%, Settings, SyncAccent
}

; ─── HOTKEY ───
#`::ToggleTheme()

; ─── TRAY MENU ───
MenuTray := MenuCreate()
MenuTray.Add("HORNS", (*) => SetTheme("HORNS"))
MenuTray.Add("HALOS", (*) => SetTheme("HALOS"))
MenuTray.Add("---")
MenuTray.Add("Settings", ShowSettings)
MenuTray.Add("Reload", (*) => Reload())
MenuTray.Add("Exit", (*) => ExitApp())
A_TrayMenu := MenuTray

; Set tray icon based on theme
UpdateTrayIcon()

; ─── MAIN FUNCTIONS ───
ToggleTheme() {
    global CurrentTheme
    NewTheme := (CurrentTheme = "HORNS") ? "HALOS" : "HORNS"
    SetTheme(NewTheme)
}

SetTheme(Theme) {
    global CurrentTheme, ConfigFile
    if Theme not in Themes {
        return
    }
    
    PreviousTheme := CurrentTheme
    CurrentTheme := Theme
    IniWrite %Theme%, %ConfigFile%, Settings, CurrentTheme
    
    ; Show transition overlay
    ShowTransition(PreviousTheme, Theme)
    
    ; Apply theme components
    IniRead SyncRainmeter, %ConfigFile%, Settings, SyncRainmeter
    IniRead SyncWallpaper, %ConfigFile%, Settings, SyncWallpaper
    IniRead SyncCursors, %ConfigFile%, Settings, SyncCursors
    IniRead SyncSounds, %ConfigFile%, Settings, SyncSounds
    IniRead SyncWindowBlinds, %ConfigFile%, Settings, SyncWindowBlinds
    IniRead SyncAccent, %ConfigFile%, Settings, SyncAccent
    
    if SyncRainmeter {
        ApplyRainmeter(Theme)
    }
    if SyncWallpaper {
        ApplyWallpaper(Theme)
    }
    if SyncCursors {
        ApplyCursors(Theme)
    }
    if SyncSounds {
        ApplySounds(Theme)
    }
    if SyncWindowBlinds {
        ApplyWindowBlinds(Theme)
    }
    if SyncAccent {
        ApplyAccent(Theme)
    }
    
    UpdateTrayIcon()
    PlayTransitionSound(Theme)
}

ShowTransition(FromTheme, ToTheme) {
    IniRead Duration, %ConfigFile%, Settings, TransitionMs, 1500
    
    ; Create fullscreen overlay GUI
    Gui := GuiCreate("+AlwaysOnTop -Caption -Border +E0x80000 +HWNDhWnd")
    Gui.SetFont("s12", "MedievalSharp")
    Gui.BackColor := (ToTheme = "HORNS") ? "0x030303" : "0xFAF9F6"
    
    ; Add canvas for sigil/mandala animation
    Canvas := Gui.Add("Canvas", "x0 y0 w%A_ScreenWidth% h%A_ScreenHeight%")
    Canvas.OnEvent("Draw", DrawTransition)
    
    Gui.Show("x0 y0 w%A_ScreenWidth% h%A_ScreenHeight% NoActivate")
    
    ; Animate
    StartTime := A_TickCount
    while (A_TickCount - StartTime < Duration) {
        Progress := (A_TickCount - StartTime) / Duration
        Canvas.Invalidate()
        Sleep 16
    }
    
    Gui.Destroy()
}

DrawTransition(Canvas, Progress) {
    global CurrentTheme
    ; Draw expanding sigil/mandala
    W := Canvas.Width
    H := Canvas.Height
    CX := W / 2
    CY := H / 2
    MaxR := max(W, H) * 0.8
    R := MaxR * EaseOutCubic(Progress)
    
    Canvas.Clear()
    
    if CurrentTheme = "HORNS" {
        ; Draw expanding sigil (☿)
        Canvas.SetBrush("0xFF001F")
        Canvas.SetPen("0xFF001F", 4)
        Canvas.Ellipse(CX - R/2, CY - R/2, CX + R/2, CY + R/2)
        Canvas.DrawText("☿", "MedievalSharp", R * 0.6, CX, CY + R * 0.15, "Center")
    } else {
        ; Draw expanding mandala (☸)
        Canvas.SetBrush("0xFFD700")
        Canvas.SetPen("0xFFD700", 3)
        Canvas.Ellipse(CX - R/2, CY - R/2, CX + R/2, CY + R/2)
        ; Mandala rings
        Loop 4 {
            r := R * (A_Index / 5)
            Canvas.Ellipse(CX - r, CY - r, CX + r, CY + r)
        }
        Canvas.DrawText("☸", "MedievalSharp", R * 0.5, CX, CY + R * 0.1, "Center")
    }
}

EaseOutCubic(t) {
    return 1 - (1 - t) ** 3
}

ApplyRainmeter(Theme) {
    ; Deactivate all theme configs
    Run "rainmeter.exe !DeactivateConfig HORNS"
    Run "rainmeter.exe !DeactivateConfig HALOS"
    
    ; Activate selected theme
    if Theme = "HORNS" {
        Run "rainmeter.exe !ActivateConfig HORNS Taskbar.ini"
        Run "rainmeter.exe !ActivateConfig HORNS Start.ini"
        Run "rainmeter.exe !ActivateConfig HORNS System.ini"
        Run "rainmeter.exe !ActivateConfig HORNS Widgets.ini"
    } else {
        Run "rainmeter.exe !ActivateConfig HALOS Taskbar.ini"
        Run "rainmeter.exe !ActivateConfig HALOS Start.ini"
        Run "rainmeter.exe !ActivateConfig HALOS System.ini"
        Run "rainmeter.exe !ActivateConfig HALOS Widgets.ini"
    }
}

ApplyWallpaper(Theme) {
    ; Use Wallpaper Engine CLI
    WallpaperExe := "C:\Program Files (x86)\Steam\steamapps\common\wallpaper_engine\wallpaper32.exe"
    if !FileExist(WallpaperExe) {
        WallpaperExe := "C:\Program Files\Steam\steamapps\common\wallpaper_engine\wallpaper32.exe"
    }
    if FileExist(WallpaperExe) {
        if Theme = "HORNS" {
            Run "%WallpaperExe% -control play -file HORNS_GigerCorridor"
        } else {
            Run "%WallpaperExe% -control play -file HALOS_Spires"
        }
    }
}

ApplyCursors(Theme) {
    ; Apply cursor scheme via registry
    Scheme := (Theme = "HORNS") ? "HORNS Cursors" : "HALOS Cursors"
    Run "rundll32.exe user32.dll,UpdatePerUserSystemParameters"
    RegWrite "HKCU\Control Panel\Cursors\Scheme Source", 1, "REG_DWORD", 1
    ; Note: Full cursor scheme application requires .inf installer
    ; This is a placeholder - see Cursors\HORNS\install.inf and Cursors\HALOS\install.inf
}

ApplySounds(Theme) {
    ; Apply sound scheme via registry
    Scheme := (Theme = "HORNS") ? "HORNS Ritual" : "HALOS Grace"
    Run "rundll32.exe user32.dll,UpdatePerUserSystemParameters"
    ; Note: Full sound scheme requires .reg file import
}

ApplyWindowBlinds(Theme) {
    ; Apply WindowBlinds theme
    WBExe := "C:\Program Files (x86)\Stardock\WindowBlinds\wbload.exe"
    if !FileExist(WBExe) {
        WBExe := "C:\Program Files\Stardock\WindowBlinds\wbload.exe"
    }
    if FileExist(WBExe) {
        ThemeFile := (Theme = "HORNS") ? "HORNS.wba" : "HALOS.wba"
        Run "%WBExe% /load `"%A_ScriptDir%\..\WindowBlinds\%ThemeFile%`""
    }
}

ApplyAccent(Theme) {
    ; Set Windows accent color via registry
    if Theme = "HORNS" {
        RegWrite "HKCU\Software\Microsoft\Windows\DWM\AccentColor", "REG_DWORD", 0x001F00FF  ; ABGR format
    } else {
        RegWrite "HKCU\Software\Microsoft\Windows\DWM\AccentColor", "REG_DWORD", 0x00D7FF00
    }
    Run "rundll32.exe user32.dll,UpdatePerUserSystemParameters"
}

UpdateTrayIcon() {
    global CurrentTheme
    IconFile := (CurrentTheme = "HORNS") ? A_ScriptDir "\Icons\horns_tray.ico" : A_ScriptDir "\Icons\halos_tray.ico"
    if !FileExist(IconFile) {
        ; Create default icon
        IconFile := A_ScriptDir "\Icons\default_tray.ico"
    }
    A_TrayMenu.SetIcon(IconFile)
    A_TrayMenu.SetToolTip("Horns & Halos - " CurrentTheme)
}

PlayTransitionSound(Theme) {
    SoundFile := (Theme = "HORNS") ? A_ScriptDir "\Sounds\HORNS	ransmute.wav" : A_ScriptDir "\Sounds\HALOS	ransmute.wav"
    if FileExist(SoundFile) {
        SoundPlay SoundFile
    }
}

ShowSettings() {
    Gui := GuiCreate("+AlwaysOnTop", "Horns & Halos - Settings")
    Gui.SetFont("s10", "Segoe UI")
    
    Gui.Add("Text", "x10 y10 w300", "Current Theme: " CurrentTheme)
    Gui.Add("Button", "x10 y40 w100", "HORNS", (*) => SetTheme("HORNS"))
    Gui.Add("Button", "x120 y40 w100", "HALOS", (*) => SetTheme("HALOS"))
    
    Gui.Add("Text", "x10 y80 w300", "Transition Duration (ms):")
    IniRead Duration, %ConfigFile%, Settings, TransitionMs, 1500
    Edit := Gui.Add("Edit", "x10 y100 w100", Duration)
    
    Gui.Add("CheckBox", "x10 y130 w200", "Sync Rainmeter", (*) => ToggleSetting("SyncRainmeter"))
    IniRead SyncRainmeter, %ConfigFile%, Settings, SyncRainmeter, 1
    GuiCtrl := Gui["SyncRainmeter"]
    GuiCtrl.Value := SyncRainmeter
    
    Gui.Add("CheckBox", "x10 y155 w200", "Sync Wallpaper Engine", (*) => ToggleSetting("SyncWallpaper"))
    IniRead SyncWallpaper, %ConfigFile%, Settings, SyncWallpaper, 1
    Gui["SyncWallpaper"].Value := SyncWallpaper
    
    Gui.Add("CheckBox", "x10 y180 w200", "Sync Cursors", (*) => ToggleSetting("SyncCursors"))
    IniRead SyncCursors, %ConfigFile%, Settings, SyncCursors, 1
    Gui["SyncCursors"].Value := SyncCursors
    
    Gui.Add("CheckBox", "x10 y205 w200", "Sync Sounds", (*) => ToggleSetting("SyncSounds"))
    IniRead SyncSounds, %ConfigFile%, Settings, SyncSounds, 1
    Gui["SyncSounds"].Value := SyncSounds
    
    Gui.Add("CheckBox", "x10 y230 w200", "Sync WindowBlinds", (*) => ToggleSetting("SyncWindowBlinds"))
    IniRead SyncWindowBlinds, %ConfigFile%, Settings, SyncWindowBlinds, 1
    Gui["SyncWindowBlinds"].Value := SyncWindowBlinds
    
    Gui.Add("CheckBox", "x10 y255 w200", "Sync Accent Color", (*) => ToggleSetting("SyncAccent"))
    IniRead SyncAccent, %ConfigFile%, Settings, SyncAccent, 1
    Gui["SyncAccent"].Value := SyncAccent
    
    Gui.Add("Button", "x10 y290 w100", "Save", (*) => {
        IniWrite Edit.Value, %ConfigFile%, Settings, TransitionMs
        Gui.Destroy()
    })
    
    Gui.Show("w320 h340")
}

ToggleSetting(Setting) {
    global ConfigFile
    IniRead Current, %ConfigFile%, Settings, %Setting%, 1
    New := !Current
    IniWrite %New%, %ConfigFile%, Settings, %Setting%
}

; ─── COMPILE INSTRUCTIONS ───
; 1. Install AutoHotkey v2: https://www.autohotkey.com/
; 2. Right-click this file → "Compile Script"
; 3. Or use command line:
;    Ahk2Exe.exe /in "switcher.ahk" /out "switcher.exe" /bin "C:\Program Files\AutoHotkey\AutoHotkey64.exe" /icon "Icons\switcher.ico"
; 4. Run switcher.exe at startup (place in shell:startup)
