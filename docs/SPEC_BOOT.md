# SPEC_BOOT.md — UEFI & Windows Boot Animation Specification

**Version:** 1.0  
**Date:** 2026-08-25  
**Author:** Hermes Agent  
**Classification:** OEM Internal — Pre-Release

---

## Table of Contents

1. [Overview](#overview)
2. [HORNS Aesthetic — Storyboard](#horns-aesthetic--storyboard)
3. [HALOS Aesthetic — Storyboard](#halos-aesthetic--storyboard)
4. [UEFI Firmware Animation Specifications](#uefi-firmware-animation-specifications)
5. [Windows Boot Animation Specifications (bootres.dll)](#windows-boot-animation-specifications-bootresdll)
6. [After Effects Project Structure](#after-effects-project-structure)
7. [Blender Project Structure](#blender-project-structure)
8. [Fallback Static Images](#fallback-static-images)
9. [Color Profiles & Encoding](#color-profiles--encoding)
10. [Particle System Specifications](#particle-system-specifications)
11. [Delivery Checklist](#delivery-checklist)

---

## Overview

This specification defines two distinct boot animation themes for OEM firmware and Windows boot sequences:

| Theme | Aesthetic References | Tone | Duration |
|-------|---------------------|------|----------|
| **HORNS** | H.R. Giger (Alien corridors), Zdzisław Beksiński (towers), Dan Smith (horned skulls) | Biomechanical, visceral, dark | 3–5 seconds |
| **HALOS** | Gothic cathedrals, illuminated manuscripts, sacred geometry (golden ratio φ) | Transcendent, luminous, ordered | 3–5 seconds |

Both themes must:
- Complete transition to desktop within **3–5 seconds** from power-on logo display
- Support **UEFI** (video-based) and **Windows** (bootres.dll resource-based) delivery
- Include **fallback static images** for systems that cannot play animations
- Contain **no audio**

---

## HORNS Aesthetic — Storyboard

### Visual Language
- **Palette:** Deep blacks (#030303), arterial reds (#8B0000 → #FF2400), bone whites (#F5F0E1), oxidized copper (#B87333)
- **Textures:** Biomechanical ribbing, wet organic surfaces, vertebral bone, corroded metal
- **Lighting:** Subsurface scattering on organic forms; harsh rim lights on edges; volumetric fog in corridors
- **Camera:** Subjective POV descent; dolly forward; no cuts — continuous flow

### Sequence Breakdown (Target: 90–150 frames @ 30fps = 3–5s)

| Phase | Frames | Duration | Description | Key Visual Elements |
|-------|--------|----------|-------------|---------------------|
| **1. Giger Corridor Descent** | 0–25 | 0.0–0.83s | Camera pushes down infinite biomechanical corridor; ribbed walls pulse with peristaltic motion | Ribbed tunnels, cable bundles, wet specular highlights, volumetric light shafts |
| **2. Vertebral Tunnel** | 26–50 | 0.83–1.67s | Corridor transitions to spinal column; vertebrae rotate/align; neural foramina glow | Vertebrae segments, spinal cord lumen, nerve root filaments, cerebrospinal fluid shimmer |
| **3. Arterial Pulse** | 51–75 | 1.67–2.50s | Blood-cell particles surge toward camera; vessel walls contract in systole/diastole rhythm | Erythrocyte particles (discocytes), endothelial texture, pressure wave displacement, Doppler color shift |
| **4. Beksiński Tower Emergence** | 76–105 | 2.50–3.50s | Organic tissue calcifies into spired towers; architectural impossible geometry rises | Tower silhouettes, stairways to nowhere, arched windows, weathered stone, atmospheric perspective |
| **5. Horned Skull Formation** | 106–130 | 3.50–4.33s | Towers converge into single horned cranium; mandible articulates; eye sockets ignite | Bovine/ram horn curvature, cranial sutures, orbital emissive glow, mandibular hinge |
| **6. Desktop Fade-In** | 131–150 | 4.33–5.00s | Skull dissolves into particle field; OS UI elements assemble; clean handoff to desktop | Particle dissolution (gold→transparent), UI element build (taskbar, icons), alpha-over composite |

### Transition Notes
- **No hard cuts** — use morphological blends (fluid simulation, displacement maps)
- **Arterial pulse** drives global tempo (60–72 BPM ≈ 1 beat per 12–15 frames)
- **Skull formation** uses boolean union of tower meshes → remesh → horn extrusion
- **Desktop fade** must complete before Windows login UI appears (coordinate with `bootux.dll` timing)

---

## HALOS Aesthetic — Storyboard

### Visual Language
- **Palette:** Pure whites (#FFFFFF), gold leaf (#FFD700), cathedral glass hues (chartres blue #0047AB, ruby #9B111E, emerald #008F39), pearl iridescence
- **Textures:** Illuminated manuscript vellum, gold leaf foil, stained glass leading, marble veining
- **Lighting:** Global illumination; caustics through glass; volumetric god rays; bloom/glare on specular gold
- **Camera:** Ascending pull-back; slow rotation around central axis; final settle to orthographic

### Sequence Breakdown (Target: 90–150 frames @ 30fps = 3–5s)

| Phase | Frames | Duration | Description | Key Visual Elements |
|-------|--------|----------|-------------|---------------------|
| **1. Light Particle Ascent** | 0–25 | 0.0–0.83s | Golden motes rise from darkness; Brownian motion with upward bias; trails form logarithmic spirals | 10k–50k particles, 1–3px disks, additive blending, Perlin noise velocity field, trail renderers |
| **2. Golden Ratio Spiral** | 26–50 | 0.83–1.67s | Particles organize into φ-spiral (r = a·e^(bθ), b = ln(φ)/π/2); arms thicken into luminous bands | Fibonacci quarter-circles, spiral arm bifurcation, particle-to-geometry conversion |
| **3. Gothic Spire Growth** | 51–80 | 1.67–2.67s | Spiral arms extrude upward as ribbed vaults; flying buttresses deploy; pinnacles pierce | Pointed arches, rib vaults, buttress geometry, crockets/finials, procedural L-system growth |
| **4. Rose Window Bloom** | 81–110 | 2.67–3.67s | Central oculus expands; tracery unfolds like flower; glass segments fill with chromatic light | Radial symmetry (12/16/24-fold), lead came network, glass shaders (dispersion, thin-film), chromatic bloom |
| **5. Mandala Completion** | 111–135 | 3.67–4.50s | Full sacred geometry resolves: concentric circles, squares, gates; bindu at center pulses | Yantra geometry, Sri Yantra triangles, Trikona, lotus petals, golden ratio proportions throughout |
| **6. Desktop Fade-In** | 136–150 | 4.50–5.00s | Mandala dissolves into UI-particle field; gold motes become window chrome; clean handoff | Particle-to-UI morph, gold→accent color shift, icon drop-in, taskbar slide-up |

### Transition Notes
- **Golden ratio (φ = 1.6180339887...)** governs all proportional relationships
- **Particle count** scales with resolution: 1080p = ~25k, 4K = ~100k
- **Stained glass** uses spectral rendering (thin-film interference) for authentic caustics
- **Mandala** completes at frame 135; final 15 frames reserved for OS handoff

---

## UEFI Firmware Animation Specifications

### Delivery Format
| Parameter | Specification |
|-----------|---------------|
| **Container** | MP4 (ISO BMFF) + WebM (VP9) — dual deliverables |
| **Codec** | H.264 High Profile Level 4.2 / VP9 Profile 0 |
| **Resolution** | 1920×1080 (FHD) **and** 3840×2160 (UHD/4K) — separate files |
| **Frame Rate** | 30 fps constant (not variable) |
| **Duration** | 3.0–5.0 seconds (90–150 frames) |
| **Max File Size** | < 10 MB per resolution per theme |
| **Audio** | None (muted track or no audio track) |
| **Color Space** | Rec.709 (see [Color Profiles](#color-profiles--encoding)) |
| **Bit Depth** | 8-bit (UEFI firmware typically lacks 10-bit decode) |
| **Chroma Subsampling** | 4:2:0 |

### Encoding Parameters (Target: <10 MB)

#### H.264 (MP4)
```bash
# FHD (1920x1080)
ffmpeg -i input.exr -vf "scale=1920:1080,format=yuv420p"   -c:v libx264 -profile:v high -level 4.2   -preset veryslow -tune animation   -crf 18 -maxrate 4M -bufsize 8M   -pix_fmt yuv420p -r 30 -an   horns_uefi_fhd.mp4

# UHD (3840x2160)
ffmpeg -i input.exr -vf "scale=3840:2160,format=yuv420p"   -c:v libx264 -profile:v high -level 5.1   -preset veryslow -tune animation   -crf 20 -maxrate 8M -bufsize 16M   -pix_fmt yuv420p -r 30 -an   horns_uefi_uhd.mp4
```

#### VP9 (WebM) — for firmware with VP9 support
```bash
# FHD
ffmpeg -i input.exr -vf "scale=1920:1080,format=yuv420p"   -c:v libvpx-vp9 -b:v 3M -crf 20   -tile-columns 2 -frame-parallel 1   -r 30 -an   horns_uefi_fhd.webm

# UHD
ffmpeg -i input.exr -vf "scale=3840:2160,format=yuv420p"   -c:v libvpx-vp9 -b:v 6M -crf 22   -tile-columns 4 -frame-parallel 1   -r 30 -an   horns_uefi_uhd.webm
```

### UEFI Integration Notes
- Place in ESP partition: `/EFI/OEM/BootAnimation/`
- File naming: `BootAnimation_FHD.mp4`, `BootAnimation_UHD.mp4` (and `.webm` variants)
- Firmware must detect display EDID and select appropriate resolution
- Fallback: If video decode fails, display static fallback image (see [Fallback Static Images](#fallback-static-images))
- **No looping** — play once, then transition to OS loader

---

## Windows Boot Animation Specifications (bootres.dll)

### Architecture Overview
Windows boot animation uses resources in `bootres.dll` (and `bootux.dll` for animation logic). This spec defines the resource replacement strategy.

### Resource Format Requirements
| Parameter | Specification |
|-----------|---------------|
| **Resource Type** | `RT_BITMAP` (for static frames) or `RT_ANICURSOR`/`RT_ANIICON` (for animated) |
| **Max Frames** | 100 frames total (hard limit from `bootux.dll` animation controller) |
| **Color Depth** | 8-bit indexed color (256-color palette) |
| **Resolution** | 1024×768 (legacy) / 1920×1080 (modern) — both required |
| **Palette** | Single shared 256-color palette across all frames |
| **Compression** | BI_RLE8 (RLE-encoded 8-bit) or BI_BITFIELDS |
| **Transparency** | Palette index 0 = transparent (for overlay on boot background) |

### Frame Allocation (100 Frames Max)

| Theme | Phase | Frames | Notes |
|-------|-------|--------|-------|
| **HORNS** | Giger Corridor | 15 | Simplified: silhouette + pulse |
| | Vertebral Tunnel | 15 | Wireframe → solid morph |
| | Arterial Pulse | 20 | Particle sprites on indexed palette |
| | Beksiński Towers | 20 | Vector-style extrusion |
| | Horned Skull | 15 | Keyframe morph |
| | Desktop Fade | 15 | Alpha dissolve to UI color |
| **HALOS** | Particle Ascent | 15 | Reduced particle count (500 max) |
| | Golden Spiral | 15 | Vector path reveal |
| | Spire Growth | 20 | L-system iteration steps |
| | Rose Window | 20 | Radial wipe reveal |
| | Mandala | 15 | Final geometry snap |
| | Desktop Fade | 15 | Particle-to-UI transition |

### Palette Design (256 Colors)

```
Index 0:   Transparent (alpha=0)
Index 1–16:  Grayscale ramp (0–255) — for UI chrome, shadows
Index 17–48: HORNS arterial reds (16 steps) + bone whites (16 steps)
Index 49–80: HALOS golds (16) + cathedral blues (16)
Index 81–112: HORNS oxidized coppers (16) + Beksiński stone (16)
Index 113–144: HALOS glass hues — ruby, emerald, amber, violet (8 each)
Index 145–176: Shared skin/organic tones (HORNS) / pearl iridescence (HALOS)
Index 177–208: Volumetric fog / atmosphere gradients (32 steps)
Index 209–240: Specular highlights / bloom (32 steps)
Index 241–255: Reserved for OS UI accent colors (dynamic at runtime)
```

### Resource Compilation

```rc
// bootres.rc — Resource script for bootres.dll

// HORNS Theme — 1024x768
IDB_HORNS_F000  BITMAP  "horns_1024/frame_000.bmp"
IDB_HORNS_F001  BITMAP  "horns_1024/frame_001.bmp"
...
IDB_HORNS_F099  BITMAP  "horns_1024/frame_099.bmp"

// HORNS Theme — 1920x1080
IDB_HORNS_FHD_F000  BITMAP  "horns_1920/frame_000.bmp"
...
IDB_HORNS_FHD_F099  BITMAP  "horns_1920/frame_099.bmp"

// HALOS Theme — 1024x768
IDB_HALOS_F000  BITMAP  "halos_1024/frame_000.bmp"
...
IDB_HALOS_F099  BITMAP  "halos_1024/frame_099.bmp"

// HALOS Theme — 1920x1080
IDB_HALOS_FHD_F000  BITMAP  "halos_1920/frame_000.bmp"
...
IDB_HALOS_FHD_F099  BITMAP  "halos_1920/frame_099.bmp"

// Shared Palette (loaded by bootux.dll at runtime)
IDB_BOOT_PALETTE  BITMAP  "palette_256.bmp"
```

### Build Process
```bash
# 1. Render frames from After Effects/Blender as PNG sequences
# 2. Quantize to 256-color palette (shared across theme)
#    Use: ImageMagick or custom octree quantizer with palette locking
# 3. Apply RLE8 compression to each BMP
# 4. Compile with rc.exe (Windows Resource Compiler)
# 5. Link into bootres.dll via link.exe /DLL
# 6. Sign with OEM certificate (WHQL)

# Palette generation (single source of truth)
python generate_palette.py --output palette_256.act --theme both

# Frame quantization (example)
for f in horns_1920/*.png; do
  magick "$f" -remap palette_256.png -depth 8 BMP3:"${f%.png}.bmp"
done
```

### bootux.dll Animation Timing
- Frame duration: **33.33ms** (30 fps) — fixed by boot animation controller
- Total animation time: **3.33 seconds** (100 frames × 33.33ms)
- Must complete before `winlogon.exe` initialization
- Coordinate with UEFI handoff: UEFI animation ends → Windows animation begins seamlessly

---

## After Effects Project Structure

### Project Template: `BootAnimation_Template.aep`

```
BootAnimation_Template.aep
├── Comps/
│   ├── MASTER_HORNS_1080p      (1920×1080, 30fps, 5s, 150 frames)
│   ├── MASTER_HORNS_4K         (3840×2160, 30fps, 5s, 150 frames)
│   ├── MASTER_HALOS_1080p      (1920×1080, 30fps, 5s, 150 frames)
│   ├── MASTER_HALOS_4K         (3840×2160, 30fps, 5s, 150 frames)
│   ├── MASTER_HORNS_WIN_1080p  (1920×1080, 30fps, 3.33s, 100 frames)
│   ├── MASTER_HORNS_WIN_768p   (1024×768, 30fps, 3.33s, 100 frames)
│   ├── MASTER_HALOS_WIN_1080p  (1920×1080, 30fps, 3.33s, 100 frames)
│   └── MASTER_HALOS_WIN_768p   (1024×768, 30fps, 3.33s, 100 frames)
│
├── Precomps_HORNS/
│   ├── PC_HORNS_01_Corridor        (3D camera + volumetric)
│   ├── PC_HORNS_02_Vertebral       (Shape layers + CC Bend It)
│   ├── PC_HORNS_03_Arterial        (Particular / Trapcode)
│   ├── PC_HORNS_04_Towers          (C4D/Element 3D import)
│   ├── PC_HORNS_05_Skull           (Morph + Liquify)
│   └── PC_HORNS_06_Fade            (Adjustment + CC Composite)
│
├── Precomps_HALOS/
│   ├── PC_HALOS_01_Particles       (Particular / Stardust)
│   ├── PC_HALOS_02_Spiral          (Shape layers + Expressions)
│   ├── PC_HALOS_03_Spires          (Repeater + Expressions)
│   ├── PC_HALOS_04_RoseWindow      (Polar Coordinates + CC Kaleida)
│   ├── PC_HALOS_05_Mandala         (Shape layers + Expressions)
│   └── PC_HALOS_06_Fade            (Adjustment + CC Composite)
│
├── Shared_Precomps/
│   ├── PC_Color_Grade_HORNS        (Limited Rec.709 LUT)
│   ├── PC_Color_Grade_HALOS        (Full Rec.709 LUT)
│   ├── PC_Particle_Base            (Shared particle presets)
│   ├── PC_Desktop_Handoff          (UI element placeholders)
│   └── PC_Fallback_Static          (Static frame export comps)
│
├── Solids/
│   ├── BG_Black_Solid
│   ├── BG_White_Solid
│   └── Palette_Reference_256       (8-bit indexed reference)
│
├── Footage/
│   ├── Textures/
│   │   ├── giger_ribbed_wall_4k.exr
│   │   ├── vertebral_bone_4k.exr
│   │   ├── arterial_endothelium_4k.exr
│   │   ├── bekskinski_stone_4k.exr
│   │   ├── horn_keratin_4k.exr
│   │   ├── gold_leaf_4k.exr
│   │   ├── vellum_4k.exr
│   │   ├── stained_glass_blue_4k.exr
│   │   ├── stained_glass_red_4k.exr
│   │   ├── stained_glass_green_4k.exr
│   │   └── marble_vein_4k.exr
│   ├── LUTs/
│   │   ├── Rec709_Limited.cube
│   │   ├── Rec709_Full.cube
│   │   ├── HORNS_Grade.cube
│   │   └── HALOS_Grade.cube
│   └── Reference/
│       ├── giger_corridor_ref.jpg
│       ├── bekskinski_tower_ref.jpg
│       ├── dan_smith_horns_ref.jpg
│       ├── chartres_rose_window_ref.jpg
│       ├── sri_yantra_ref.png
│       └── illuminated_manuscript_ref.jpg
│
├── Scripts/
│   ├── export_uefi_frames.jsx      (Render queue: EXR → ffmpeg)
│   ├── export_windows_frames.jsx   (Render queue: PNG → quantize)
│   ├── generate_palette.jsx        (Extract 256-color palette)
│   ├── validate_frame_count.jsx    (Enforce 100/150 frame limits)
│   └── package_deliverables.jsx    (Zip + manifest generation)
│
└── Expressions/
    ├── golden_ratio_spiral.jsx     (φ-spiral path expression)
    ├── arterial_pulse.jsx          (Peristaltic wave expression)
    ├── lsystem_growth.jsx          (L-system for spires)
    ├── mandala_geometry.jsx        (Sri Yantra construction)
    └── palette_lock.jsx            (Force 8-bit indexed preview)
```

### Key Expressions (Reference)

#### Golden Ratio Spiral (HALOS Phase 2)
```javascript
// Applied to Position of particle emitter or shape layer path
var phi = 1.618033988749895;
var b = Math.log(phi) / (Math.PI / 2);
var a = 10; // scale
var t = time * 2 * Math.PI; // angular velocity
var r = a * Math.exp(b * t);
var x = r * Math.cos(t);
var y = r * Math.sin(t);
[x, y] + [thisComp.width/2, thisComp.height/2];
```

#### Arterial Pulse (HORNS Phase 3)
```javascript
// Applied to Scale of vessel walls / particle velocity
var bpm = 68;
var period = 60 / bpm; // seconds per beat
var phase = (time % period) / period;
var systole = ease(phase, 0, 0.35, 1, 1.08); // contraction
var diastole = ease(phase, 0.35, 1, 1.08, 1); // relaxation
[systole*100, diastole*100];
```

#### L-System Spire Growth (HALOS Phase 3)
```javascript
// Applied to Stroke End or Path Trim on shape layers
var axiom = "F";
var rules = {F: "F[+F]F[-F]F"};
var angle = 22.5 * Math.PI/180;
var iterations = Math.floor(linear(time, 1.67, 2.67, 0, 5));
// Recursive expansion handled by script, not expression
// This expression drives the "growth" parameter (0–1)
linear(time, 1.67, 2.67, 0, 1);
```

---

## Blender Project Structure

### Project Template: `BootAnimation_Template.blend`

```
BootAnimation_Template.blend
├── Scenes/
│   ├── Scene_HORNS_UEFI_FHD     (1920×1080, 30fps, 150 frames)
│   ├── Scene_HORNS_UEFI_UHD     (3840×2160, 30fps, 150 frames)
│   ├── Scene_HALOS_UEFI_FHD     (1920×1080, 30fps, 150 frames)
│   ├── Scene_HALOS_UEFI_UHD     (3840×2160, 30fps, 150 frames)
│   ├── Scene_HORNS_WIN_FHD      (1920×1080, 30fps, 100 frames)
│   ├── Scene_HORNS_WIN_768p     (1024×768, 30fps, 100 frames)
│   ├── Scene_HALOS_WIN_FHD      (1920×1080, 30fps, 100 frames)
│   └── Scene_HALOS_WIN_768p     (1024×768, 30fps, 100 frames)
│
├── Collections/
│   ├── HORNS_Corridor/
│   │   ├── Corridor_Base_Mesh
│   │   ├── Rib_Array (Array + Curve modifier)
│   │   ├── Cable_Bundles (Curve objects)
│   │   ├── Volumetric_Fog (Cube + Volume shader)
│   │   └── Camera_Corridor (Animated: Loc/Z -100→0)
│   ├── HORNS_Vertebral/
│   │   ├── Vertebra_Unit (Single vertebra, rigged)
│   │   ├── Spine_Array (Array + Follow Path)
│   │   ├── Spinal_Cord (Curve + Taper/Bevel)
│   │   ├── Nerve_Roots (Hair particles → curves)
│   │   └── CSF_Fluid (Mantaflow liquid sim)
│   ├── HORNS_Arterial/
│   │   ├── Artery_Tube (Curve + Profile)
│   │   ├── Erythrocytes (Particle System → Instance Collection)
│   │   ├── Endothelium_Shader (Subsurface + Velvet)
│   │   └── Pulse_Wave (Geometry Nodes: displacement)
│   ├── HORNS_Towers/
│   │   ├── Tower_Base (Procedural: Geometry Nodes)
│   │   ├── Stair_Array (Array + Constant Offset)
│   │   ├── Arch_Window (Boolean + Bevel)
│   │   ├── Weathering_Shader (Layered: base, dirt, moss)
│   │   └── Atmosphere (Volume scatter)
│   ├── HORNS_Skull/
│   │   ├── Cranium_Base (Sculpt → Retopo)
│   │   ├── Horns (Curve → Mesh, tapered)
│   │   ├── Mandible (Rigged: hinge constraint)
│   │   ├── Orbital_Emissive (Emission shader)
│   │   └── Formation_Morph (Shape Keys: towers→skull)
│   ├── HALOS_Particles/
│   │   ├── Mote_Emitter (Plane + Particle System)
│   │   ├── Mote_Mesh (Icosphere, 8 verts)
│   │   ├── Trail_Renderer (Geometry Nodes: curve from cache)
│   │   ├── Velocity_Field (Force Field: Wind + Vortex)
│   │   └── Spiral_Attractor (Curve Guide)
│   ├── HALOS_Spiral/
│   │   ├── Phi_Spiral_Curve (Math: r = a·e^(bθ))
│   │   ├── Spiral_Profile (Bezier: taper + bevel)
│   │   ├── Bifurcation_Nodes (Geometry Nodes: split)
│   │   └── Glow_Volume (Volume emission)
│   ├── HALOS_Spires/
│   │   ├── LSystem_Rules (Text datablock)
│   │   ├── Spire_Generator (Geometry Nodes: iterative)
│   │   ├── Rib_Vault (Curve + Array + Bridge)
│   │   ├── Flying_Buttress (Curve + Skin modifier)
│   │   └── Pinnacle_Array (Collection Instance)
│   ├── HALOS_RoseWindow/
│   │   ├── Tracery_Base (Curve: polar array)
│   │   ├── Lead_Came (Curve → Mesh, beveled)
│   │   ├── Glass_Segments (Boolean from tracery)
│   │   ├── Glass_Shader (Thin-film + Dispersion)
│   │   └── Bloom_Wipe (Geometry Nodes: radial mask)
│   ├── HALOS_Mandala/
│   │   ├── Bindu_Center (Sphere, emission)
│   │   ├── Trikona_Triangles (9 interlocking)
│   │   ├── Lotus_Petals (16/32, polar array)
│   │   ├── Gate_Squares (4 concentric)
│   │   ├── Circle_Rings (8, φ-proportioned)
│   │   └── Completion_Anim (Build modifier / GN)
│   ├── Shared_Cameras/
│   │   ├── Cam_UEFI_Subjective (HORNS: dolly forward)
│   │   ├── Cam_UEFI_Ascending (HALOS: pull back + rotate)
│   │   ├── Cam_WIN_Ortho (Orthographic, centered)
│   │   └── Cam_Handoff (Match move to UI)
│   ├── Lighting_Rigs/
│   │   ├── Rig_HORNS_Subsurface (Area lights + HDRI)
│   │   ├── Rig_HALOS_Cathedral (Sun + Portals + Caustics)
│   │   └── Rig_UI_Handoff (Flat, color-accurate)
│   └── Render_Layers/
│       ├── VL_HORNS_Main
│       ├── VL_HORNS_Particles
│       ├── VL_HORNS_Volume
│       ├── VL_HALOS_Main
│       ├── VL_HALOS_Particles
│       ├── VL_HALOS_Volume
│       └── VL_UI_Overlay
│
├── Node_Groups/ (Geometry Nodes & Shader Nodes)
│   ├── GN_Phi_Spiral
│   ├── GN_Arterial_Pulse
│   ├── GN_LSystem_Spire
│   ├── GN_RoseWindow_Tracery
│   ├── GN_Mandala_Geometry
│   ├── GN_Particle_Trails
│   ├── Shader_Biomechanical
│   ├── Shader_Bone_Marrow
│   ├── Shader_Arterial_Wall
│   ├── Shader_Weathered_Stone
│   ├── Shader_Horn_Keratin
│   ├── Shader_Gold_Leaf
│   ├── Shader_Vellum
│   ├── Shader_Stained_Glass
│   ├── Shader_Thin_Film
│   └── Shader_Iridescent_Pearl
│
├── Texture_Paint_Slots/
│   ├── TP_Giger_Corridor (4k, 32-bit EXR)
│   ├── TP_Vertebral_Bone (4k, 32-bit EXR)
│   ├── TP_Arterial_Wall (4k, 32-bit EXR)
│   ├── TP_Bekskinski_Stone (4k, 32-bit EXR)
│   ├── TP_Horn_Keratin (4k, 32-bit EXR)
│   ├── TP_Gold_Leaf (4k, 32-bit EXR)
│   ├── TP_Vellum (4k, 32-bit EXR)
│   ├── TP_Stained_Glass_Blue (4k, 32-bit EXR)
│   ├── TP_Stained_Glass_Red (4k, 32-bit EXR)
│   ├── TP_Stained_Glass_Green (4k, 32-bit EXR)
│   └── TP_Marble_Vein (4k, 32-bit EXR)
│
├── Python_Scripts/ (Text Editor)
│   ├── export_uefi_exr.py          (Render EXR sequences)
│   ├── export_windows_png.py       (Render PNG sequences)
│   ├── quantize_palette.py         (256-color quantization)
│   ├── validate_frames.py          (Frame count / naming check)
│   ├── generate_bootres_rc.py      (Write .rc file from frames)
│   ├── package_deliverables.py     (Create delivery ZIP + manifest)
│   └── apply_color_profile.py      (Rec.709 limited/full LUT bake)
│
└── Output/
    ├── UEFI/
    │   ├── HORNS_FHD/
    │   ├── HORNS_UHD/
    │   ├── HALOS_FHD/
    │   └── HALOS_UHD/
    ├── Windows/
    │   ├── HORNS_1080p/
    │   ├── HORNS_768p/
    │   ├── HALOS_1080p/
    │   └── HALOS_768p/
    ├── Fallbacks/
    │   ├── HORNS_Fallback_1080p.png
    │   ├── HORNS_Fallback_4K.png
    │   ├── HALOS_Fallback_1080p.png
    │   └── HALOS_Fallback_4K.png
    └── Manifest.json
```

### Geometry Nodes Highlights

#### Phi Spiral Generator (HALOS)
```python
# GN_Phi_Spiral node group
# Inputs: Turns (Float), Scale (Float), Resolution (Integer)
# Output: Curve (Bezier)
phi = 1.618033988749895
b = math.log(phi) / (math.pi / 2)
points = []
for i in range(resolution):
    t = i / resolution * turns * 2 * math.pi
    r = scale * math.exp(b * t)
    x = r * math.cos(t)
    y = r * Math.sin(t)
    points.append((x, y, 0))
# Create Bezier curve from points with auto handles
```

#### L-System Spire Growth (HALOS)
```python
# GN_LSystem_Spire node group
# Iterative string rewriting → curve network → mesh
axiom = "F"
rules = {"F": "F[+F]F[-F]F"}
angle = math.radians(22.5)
# Implemented as repeat zone with string manipulation
# Output: Curve instances for ribs, buttresses, pinnacles
```

#### Arterial Pulse Displacement (HORNS)
```python
# GN_Arterial_Pulse node group
# Input: Base mesh (tube), Time (frame), BPM (float)
# Output: Displaced mesh
wavelength = 2.0  # spatial period
amplitude = 0.08  # 8% radius change
phase = (frame / 30) * (bpm / 60) * 2 * math.pi
# Vertex displacement along normal: sin(position.x * wavelength + phase)
```

---

## Fallback Static Images

### Purpose
Displayed when:
- UEFI video decode fails / unsupported codec
- Windows boot animation disabled via BCD (`bootux.disabled = true`)
- Secure Boot / BitLocker pre-boot environment (no graphics driver)
- Accessibility: "Show animation" = Off

### Specifications

| Parameter | UEFI Fallback | Windows Fallback |
|-----------|---------------|------------------|
| **Format** | PNG (lossless) | BMP (8-bit indexed, RLE8) |
| **Resolution** | 1920×1080, 3840×2160 | 1024×768, 1920×1080 |
| **Color Depth** | 24-bit RGB / 32-bit RGBA | 8-bit indexed (shared palette) |
| **Max Size** | < 500 KB | < 100 KB |
| **Content** | "Hero frame" — final formed state (skull / mandala) | Same hero frame, quantized |

### Hero Frame Selection

| Theme | Hero Frame Description | Source Frame |
|-------|----------------------|--------------|
| **HORNS** | Fully formed horned skull, orbital glow active, particles settling | Frame 130 (UEFI) / Frame 85 (Windows) |
| **HALOS** | Completed mandala at peak bloom, bindu pulsing, gold motes drifting | Frame 135 (UEFI) / Frame 85 (Windows) |

### File Naming & Locations

```
UEFI (ESP Partition):
/EFI/OEM/BootAnimation/
  ├── fallback_horns_fhd.png      (1920×1080)
  ├── fallback_horns_uhd.png      (3840×2160)
  ├── fallback_halos_fhd.png      (1920×1080)
  └── fallback_halos_uhd.png      (3840×2160)

Windows (bootres.dll resources):
IDB_HORNS_FALLBACK_1024   BITMAP  "fallback_horns_1024.bmp"
IDB_HORNS_FALLBACK_1920   BITMAP  "fallback_horns_1920.bmp"
IDB_HALOS_FALLBACK_1024   BITMAP  "fallback_halos_1024.bmp"
IDB_HALOS_FALLBACK_1920   BITMAP  "fallback_halos_1920.bmp"
```

### Generation Pipeline
```bash
# From final After Effects/Blender frame
# UEFI: Direct PNG export (sRGB, no ICC profile)
# Windows: Quantize to shared 256-color palette + RLE8

# UEFI fallback (example)
magick horns_hero_frame.exr   -colorspace sRGB -depth 8   -strip -quality 90   fallback_horns_fhd.png

# Windows fallback (uses shared palette)
magick halos_hero_frame.exr   -remap palette_256.png   -depth 8 -compress RLE   BMP3:fallback_halos_1920.bmp
```

---

## Color Profiles & Encoding

### HORNS: Rec.709 Limited Range (Video Levels)
| Parameter | Value |
|-----------|-------|
| **Primaries** | Rec.709 (BT.709) |
| **Transfer** | BT.1886 (Gamma 2.4) |
| **Range** | Limited (16–235) — "Video Levels" |
| **Matrix** | BT.709 (for YUV encoding) |
| **White Point** | D65 (6504K) |
| **Mastering Display** | 100 nits (SDR) |
| **LUT** | `HORNS_Grade.cube` (creative) → `Rec709_Limited.cube` (technical) |

**Why Limited Range:** UEFI firmware video paths typically assume limited-range input; full-range content crushes blacks on many firmware implementations.

### HALOS: Rec.709 Full Range (PC Levels)
| Parameter | Value |
|-----------|-------|
| **Primaries** | Rec.709 (BT.709) |
| **Transfer** | sRGB (Gamma ~2.2) / BT.1886 |
| **Range** | Full (0–255) — "PC Levels" |
| **Matrix** | BT.709 (for YUV encoding) |
| **White Point** | D65 (6504K) |
| **Mastering Display** | 100 nits (SDR) |
| **LUT** | `HALOS_Grade.cube` (creative) → `Rec709_Full.cube` (technical) |

**Why Full Range:** HALOS relies on deep blacks (0) and peak whites (255) for gold-leaf specular highlights and stained-glass transmission; limited range clips both.

### Encoding Workflow
```
Render (EXR, Linear/ACEScg)
    ↓
Creative Grade (HORNS_Grade / HALOS_Grade) — 32-bit float
    ↓
Technical LUT (Rec709_Limited / Rec709_Full) — 32-bit float
    ↓
Quantize to 8-bit (dithered)
    ↓
Encode (H.264/VP9 for UEFI; BMP/RLE8 for Windows)
    ↓
Validate: Waveform scope, vectorscope, gamut check
```

### Gamut Validation
- **HORNS:** Zero pixels at code 0 or 255 (limited range headroom)
- **HALOS:** Controlled use of 0 and 255 for artistic intent (gold highlights, deep space)
- Both: No out-of-gamut colors (all within Rec.709 triangle)

---

## Particle System Specifications

### HORNS — Arterial Cells (Phase 3)
| Parameter | UEFI (Video) | Windows (bootres.dll) |
|-----------|--------------|----------------------|
| **Count** | 50,000–100,000 | 500 max (sprite budget) |
| **Shape** | Discocyte (biconcave disc, 7.5µm ref) | 4×4 pixel quad |
| **Color** | Arterial red gradient (oxygenated → deoxygenated) | Palette indices 17–32 |
| **Motion** | Peristaltic wave + Brownian drift | Pre-baked sprite sheet (8 frames) |
| **Shader** | Subsurface (SSS) + Fresnel | Additive blend, no lighting |
| **Lifecycle** | Birth: frame 51; Death: frame 100 | Birth: frame 20; Death: frame 80 |
| **Collision** | Vessel walls (SDF) | None (2D overlay) |

**Geometry Nodes / Particular Setup:**
```python
# UEFI: Blender Geometry Nodes or Trapcode Particular
# Emitter: Artery curve, uniform distribution
# Velocity: Curve tangent * pulse_wave(phase) + noise(0.02)
# Scale: 0.5–1.5x base (discocyte variation)
# Rotation: Align to velocity + random Z-spin
```

### HALOS — Gold Motes (Phase 1 & 6)
| Parameter | UEFI (Video) | Windows (bootres.dll) |
|-----------|--------------|----------------------|
| **Count** | 25,000 (FHD) / 100,000 (UHD) | 300 max |
| **Shape** | Sphere (subdivided ico) | 3×3 pixel cross/star |
| **Color** | Gold (#FFD700) → Pearl (iridescent) | Palette indices 49–64 |
| **Motion** | Upward + Perlin curl noise + φ-spiral attractor | Pre-baked spiral paths |
| **Shader** | Thin-film interference + emission | Additive, animated alpha |
| **Lifecycle** | Continuous birth (0–25), fade by 135 | Birth: frame 0; Death: frame 95 |
| **Trails** | Geometry Nodes curve trails | None (static sprites) |

**After Effects (Stardust/Particular):**
```javascript
// Stardust node setup
// Emitter: Box (comp size), Rate: 2000/sec
// Forces: Wind (Y: -50), Vortex (Z: 10), Curve Guide (φ-spiral)
// Shading: Color over life (Gold→White), Size over life (0→3→0px)
// Opacity: 0→100→0% (ease in/out)
// Trail: Ribbon renderer, 15 segments, taper 0.5
```

---

## Delivery Checklist

### Per Theme (HORNS / HALOS) — UEFI Deliverables
- [ ] `BootAnimation_FHD.mp4` (H.264, 1920×1080, 30fps, <10MB, no audio)
- [ ] `BootAnimation_UHD.mp4` (H.264, 3840×2160, 30fps, <10MB, no audio)
- [ ] `BootAnimation_FHD.webm` (VP9, 1920×1080, 30fps, <10MB, no audio)
- [ ] `BootAnimation_UHD.webm` (VP9, 3840×2160, 30fps, <10MB, no audio)
- [ ] `fallback_fhd.png` (1920×1080, 24-bit, <500KB)
- [ ] `fallback_uhd.png` (3840×2160, 24-bit, <500KB)
- [ ] Validation report: `validation_uefi_[theme].json`

### Per Theme (HORNS / HALOS) — Windows Deliverables
- [ ] `bootres_[theme]_1024.dll` (100 frames, 1024×768, 8-bit indexed, RLE8)
- [ ] `bootres_[theme]_1920.dll` (100 frames, 1920×1080, 8-bit indexed, RLE8)
- [ ] `fallback_1024.bmp` (1024×768, 8-bit indexed, RLE8, <100KB)
- [ ] `fallback_1920.bmp` (1920×1080, 8-bit indexed, RLE8, <100KB)
- [ ] `palette_256.act` (Adobe Color Table / .pal — shared palette)
- [ ] Validation report: `validation_win_[theme].json`

### Source Project Deliverables
- [ ] `BootAnimation_Template.aep` (After Effects master project)
- [ ] `BootAnimation_Template.blend` (Blender master project)
- [ ] All texture assets (EXR, 4k, organized in `Footage/Textures/`)
- [ ] All LUTs (`.cube` files in `Footage/LUTs/`)
- [ ] All scripts (`.jsx` for AE, `.py` for Blender in `Scripts/` / `Python_Scripts/`)
- [ ] Reference moodboard (PDF or contact sheet)
- [ ] `Manifest.json` (see below)

### Manifest.json Schema
```json
{
  "spec_version": "1.0",
  "generated": "2026-08-25T00:00:00Z",
  "themes": ["HORNS", "HALOS"],
  "uefi": {
    "horns": {
      "fhd_mp4": {"path": "UEFI/HORNS_FHD/BootAnimation_FHD.mp4", "size_bytes": 0, "frames": 150, "duration_s": 5.0, "sha256": ""},
      "uhd_mp4": {"path": "UEFI/HORNS_UHD/BootAnimation_UHD.mp4", "size_bytes": 0, "frames": 150, "duration_s": 5.0, "sha256": ""},
      "fhd_webm": {"path": "UEFI/HORNS_FHD/BootAnimation_FHD.webm", "size_bytes": 0, "frames": 150, "duration_s": 5.0, "sha256": ""},
      "uhd_webm": {"path": "UEFI/HORNS_UHD/BootAnimation_UHD.webm", "size_bytes": 0, "frames": 150, "duration_s": 5.0, "sha256": ""},
      "fallback_fhd": {"path": "Fallbacks/HORNS_Fallback_1080p.png", "size_bytes": 0, "sha256": ""},
      "fallback_uhd": {"path": "Fallbacks/HORNS_Fallback_4K.png", "size_bytes": 0, "sha256": ""}
    },
    "halos": { /* same structure */ }
  },
  "windows": {
    "horns": {
      "dll_1024": {"path": "Windows/HORNS_768p/bootres_horns_1024.dll", "size_bytes": 0, "frames": 100, "sha256": ""},
      "dll_1920": {"path": "Windows/HORNS_1080p/bootres_horns_1920.dll", "size_bytes": 0, "frames": 100, "sha256": ""},
      "fallback_1024": {"path": "Windows/HORNS_768p/fallback_horns_1024.bmp", "size_bytes": 0, "sha256": ""},
      "fallback_1920": {"path": "Windows/HORNS_1080p/fallback_horns_1920.bmp", "size_bytes": 0, "sha256": ""}
    },
    "halos": { /* same structure */ }
  },
  "shared": {
    "palette_256": {"path": "Windows/palette_256.act", "size_bytes": 0, "sha256": ""}
  },
  "validation": {
    "uefi_horns": "validation_uefi_horns.json",
    "uefi_halos": "validation_uefi_halos.json",
    "win_horns": "validation_win_horns.json",
    "win_halos": "validation_win_halos.json"
  }
}
```

### Validation Report Schema (`validation_*.json`)
```json
{
  "target": "UEFI_HORNS_FHD",
  "checks": {
    "resolution": {"expected": [1920,1080], "actual": [1920,1080], "pass": true},
    "frame_rate": {"expected": 30, "actual": 30.0, "pass": true},
    "frame_count": {"expected": 150, "actual": 150, "pass": true},
    "duration_s": {"expected": 5.0, "actual": 5.0, "pass": true},
    "file_size_mb": {"max": 10, "actual": 8.7, "pass": true},
    "audio_tracks": {"expected": 0, "actual": 0, "pass": true},
    "color_range": {"expected": "limited", "actual": "limited", "pass": true},
    "codec": {"expected": "h264_high_4.2", "actual": "h264_high_4.2", "pass": true},
    "gamut_clipping": {"pixels_oog": 0, "pass": true},
    "black_crush": {"pixels_at_16": 12, "threshold": 100, "pass": true},
    "white_clip": {"pixels_at_235": 8, "threshold": 100, "pass": true}
  },
  "overall": "PASS"
}
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-25 | Hermes Agent | Initial specification |

---

## Appendix: Quick Reference — Frame Maps

### HORNS UEFI (150 frames @ 30fps = 5.0s)
```
0–25:    Giger Corridor Descent
26–50:   Vertebral Tunnel
51–75:   Arterial Pulse (peak at 62)
76–105:  Beksiński Tower Emergence
106–130: Horned Skull Formation
131–150: Desktop Fade-In
```

### HALOS UEFI (150 frames @ 30fps = 5.0s)
```
0–25:    Light Particle Ascent
26–50:   Golden Ratio Spiral Formation
51–80:   Gothic Spire Growth
81–110:  Rose Window Bloom
111–135: Mandala Completion
136–150: Desktop Fade-In
```

### HORNS Windows (100 frames @ 30fps = 3.33s)
```
0–14:    Giger Corridor (simplified)
15–29:   Vertebral Tunnel
30–49:   Arterial Pulse
50–69:   Beksiński Towers
70–84:   Horned Skull
85–99:   Desktop Fade
```

### HALOS Windows (100 frames @ 30fps = 3.33s)
```
0–14:    Particle Ascent
15–29:   Golden Spiral
30–49:   Spire Growth
50–69:   Rose Window
70–84:   Mandala
85–99:   Desktop Fade
```

---

**END OF SPEC_BOOT.md**
