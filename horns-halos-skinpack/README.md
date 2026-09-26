# HORNS & HALOS SKINPACK
## Complete Duality Desktop Transformation

> **"The machine dreams of flesh. The flesh dreams of chrome. In the Cathedral there is no difference."**

A complete, production-ready Windows skinpack featuring two fully-realized themes:
- **HORNS** — Dark/Demonic: Biomechanical hellscape (Giger, Kat Von D, Victor, Dan Smith, Beksiński)
- **HALOS** — Light/Divine: Celestial cathedral (transposed masters to divine grace)

---

## 🎯 QUICK START

### Prerequisites (Required)
| Software | Version | Purpose |
|----------|---------|---------|
| **Rainmeter** | 4.5+ | Taskbar, Start menu, widgets |
| **Wallpaper Engine** | Steam | Animated 4K/8K wallpapers |
| **AutoHotkey v2** | 2.0+ | Theme switcher (Win+`) |
| **WindowBlinds** | 10+ (optional) | Window frames |

### Installation (Run as Administrator)
```cmd
cd HornsHalos-Skinpack\Installer
install.bat
```

### Post-Install Steps
1. **Cursors**: Right-click `Cursors\HORNS\install.inf` → **Install** (Admin)
2. **Sounds**: Double-click `Sounds\HORNS\install.reg` (Admin)
2. **Switcher**: Compile `AutoHotkey\switcher.ahk` → place in Startup
3. **WindowBlinds**: Load `.wba` files from WindowBlinds control panel

---

## 🔄 DAILY USE

### Theme Toggle
| Key | Action |
|-----|--------|
| **Win + `** | Instant HORNS ↔ HALOS transmutation |
| Tray menu | Right-click for theme selection & settings |

### Transition
- **1.5s crossfade** synchronized to breath cycle
- **Particle burst** + **sigil/mandala draw animation**
- All components sync: Rainmeter, Wallpaper, Cursors, Sounds, WindowBlinds, Accent

---

## 📦 PACKAGE CONTENTS

```
HornsHalos-Skinpack/
├── Rainmeter/
│   ├── HORNS/          # Vertebral taskbar, horned Start, sigil launchers
│   └── HALOS/          # Gothic arch taskbar, mandala Start, gold launchers
├── WallpaperEngine/
│   ├── HORNS_GigerCorridor/      # 4K/8K, 30s loop
│   ├── HORNS_Beksinski/
│   ├── HALOS_Spires/
│   └── HALOS_RoseBloom/
├── Cursors/
│   ├── HORNS/          # 17 states: horned claw, sigil ibeam, ritual circle...
│   └── HALOS/          # 17 states: feather quill, blessing hand, mandala...
├── Icons/
│   ├── HORNS/          # 50+ icons: horned skull, skin scroll, heart chamber...
│   └── HALOS/          # 50+ icons: reliquary, illuminated leaf, tabernacle...
├── Sounds/
│   ├── HORNS/          # 17 WAV: sub-hum, bone snap, arterial spurt, sigil chime...
│   └── HALOS/          # 17 WAV: singing bowl, bell tone, gold rustle, grace notes...
├── AutoHotkey/
│   ├── switcher.ahk    # Source (compile with Ahk2Exe)
│   ├── duality.ini     # Config
│   └── COMPILE_GUIDE.md
├── Installer/
│   ├── Install-Skinpack.ps1    # Full PowerShell installer
│   └── install.bat             # Simple wrapper
└── Docs/
    ├── DESIGN_HORNS.md     # Complete DESIGN.md spec
    ├── DESIGN_HALOS.md
    ├── SPEC_SOUNDS_HORNS.md   # Vital/Serum/VCV patches
    ├── SPEC_SOUNDS_HALOS.md
    └── SPEC_BOOT.md          # UEFI/Windows boot specs
```

---

## 🎨 DESIGN PHILOSOPHY

### HORNS — Cathedral of Flesh & Iron
| Artist | Contribution |
|--------|--------------|
| **H.R. Giger** | Vertebral corridors, pneumatic tubing, biomechanical erosion |
| **Kat Von D** | Blackwork linework, dotwork loading, sacred geometry sigils |
| **Victor** | Impossible architecture, ceremonial circles, sigil grammar |
| **Dan Smith** | Horned entities, chitinous armor, crowned spines |
| **Zdzisław Beksiński** | Apocalyptic towers, atmospheric fog, cruciform silhouettes |

**Palette**: Obsidian `#030303` → Arterial `#8B0000` → Glow `#FF001F` → Gold `#C8A951`
**Breath**: 4s cycle — visceral, urgent, biomechanical

### HALOS — Cathedral of Light
| Artist | Transposed Contribution |
|--------|------------------------|
| **Giger → Divine Clockwork** | Gears of light, pneumatic→rays, spirit-matter unity |
| **Kat Von D → Gold Illumination** | Chrysography, pointillé, mandalas, wine-blood |
| **Victor → Mandala Architecture** | Heavenly geometries, spires of light, yantras |
| **Dan Smith → Radiant Crowns** | Seraphim, halos, golden plate, star-eyes |
| **Beksiński → Celestial Spires** | Gothic cathedrals, divine light rays, transcendence |

**Palette**: Celestial `#FAF9F6` → Gold Leaf `#D4A843` → Divine `#E8C56D` → Illumination `#FFD700`
**Breath**: 6s cycle — eternal, deliberate, divine respiration

---

## 🛠️ CUSTOMIZATION

### AutoHotkey Settings (`duality.ini`)
```ini
[Settings]
CurrentTheme=HORNS
TransitionMs=1500
SyncRainmeter=1
SyncWallpaper=1
SyncCursors=1
SyncSounds=1
SyncWindowBlinds=1
SyncAccent=1
```

### Rainmeter Variables (`@Resources\Variables.inc`)
```ini
; HORNS timings
BreathCycle=4000
PulseSigil=2000
HornCurl=600

; HALOS timings
BreathCycle=6000
PulseSigil=3000
SpireRise=800
```

---

## 🔧 DEVELOPMENT

### Generate Assets
```bash
# 8K Wallpapers (requires Blender)
blender --background --python generate_wallpapers.py

# Cursors & Icons (requires Python + svgwrite + cairosvg)
pip install svgwrite cairosvg
python generate_cursors_icons.py

# Compile Switcher
Ahk2Exe.exe /in switcher.ahk /out switcher.exe /bin "C:\Program Files\AutoHotkey\AutoHotkey64.exe"
```

### Audio Production
Use Vital/Serum/VCV Rack patches from `SPEC_SOUNDS_*.md`:
- 17 sounds × 2 themes = 34 total
- 48kHz/24-bit, -18 LUFS, loopable
- Render to `Sounds\HORNS\` and `Sounds\HALOS\`

---

## 📜 LICENSE

MIT License — Free for personal and commercial use.
Attribution appreciated: **"Horns & Halos by Cathedral of Flesh & Iron / Cathedral of Light"**

---

## 🙏 CREDITS

**Design & Code**: Cathedral of Flesh & Iron (30 years exp. digital artist)
**Artist Synthesis**: H.R. Giger, Kat Von D, Victor, Dan Smith, Zdzisław Beksiński
**Tools**: Rainmeter, Wallpaper Engine, AutoHotkey, WindowBlinds, Blender, Vital, Serum, VCV Rack

---

> *"Transmute at will. The Cathedral breathes with you."*
