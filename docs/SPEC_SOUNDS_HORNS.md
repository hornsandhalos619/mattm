# HORNS Sound Design Specification
## 17 System Sounds — Biomechanical Horror, Wet, Visceral, Sub-Bass Heavy

**Format:** 48kHz / 24-bit WAV, -18 LUFS integrated, loopable where applicable
**Tools:** Vital (free), Serum, VCV Rack (free)
**Processing Chain:** Saturation → Bit-crush → Comb Filter → Sub-harmonic Generator

---

## 1. START-RITUAL — "The Cathedral Awakens"
**Concept:** Sub-hum drone (30Hz fundamental) + arterial pulse (1.5Hz modulation)
**Duration:** 3.0s (loopable tail 1.0s)

### Vital Patch
```
OSC 1: Wavetable "Sub" → Sine, -2 oct, Level 100%
  → Unison: 3 voices, Spread 5%, Detune 2ct
  → LFO 1 → Pitch (±12ct, Rate 0.67Hz, Shape: Sine) — arterial pulse
  → LFO 2 → Filter Cutoff (±15%, Rate 0.33Hz) — breath cycle
FILTER: Lowpass 24dB, Cutoff 120Hz, Res 15%, Drive 20%
  → Keytrack 0%, Vel Track 0%
AMP ENV: Attack 2.0s, Hold 0.5s, Decay 8.0s, Sustain 80%, Release 3.0s
FILTER ENV: Attack 0.5s, Decay 4.0s, Sustain 60%, Release 2.0s
LFO 1: Rate 0.67Hz (1/1.5s), Shape Sine, Delay 0s, Fade 1s
LFO 2: Rate 0.25Hz (4s breath), Shape Triangle, Delay 0s
FX CHAIN:
  1. Tube Saturation — Drive 35%, Mix 60%, Tone 40%
  2. Bitcrusher — Bitdepth 10, Downsample 2x, Mix 30%
  3. Comb Filter — Delay 33ms (30Hz), Feedback 45%, Damp 30%, Mix 25%
  4. Sub Oscillator — -1 Oct, Level 40%, Phase 0°
  5. Reverb — Hall, Size 85%, Decay 12s, Pre-delay 40ms, Mix 35%, Low Cut 80Hz
  6. Limiter — Ceiling -1dB, Release 100ms
```

### Serum Patch
```
OSC A: Basic Shapes → Sine, -2 Oct, WT Pos 0
  → Unison: 4, Detune 0.8%, Blend 50%
  → Warp: FM (from Osc B), Amount 12%
  → LFO 1 → Wavetable Position (±5, Rate 1/1.5s)
  → LFO 2 → Filter Cutoff (±20%, Rate 1/4s)
OSC B: Basic Shapes → Sine, -1 Oct, Level 60%
  → Warp: Sync, Amount modulated by LFO 3 (Rate 0.1Hz)
FILTER: Analog (MG Low 24), Cutoff 150Hz, Res 18%, Drive 15%
  → Filter Type: Lowpass, Fat 30%
AMP ENV: A 2.0s, H 0.5s, D 8.0s, S 80%, R 3.0s
FILTER ENV: A 0.5s, D 4.0s, S 60%, R 2.0s
LFO 1: 0.67Hz, Sine, Rise 1s → Osc A WT Pos, Osc A Level (±10%)
LFO 2: 0.25Hz, Triangle, Rise 0.5s → Filter Cutoff
LFO 3: 0.1Hz, Random, → Osc B Warp
FX:
  A. Distortion — Tube, Drive 40%, Mix 50%
  B. Compressor — Threshold -18dB, Ratio 4:1, Attack 10ms, Release 200ms
  C. Phaser — Rate 0.2Hz, Depth 60%, Feedback 30%, Mix 20%
  D. Delay — 1/4 Note Triplet, Feedback 40%, Low Cut 100Hz, High Cut 2kHz, Mix 25%
  E. Reverb — Cathedral, Size 90%, Decay 15s, Width 100%, Mix 40%
  F. EQ — High Shelf +3dB @ 8kHz, Low Shelf +2dB @ 40Hz
```

### VCV Rack Patch
```
Modules: VCO-1 (Fundamental), VCO-2 (Sub), VCF (VCF-1), VCA (VCA-1), 
         LFO-1 (Pulse), LFO-2 (Breath), Comb (Comb-1), Sat (Sat-1),
         BitCrush (BitCrush-1), Reverb (Rev-1), Limiter (Lim-1)

Connections:
  VCO-1 (Sine, 30Hz) → VCF In
  VCO-2 (Sine, 15Hz, Level 0.4) → VCF In (mix)
  LFO-1 (0.67Hz, Sine, 5Vpp) → VCO-1 FM In (attenuated 10%)
  LFO-1 → VCA-1 CV (attenuated 30%) — arterial pulse on amplitude
  LFO-2 (0.25Hz, Triangle, 5Vpp) → VCF Cutoff (attenuated 20%)
  VCF (Lowpass 24dB, Cutoff 120Hz, Res 0.15) → Sat-1 In
  Sat-1 (Tube, Drive 0.35, Mix 0.6) → BitCrush-1 In
  BitCrush-1 (Bits 10, Downsample 2, Mix 0.3) → Comb-1 In
  Comb-1 (Delay 33ms, Feedback 0.45, Damp 0.3, Mix 0.25) → Rev-1 In
  Rev-1 (Hall, Size 0.85, Decay 12s, Mix 0.35) → Lim-1 In
  Lim-1 (Ceiling -1dB) → Out

CV Sequencing:
  LFO-1 Rate: 0.67Hz constant
  LFO-2 Rate: 0.25Hz constant
  VCO-1 Pitch: Quantized to C1 (32.7Hz) with ±12ct jitter from Sample & Hold (LFO-3 @ 0.1Hz)
```

---

## 2. EXIT — "Bone Snap + Ichor Spurt"
**Concept:** Wet percussive transient (bone) → liquid tail (ichor)
**Duration:** 1.2s

### Vital
```
OSC 1: Wavetable "Noise" → White, Level 80%
  → Filter: Bandpass 12dB, Center 2.5kHz, BW 0.5 oct
  → AMP ENV: A 0ms, H 0ms, D 150ms, S 0%, R 50ms
OSC 2: Wavetable "Liquid" → Water droplet, Level 60%
  → Pitch: +12st, Pitch Env: A 0ms, D 800ms (exponential)
  → Filter: Lowpass 12dB, Cutoff 800Hz → 200Hz (Env)
  → AMP ENV: A 5ms, H 0ms, D 600ms, S 20%, R 200ms
FX:
  1. Transient Shaper — Attack +100%, Sustain -50%
  2. Saturation — Tape, Drive 50%, Mix 70%
  3. Comb Filter — Delay 2ms, Feedback 60%, Mix 40% (body resonance)
  4. Reverb — Plate, Size 30%, Decay 1.5s, Mix 40%
```

### Serum
```
OSC A: Noise → White, Level 0.8
  → Filter: Band 12, Freq 2.5kHz, Res 0.5
  → Env 1 → Level: A 0, D 150ms, S 0
OSC B: Wavetable "Organic" → Water, Level 0.6
  → Pitch: +12, Env 2 → Pitch: A 0, D 800ms (Exp)
  → Filter: Low 12, Freq 800→200Hz (Env 2)
  → Env 2: A 5ms, D 600ms, S 20%, R 200ms
FX: Transient (+100/-50), Distortion (Tube 50%), 
    Comb (2ms/60%), Reverb (Plate 30%/1.5s/40%)
```

### VCV
```
Noise → VCF (Bandpass 2.5kHz) → VCA (Env: 150ms decay)
VCO (Sine, 200Hz→50Hz pitch env) → VCF (Lowpass 800→200Hz) → VCA (Env: 600ms decay)
Both → Sat (Tape 0.5) → Comb (2ms/0.6) → Rev (Plate 1.5s/0.4)
```

---

## 3. MINIMIZE — "Vertebral Creak"
**Concept:** Low-frequency groan (60-80Hz) with slow pitch descent
**Duration:** 0.8s

### Vital
```
OSC 1: Wavetable "Formant" → Throat, Level 70%
  → Pitch: -1 Oct, Pitch Env: A 0ms, D 600ms (Linear, -24st)
  → Unison: 2 voices, Spread 3%
FILTER: Lowpass 12dB, Cutoff 200Hz, Res 25%
AMP ENV: A 50ms, D 500ms, S 30%, R 200ms
FX:
  1. Saturation — Tube, Drive 60%, Mix 80%
  2. Comb Filter — Delay 16ms (62.5Hz), Feedback 50%, Mix 35%
  3. Pitch Shifter — -12st, Mix 20% (sub-harmonic ghost)
```

---

## 4. MAXIMIZE — "Horn Curl + Pneumatic Hiss"
**Concept:** Rising metallic curl (FM) + filtered noise burst (hiss)
**Duration:** 1.0s

### Vital
```
OSC 1: Wavetable "FM" → FM Bell, Level 80%
  → Pitch: +2 Oct, Pitch Env: A 0ms, D 400ms (+12st)
  → FM Amount: Env 1 (A 0, D 300ms, 0→100%)
  → Unison: 5, Detune 2%, Spread 20%
OSC 2: Noise → Pink, Level 40%
  → Filter: Highpass 24dB, Cutoff 4kHz → 8kHz (Env 2)
  → AMP ENV: A 10ms, D 300ms, S 0%, R 100ms
FX:
  1. Frequency Shifter — +50Hz, Mix 30% (metallic)
  2. Saturation — Tube, Drive 45%, Mix 60%
  3. Chorus — Rate 0.5Hz, Depth 40%, Voices 3, Mix 25%
```

---

## 5. RESTORE — "Unfurl + Fluid Rush"
**Concept:** Reverse of maximize — descending fluid motion
**Duration:** 1.0s

### Vital
```
OSC 1: Wavetable "Liquid" → Flow, Level 70%
  → Pitch: -1 Oct, Pitch Env: A 0ms, D 500ms (-12st)
  → Filter: Lowpass 12dB, Cutoff 3kHz → 200Hz (Env)
OSC 2: Noise → Brown, Level 50%
  → Filter: Bandpass 12dB, Center 1.5kHz, BW 1 oct
  → AMP ENV: A 20ms, D 400ms, S 10%, R 150ms
FX:
  1. Reverse Reverb — Size 50%, Decay 2s, Mix 50% (pre-delay 100ms)
  2. Flanger — Rate 0.3Hz, Depth 60%, Feedback 40%, Mix 30%
```

---

## 6. OPEN — "Grimoire Page Turn"
**Concept:** Dry paper friction + subtle magical shimmer
**Duration:** 0.6s

### Vital
```
OSC 1: Wavetable "Paper" → Rustle, Level 60%
  → Filter: Bandpass 12dB, Center 3kHz, BW 0.8 oct
  → AMP ENV: A 2ms, D 200ms, S 0%, R 50ms
OSC 2: Wavetable "Magic" → Sparkle, Level 30%
  → Pitch: +2 Oct, Unison: 4, Detune 5%
  → AMP ENV: A 50ms, D 300ms, S 0%, R 200ms
FX:
  1. Transient Shaper — Attack +50%
  2. EQ — High Shelf +6dB @ 6kHz
  3. Reverb — Room, Size 20%, Decay 0.8s, Mix 25%
```

---

## 7. CLOSE — "Bone Snap" (short version of Exit)
**Duration:** 0.4s

### Vital
```
OSC 1: Noise → White, Level 90%
  → Filter: Bandpass 12dB, Center 3kHz, BW 0.4 oct
  → AMP ENV: A 0ms, D 80ms, S 0%, R 20ms
OSC 2: Sine, 150Hz → 40Hz (Pitch Env: A 0, D 100ms)
  → AMP ENV: A 0ms, D 120ms, S 0%, R 30ms
FX: Transient (+150%), Saturation (Tube 70%), Comb (1.5ms/70%)
```

---

## 8. EXCLAMATION — "Sigil Chime"
**Concept:** Resonant metallic strike with arterial ring
**Duration:** 2.0s (loopable tail)

### Vital
```
OSC 1: Wavetable "Bell" → Tubular, Level 80%
  → Pitch: +1 Oct, Unison: 3, Detune 1%
  → AMP ENV: A 1ms, D 1.5s, S 20%, R 800ms
OSC 2: Sine, 1500Hz (harmonic), Level 40%
  → AMP ENV: A 1ms, D 500ms, S 10%, R 400ms
FILTER: Lowpass 24dB, Cutoff 4kHz, Res 5%
FX:
  1. Comb Filter — Delay 2ms (500Hz), Feedback 70%, Mix 50%
  2. Phaser — Rate 0.4Hz, Depth 80%, Feedback 50%, Mix 30%
  3. Reverb — Hall, Size 70%, Decay 4s, Mix 45%
  4. Arterial Pulse: LFO 1 (1.5Hz) → Filter Cutoff (±10%)
```

---

## 9. HAND/ERROR — "Ichor Splash + Sub-harmonic"
**Concept:** Wet impact + diving sub-bass (40Hz→20Hz)
**Duration:** 1.5s

### Vital
```
OSC 1: Noise → White, Level 100%
  → Filter: Lowpass 12dB, Cutoff 500Hz → 100Hz (Env)
  → AMP ENV: A 2ms, D 300ms, S 0%, R 100ms
OSC 2: Sine, 40Hz → 20Hz (Pitch Env: A 0, D 1.2s, -12st)
  → Level 80%, Unison: 2, Detune 0%
  → AMP ENV: A 10ms, D 1.0s, S 30%, R 500ms
FX:
  1. Saturation — Tube, Drive 80%, Mix 90%
  2. Bitcrusher — Bits 8, Downsample 4x, Mix 50%
  3. Comb Filter — Delay 25ms (40Hz), Feedback 65%, Mix 60%
  4. Sub Oscillator — -2 Oct, Level 60%
  5. Reverb — Large Hall, Size 100%, Decay 6s, Mix 50%
```

---

## 10. QUESTION — "Whisper"
**Concept:** Breathy sibilance, barely audible
**Duration:** 0.8s

### Vital
```
OSC 1: Noise → Pink, Level 30%
  → Filter: Highpass 24dB, Cutoff 4kHz
  → AMP ENV: A 50ms, D 400ms, S 20%, R 200ms
  → Formant Filter: "Whisper" preset, Mix 80%
FX:
  1. Stereo Widener — Width 150%
  2. Reverb — Room, Size 15%, Decay 0.5s, Mix 60%
  3. Compressor — Threshold -30dB, Ratio 10:1, Attack 1ms, Release 500ms
```

---

## 11. DEFAULTBEEP — "Heartbeat"
**Concept:** Double-thump (lub-dub) at 72BPM
**Duration:** 0.83s (loopable)

### Vital
```
OSC 1: Sine, 60Hz, Level 100%
  → AMP ENV: A 5ms, D 80ms, S 0%, R 20ms
  → Repeat: Trigger at 0ms and 330ms (via LFO 1 @ 1.2Hz, Square)
FILTER: Lowpass 12dB, Cutoff 200Hz
FX:
  1. Saturation — Tube, Drive 30%, Mix 50%
  2. Compressor — Threshold -12dB, Ratio 3:1, Attack 5ms, Release 100ms
  3. Limiter — Ceiling -3dB
```

---

## 12. SIGILCAST — "Needle Draw + Arterial Resonance"
**Concept:** Scratching tattoo needle (1.5s) → resonant bloom
**Duration:** 2.5s

### Vital
```
OSC 1: Wavetable "Scratch" → Needle, Level 70%
  → Pitch: Modulated by LFO 1 (0.1Hz, Random) ±50ct
  → Filter: Highpass 12dB, Cutoff 1kHz
  → AMP ENV: A 0ms, H 1.5s (sustain), D 300ms, R 200ms
OSC 2: Sine, 120Hz (fundamental), Level 50%
  → Delayed Entry: AMP ENV A 1.5s, H 0.5s, D 1.0s
  → Filter: Lowpass 24dB, Cutoff 200Hz, Res 30%
  → LFO 2 (0.67Hz) → Filter Cutoff ±30% (arterial pulse)
FX:
  1. Saturation — Tape, Drive 40%, Mix 70%
  2. Comb Filter — Delay 8ms (125Hz), Feedback 55%, Mix 40%
  3. Reverb — Hall, Size 60%, Decay 3s, Mix 40%
  4. Delay — 1/8 Note, Feedback 30%, Mix 20%
```

---

## 13. TRANSMUTE — "Pitch Shift Up/Down"
**Concept:** Rapid frequency morph (HORNS→HALOS or reverse)
**Duration:** 1.5s

### Vital
```
OSC 1: Wavetable "Morph" → Spectral, Level 80%
  → Pitch Env: A 0ms, D 750ms (0→+12st for H→L, -12st for L→H)
  → Wavetable Pos Env: A 0, D 1.5s (0→100% or 100→0%)
  → Unison: 4, Detune 3%
FX:
  1. Frequency Shifter — ±200Hz sweep (Env controlled)
  2. Granular — Grain 50ms, Density 50%, Pitch ±12st, Mix 50%
  3. Phaser — Rate 2Hz→0.2Hz (Env), Depth 100%, Feedback 60%, Mix 80%
  4. Reverb — Modulated, Size 50%→100%, Decay 2s→6s, Mix 30%→60%
```

---

## 14. BREATHCYCLE — "4s Sub-hum Modulation"
**Concept:** Continuous 4-second modulation of the Cathedral hum
**Duration:** 4.0s (perfect loop)

### Vital
```
OSC 1: Sine, 30Hz, Level 100%
  → LFO 1 (0.25Hz, Triangle) → Level (±15%)
  → LFO 2 (0.25Hz, Sine, Phase 90°) → Filter Cutoff (±20%)
  → LFO 3 (0.125Hz, Random) → Pitch (±8ct)
FILTER: Lowpass 24dB, Cutoff 100Hz, Res 10%
FX:
  1. Comb Filter — Delay 33ms, Feedback 30% (LFO modulated ±10%), Mix 20%
  2. Reverb — Hall, Size 80%, Decay 10s, Mix 30%
```

---

## 15. VERTEBRALFLEX — "Comb Filter Sweep"
**Concept:** Spinal articulation — comb filter moving through harmonics
**Duration:** 3.0s (loopable)

### Vital
```
OSC 1: Sine, 30Hz + harmonics (via Wavetable "Harmonics"), Level 80%
  → LFO 1 (0.33Hz, Triangle) → Comb Delay (16ms→32ms→16ms)
  → Comb Feedback: LFO 2 (0.16Hz, Sine) 40%→60%→40%
FX:
  1. Comb Filter — Delay modulated, Feedback modulated, Mix 50%
  2. Phaser — Rate 0.5Hz, Depth 40%, Feedback 30%, Mix 25%
  3. EQ — Notch at 250Hz (Q 10), Gain -6dB (static body resonance)
```

---

## 16. HORNCURL — "FM Synthesis"
**Concept:** Horn curling = FM index sweep + pitch glide
**Duration:** 2.5s

### Vital
```
OSC 1: Wavetable "FM" → Brass, Level 90%
  → Carrier: 110Hz (A2), Modulator: 220Hz (A3)
  → FM Index Env: A 0ms, D 2.0s (0→100%)
  → Pitch Env: A 0ms, D 1.5s (+5st slight rise)
  → Unison: 3, Detune 2%
FX:
  1. Saturation — Tube, Drive 50%, Mix 70%
  2. Frequency Shifter — +30Hz, Mix 20%
  3. Chorus — Rate 0.4Hz, Depth 30%, Voices 4, Mix 30%
  4. Reverb — Plate, Size 40%, Decay 2s, Mix 35%
```

---

## 17. AMBIENTHISS — "Filtered Noise"
**Concept:** Constant arterial flow noise, barely audible
**Duration:** 10.0s (perfect loop)

### Vital
```
OSC 1: Noise → Brown, Level 15%
  → Filter: Bandpass 12dB, Center 800Hz, BW 1.5 oct
  → LFO 1 (0.1Hz, Sine) → Filter Center (600Hz↔1000Hz)
  → LFO 2 (0.05Hz, Triangle) → Level (±30%)
FX:
  1. EQ — Low Cut 200Hz, High Cut 4kHz
  2. Stereo — Width 80%, Pan modulated by LFO 3 (0.03Hz) ±20%
  3. Limiter — Ceiling -20dB (always quiet)
```

---

## RENDER SPECIFICATIONS
| Parameter | Value |
|-----------|-------|
| Sample Rate | 48,000 Hz |
| Bit Depth | 24-bit |
| Loudness | -18 LUFS integrated |
| True Peak | -1 dBTP |
| Loop Points | Marked in metadata (smpl chunk) |
| File Naming | `HORNS_01_StartRitual.wav` through `HORNS_17_AmbientHiss.wav` |

## MASTERING CHAIN (Applied to all)
```
1. EQ — High-pass 20Hz, 12dB/oct
2. Multiband Compressor:
   - Low (20-150Hz): Threshold -12dB, Ratio 3:1, Attack 30ms, Release 200ms
   - Mid (150Hz-4kHz): Threshold -18dB, Ratio 2:1, Attack 10ms, Release 150ms
   - High (4kHz+): Threshold -24dB, Ratio 1.5:1, Attack 5ms, Release 100ms
3. Stereo Enhancer — Width 110% (Mid/Side)
4. Limiter — Ceiling -1dBTP, Release 50ms, Lookahead 2ms
5. Dither — Triangular, 24-bit
```

---

## VITAL PRESET EXPORT
All patches exported as `.vital` files in `/presets/HORNS/`
Naming: `HORNS_01_StartRitual.vital` through `HORNS_17_AmbientHiss.vital`

## SERUM PRESET EXPORT
All patches exported as `.fxp` in `/presets/HORNS_Serum/`
Naming: `HORNS_01_StartRitual.fxp` through `HORNS_17_AmbientHiss.fxp`

## VCV RACK PATCH EXPORT
All patches exported as `.vcv` in `/presets/HORNS_VCV/`
Naming: `HORNS_01_StartRitual.vcv` through `HORNS_17_AmbientHiss.vcv`
