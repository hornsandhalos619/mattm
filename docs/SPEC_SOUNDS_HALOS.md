# HALOS Sound Design Specification
## 17 System Sounds — Celestial, Ethereal, Harmonic, Shimmering Highs

**Format:** 48kHz / 24-bit WAV, -18 LUFS integrated, loopable where applicable
**Tools:** Vital (free), Serum, VCV Rack (free)
**Processing Chain:** Granular Shimmer → Harmonic Exciter → Long Reverbs → Frequency Shifter → Additive Synthesis

---

## 1. START — "Singing Bowl + Choir Pad"
**Concept:** Tibetan singing bowl strike (300Hz fundamental) + choir pad swell
**Duration:** 4.0s (loopable tail 2.0s)

### Vital Patch
```
OSC 1: Wavetable "Bell" → Tibetan Bowl, Level 90%
  → Pitch: +1 Oct, Unison: 3 voices, Spread 8%, Detune 3ct
  → AMP ENV: A 10ms, H 500ms, D 3.0s, Sustain 40%, Release 2.0s
OSC 2: Wavetable "Choir" → Vowel "Ah", Level 50%
  → Pitch: -1 Oct, Unison: 5 voices, Spread 25%, Detune 5ct
  → AMP ENV: A 2.0s, H 1.0s, D 4.0s, Sustain 60%, Release 3.0s
  → LFO 1 (0.1Hz, Triangle) → Filter Cutoff (±15%) — slow shimmer
FILTER: Lowpass 12dB, Cutoff 2.5kHz, Res 8%, Drive 5%
  → Keytrack 50%, Vel Track 20%
AMP ENV (Global): A 10ms, D 500ms, S 70%, R 4.0s
LFO 1: Rate 0.1Hz (10s cycle), Shape Triangle, Delay 0.5s, Fade 2s
LFO 2: Rate 0.16Hz (6s breath), Shape Sine, Delay 1s
FX CHAIN:
  1. Harmonic Exciter — Drive 25%, Mix 40%, Tone 60%, Stereo 80%
  2. Granular Shimmer — Grain 100ms, Density 30%, Pitch +12st, Mix 30%, Reverse 50%
  3. Frequency Shifter — +12Hz, Mix 15% (ethereal lift)
  4. Chorus — Rate 0.15Hz, Depth 40%, Voices 6, Mix 35%, Stereo 100%
  5. Reverb — Cathedral, Size 95%, Decay 20s, Pre-delay 80ms, Mix 50%, Low Cut 100Hz, High Cut 12kHz
  6. Limiter — Ceiling -1dB, Release 200ms
```

### Serum Patch
```
OSC A: Basic Shapes → Sine, -1 Oct, WT Pos 0
  → Unison: 6, Detune 1.2%, Blend 60%
  → Warp: Bend -, Amount 20% (singing bowl harmonic series)
  → LFO 1 → WT Pos (±10, Rate 0.1Hz)
  → LFO 2 → Filter Cutoff (±25%, Rate 1/6s)
OSC B: Wavetable "Vocal" → Choir Ah, Level 0.5
  → Unison: 8, Detune 1.5%, Blend 70%
  → Warp: Sync, Amount modulated by LFO 3 (Rate 0.05Hz)
  → LFO 3 → Pitch (±50ct, Rate 0.08Hz)
FILTER: Analog (MG Low 12), Cutoff 3kHz, Res 10%, Drive 8%
  → Filter Type: Lowpass, Fat 40%
AMP ENV: A 10ms, D 500ms, S 70%, R 4.0s
FILTER ENV: A 2.0s, D 3.0s, S 50%, R 3.0s
LFO 1: 0.1Hz, Triangle, Rise 2s → Osc A WT Pos, Osc A Level (±15%)
LFO 2: 0.16Hz, Sine, Rise 1s → Filter Cutoff
LFO 3: 0.05Hz, Random, → Osc B Warp
FX:
  A. Distortion — Tube, Drive 15%, Mix 25%
  B. Compressor — Threshold -24dB, Ratio 2:1, Attack 50ms, Release 500ms
  C. Phaser — Rate 0.08Hz, Depth 80%, Feedback 40%, Mix 30%
  D. Delay — 1/2 Note, Feedback 35%, Low Cut 200Hz, High Cut 8kHz, Mix 30%
  E. Reverb — Cathedral, Size 100%, Decay 25s, Width 100%, Mix 55%
  F. EQ — High Shelf +4dB @ 10kHz, Low Shelf +2dB @ 60Hz
  G. OTT (Multiband) — Depth 30%, Upward 20%, Downward 15%
```

### VCV Rack Patch
```
Modules: VCO-1 (Bowl), VCO-2 (Choir), VCF (VCF-1), VCA (VCA-1), 
         LFO-1 (Shimmer), LFO-2 (Breath), Granular (Gran-1), 
         FreqShift (FS-1), Chorus (Cho-1), Reverb (Rev-1), Limiter (Lim-1)

Connections:
  VCO-1 (Sine + Harmonics, 300Hz) → VCF In
  VCO-2 (Complex, 150Hz, 8 voices) → VCF In (mix 0.5)
  LFO-1 (0.1Hz, Triangle, 5Vpp) → VCO-1 WT Pos (attenuated 20%)
  LFO-2 (0.16Hz, Sine, 5Vpp) → VCF Cutoff (attenuated 25%)
  LFO-1 → Gran-1 Pitch (attenuated 100%) — +12st grains
  VCF (Lowpass 12dB, Cutoff 2.5kHz, Res 0.08, Drive 0.05) → HarmExc In
  HarmExc (Drive 0.25, Mix 0.4) → Gran-1 In
  Gran-1 (Grain 100ms, Density 0.3, Pitch +12st, Mix 0.3, Rev 0.5) → FS-1 In
  FS-1 (Shift +12Hz, Mix 0.15) → Cho-1 In
  Cho-1 (Rate 0.15Hz, Depth 0.4, Voices 6, Mix 0.35) → Rev-1 In
  Rev-1 (Cathedral, Size 0.95, Decay 25s, Mix 0.55) → Lim-1 In
  Lim-1 (Ceiling -1dB) → Out

CV Sequencing:
  LFO-1 Rate: 0.1Hz constant
  LFO-2 Rate: 0.16Hz constant
  VCO-1 Pitch: Quantized to D4 (293.66Hz) with ±3ct jitter from Sample & Hold (LFO-3 @ 0.03Hz)
```

---

## 2. EXIT — "Bell Tone Decay"
**Concept:** Pure bell strike with infinite harmonic decay
**Duration:** 5.0s

### Vital
```
OSC 1: Wavetable "Bell" → Church Bell, Level 100%
  → Pitch: +1 Oct, Unison: 2, Detune 0.5%
  → AMP ENV: A 1ms, H 0ms, D 5.0s (Exponential), S 0%, R 0ms
  → Pitch Env: A 0ms, D 200ms (-24st slight drop)
FILTER: Lowpass 12dB, Cutoff 8kHz, Res 2%
FX:
  1. Harmonic Exciter — Drive 20%, Mix 50%
  2. Reverb — Cathedral, Size 100%, Decay 15s, Mix 60%
  3. EQ — High Shelf +6dB @ 12kHz
```

### Serum
```
OSC A: Basic Shapes → Sine, +1 Oct
  → Unison: 3, Detune 0.3%
  → Warp: Bend +, Amount 30%
  → Env 1 → Level: A 1ms, D 5s (Exp)
  → Env 2 → Pitch: A 0, D 200ms (-24st)
FILTER: Low 12, Freq 8kHz, Res 0.02
FX: Harm Exciter (20%/50%), Reverb (Cathedral 100%/15s/60%), EQ (+6dB @ 12kHz)
```

### VCV
```
VCO (Bell partials, 300Hz fundamental) → VCF (Lowpass 8kHz) → HarmExc (0.2/0.5) → Rev (Cathedral 25s/0.6) → Lim
```

---

## 3. MINIMIZE — "Page Turn + Gold Rustle"
**Concept:** Dry paper friction + gold leaf shimmer
**Duration:** 0.7s

### Vital
```
OSC 1: Wavetable "Paper" → Dry Rustle, Level 70%
  → Filter: Bandpass 12dB, Center 4kHz, BW 0.6 oct
  → AMP ENV: A 2ms, D 250ms, S 0%, R 50ms
OSC 2: Wavetable "Gold" → Leaf, Level 40%
  → Pitch: +2 Oct, Unison: 6, Detune 8%
  → AMP ENV: A 20ms, D 300ms, S 0%, R 150ms
FX:
  1. Transient Shaper — Attack +80%
  2. EQ — High Shelf +8dB @ 8kHz
  3. Granular — Grain 30ms, Density 20%, Pitch +24st, Mix 20%
  4. Reverb — Room, Size 15%, Decay 0.6s, Mix 30%
```

---

## 4. MAXIMIZE — "Spire Rise + Harmonic Swell"
**Concept:** Rising harmonic series (additive) + gold shimmer
**Duration:** 1.5s

### Vital
```
OSC 1: Wavetable "Additive" → Harmonic Series 1-16, Level 80%
  → Pitch Env: A 0ms, D 1.0s (+12st)
  → Wavetable Pos Env: A 0, D 1.5s (0→100% harmonic build)
  → Unison: 8, Detune 2%, Spread 30%
  → LFO 1 (0.2Hz, Sine) → WT Pos (±5%) — shimmer
FILTER: Lowpass 12dB, Cutoff 6kHz → 12kHz (Env), Res 5%
FX:
  1. Harmonic Exciter — Drive 30%, Mix 60%
  2. Frequency Shifter — +24Hz, Mix 20% (angelic lift)
  3. Chorus — Rate 0.1Hz, Depth 60%, Voices 8, Mix 40%
  4. Reverb — Hall, Size 80%, Decay 4s, Mix 45%
```

---

## 5. RESTORE — "Grace Note + Wing Unfurl"
**Concept:** Descending grace note + wing flutter (filtered noise)
**Duration:** 1.2s

### Vital
```
OSC 1: Wavetable "Grace" → Celeste, Level 70%
  → Pitch Env: A 0ms, D 600ms (-12st)
  → Filter: Lowpass 12dB, Cutoff 4kHz → 500Hz (Env)
  → AMP ENV: A 5ms, D 500ms, S 10%, R 300ms
OSC 2: Noise → Pink, Level 40%
  → Filter: Bandpass 12dB, Center 2kHz, BW 1.5 oct
  → AMP ENV: A 10ms, D 400ms, S 5%, R 200ms
  → LFO 1 (8Hz, Triangle) → Level (±40%) — wing flutter
FX:
  1. Reverse Reverb — Size 40%, Decay 1.5s, Mix 40%
  2. Flanger — Rate 0.2Hz, Depth 80%, Feedback 50%, Mix 35%
  3. Harmonic Exciter — Drive 15%, Mix 30%
```

---

## 6. OPEN — "Quill Scratch + Paper"
**Concept:** Sharp quill attack + paper resonance
**Duration:** 0.5s

### Vital
```
OSC 1: Wavetable "Quill" → Scratch, Level 80%
  → Filter: Highpass 12dB, Cutoff 2kHz
  → AMP ENV: A 1ms, D 150ms, S 0%, R 30ms
OSC 2: Wavetable "Paper" → Resonance, Level 30%
  → Filter: Bandpass 12dB, Center 1.5kHz, BW 1 oct
  → AMP ENV: A 5ms, D 200ms, S 0%, R 100ms
FX:
  1. Transient Shaper — Attack +100%
  2. EQ — High Shelf +10dB @ 10kHz
  3. Reverb — Room, Size 10%, Decay 0.4s, Mix 20%
```

---

## 7. CLOSE — "Book Close + Dust Mote"
**Concept:** Soft thud + golden dust shimmer
**Duration:** 0.8s

### Vital
```
OSC 1: Sine, 80Hz, Level 60%
  → AMP ENV: A 2ms, D 200ms, S 0%, R 100ms
OSC 2: Wavetable "Dust" → Motes, Level 40%
  → Pitch: +3 Oct, Unison: 12, Detune 15%, Spread 50%
  → Filter: Highpass 12dB, Cutoff 6kHz
  → AMP ENV: A 50ms, D 400ms, S 20%, R 300ms
FX:
  1. Saturation — Tape, Drive 20%, Mix 40%
  2. Granular — Grain 50ms, Density 15%, Pitch +36st, Mix 25%
  3. Reverb — Room, Size 20%, Decay 1.0s, Mix 35%
```

---

## 8. EXCLAMATION — "Mandala Resonance"
**Concept:** Geometric harmonic convergence — mandala completes
**Duration:** 3.0s (loopable tail)

### Vital
```
OSC 1: Wavetable "Mandala" → Harmonic Stack (1:1.618:2.618:4.236), Level 90%
  → Pitch: +1 Oct, Unison: 5 (phi spacing), Detune 1%
  → AMP ENV: A 5ms, D 2.5s, S 30%, R 1.5s
  → LFO 1 (0.25Hz, Sine) → WT Pos (±3%) — phi breathing
OSC 2: Wavetable "Bell" → Singing Bowl, Level 30%
  → Pitch: +2 Oct, AMP ENV: A 1ms, D 1.0s, S 0%, R 500ms
FILTER: Lowpass 12dB, Cutoff 5kHz, Res 10%
FX:
  1. Comb Filter — Delay 1.618ms (phi ms), Feedback 61.8%, Mix 40%
  2. Phaser — Rate 0.16Hz, Depth 61.8%, Feedback 40%, Mix 30%
  3. Frequency Shifter — +16.18Hz, Mix 15%
  4. Reverb — Cathedral, Size 90%, Decay 8s, Mix 50%
  5. Delay — 1/φ Note (0.618s), Feedback 38.2%, Mix 25%
```

---

## 9. HAND/ERROR — "Dissonant Grace Note + Long Verb"
**Concept:** Beautiful mistake — minor second clash resolving in light
**Duration:** 2.5s

### Vital
```
OSC 1: Wavetable "Voice" → Choir, Level 70%
  → Pitch: Minor 2nd interval (simultaneous), Unison: 4, Detune 50ct
  → AMP ENV: A 10ms, D 1.5s, S 20%, R 800ms
OSC 2: Wavetable "Bell" → Dissonant, Level 30%
  → Pitch: +1 Oct + 50ct, AMP ENV: A 5ms, D 500ms, S 0%, R 400ms
FILTER: Lowpass 12dB, Cutoff 3kHz, Res 15%
FX:
  1. Harmonic Exciter — Drive 40%, Mix 50% (enhances dissonance)
  2. Reverb — Cathedral, Size 100%, Decay 12s, Mix 70%
  3. Delay — 1/4 Note, Feedback 50%, Mix 30%
  4. Frequency Shifter — -8Hz, Mix 10% (slow descent)
```

---

## 10. QUESTION — "Celestial Chime"
**Concept:** Pure high chime with harmonic rain
**Duration:** 1.8s

### Vital
```
OSC 1: Wavetable "Chime" → Tubular High, Level 80%
  → Pitch: +3 Oct, Unison: 3, Detune 0.5%
  → AMP ENV: A 1ms, D 1.2s, S 10%, R 600ms
OSC 2: Wavetable "Rain" → Harmonic Drops, Level 20%
  → Pitch: Random ±100ct (LFO 1 @ 2Hz, Random)
  → AMP ENV: A 50ms, D 800ms, S 0%, R 400ms
FX:
  1. Frequency Shifter — +32Hz, Mix 20%
  2. Chorus — Rate 0.5Hz, Depth 80%, Voices 6, Mix 40%
  3. Reverb — Hall, Size 85%, Decay 6s, Mix 55%
  4. Delay — 1/8 Note Triplet, Feedback 25%, Mix 20%
```

---

## 11. DEFAULTBEEP — "Pure Sine + Shimmer"
**Concept:** Perfect sine wave with golden shimmer tail
**Duration:** 0.5s

### Vital
```
OSC 1: Sine, 880Hz (A5), Level 100%
  → AMP ENV: A 2ms, D 200ms, S 0%, R 100ms
OSC 2: Wavetable "Shimmer" → Harmonic Rain, Level 15%
  → Pitch: +2 Oct, AMP ENV: A 50ms, D 500ms, S 0%, R 300ms
FX:
  1. Harmonic Exciter — Drive 10%, Mix 30%
  2. Reverb — Plate, Size 50%, Decay 2s, Mix 40%
  3. Limiter — Ceiling -3dB
```

---

## 12. SIGILCAST — "Gold Leaf Draw + Harmonic Excitation"
**Concept:** Gold leaf being applied (2s) → harmonic bloom
**Duration:** 3.0s

### Vital
```
OSC 1: Wavetable "GoldLeaf" → Application, Level 70%
  → Pitch: Modulated by LFO 1 (0.15Hz, Random) ±30ct
  → Filter: Highpass 12dB, Cutoff 800Hz
  → AMP ENV: A 0ms, H 2.0s, D 400ms, R 300ms
OSC 2: Wavetable "Harmonic" → Additive Bloom, Level 40%
  → Delayed Entry: AMP ENV A 2.0s, H 0.5s, D 1.5s
  → Filter: Lowpass 12dB, Cutoff 8kHz, Res 20%
  → LFO 2 (0.25Hz) → Filter Cutoff ±40% (breath shimmer)
FX:
  1. Harmonic Exciter — Drive 35%, Mix 60%
  2. Granular — Grain 80ms, Density 25%, Pitch +12st, Mix 35%
  3. Reverb — Hall, Size 70%, Decay 4s, Mix 50%
  4. Frequency Shifter — +8Hz, Mix 15%
```

---

## 13. TRANSMUTE — "Pitch Shift + Granular Morph"
**Concept:** Golden ratio morph between themes
**Duration:** 2.0s

### Vital
```
OSC 1: Wavetable "Morph" → Spectral Crossfade, Level 80%
  → Pitch Env: A 0ms, D 1.0s (±12st)
  → Wavetable Pos Env: A 0, D 2.0s (0↔100% at φ point)
  → Unison: 6, Detune 2%, Spread φ%
FX:
  1. Frequency Shifter — ±φ×50Hz sweep (Env)
  2. Granular — Grain 61.8ms, Density φ×20%, Pitch ±12st, Mix φ×30%
  3. Phaser — Rate 2Hz→0.16Hz (Env), Depth 100%, Feedback φ×50%, Mix 80%
  4. Reverb — Modulated, Size 50%→100%, Decay 2s→8s, Mix 30%→60%
  5. Harmonic Exciter — Drive modulated by Env (0%→40%)
```

---

## 14. BREATHCYCLE — "6s Choir Pad Modulation"
**Concept:** Divine respiration — choir pad swelling with φ timing
**Duration:** 6.0s (perfect loop)

### Vital
```
OSC 1: Wavetable "Choir" → Vowel Morph, Level 80%
  → LFO 1 (0.166Hz, Triangle) → Level (±20%)
  → LFO 2 (0.166Hz, Sine, Phase 90°) → Filter Cutoff (±30%)
  → LFO 3 (0.083Hz, Random) → WT Pos (±10%)
  → LFO 4 (0.055Hz, Triangle) → Unison Spread (±15%)
FILTER: Lowpass 12dB, Cutoff 2kHz, Res 8%
FX:
  1. Harmonic Exciter — Drive 15% (LFO modulated ±5%), Mix 40%
  2. Granular Shimmer — Grain 200ms, Density 10%, Pitch +12st, Mix 20%
  3. Reverb — Cathedral, Size 95%, Decay 15s, Mix 45%
  4. Chorus — Rate 0.08Hz, Depth 30%, Voices 8, Mix 25%
```

---

## 15. SPIRESWAY — "Frequency Shift"
**Concept:** Gothic spires swaying — slow frequency modulation
**Duration:** 4.0s (loopable)

### Vital
```
OSC 1: Wavetable "Spire" → Resonant Pipe, Level 70%
  → LFO 1 (0.25Hz, Triangle) → Pitch (±50ct)
  → LFO 2 (0.125Hz, Sine) → Filter Cutoff (±40%)
  → LFO 3 (0.0625Hz, Triangle) → Level (±15%)
FILTER: Bandpass 12dB, Center 1.5kHz, BW 1 oct
FX:
  1. Frequency Shifter — LFO 1 → Shift (±20Hz)
  2. Phaser — Rate 0.125Hz, Depth 50%, Feedback 30%, Mix 30%
  3. Reverb — Hall, Size 80%, Decay 6s, Mix 40%
```

---

## 16. WINGUNFOLD — "Additive Sweep"
**Concept:** Wings unfolding — additive harmonic bloom
**Duration:** 3.0s

### Vital
```
OSC 1: Wavetable "Additive" → Harmonic Build (1→16 partials), Level 90%
  → Wavetable Pos Env: A 0ms, D 3.0s (0→100%)
  → Pitch Env: A 0ms, D 2.0s (-5st slight descent)
  → Unison: 16 (full harmonic series), Detune 1%, Spread 20%
FX:
  1. Harmonic Exciter — Drive 40% (Env controlled), Mix 70%
  2. Frequency Shifter — +12Hz, Mix 15%
  3. Chorus — Rate 0.1Hz, Depth 50%, Voices 12, Mix 45%
  4. Reverb — Cathedral, Size 90%, Decay 8s, Mix 55%
  4. Delay — 1/φ Note, Feedback 30%, Mix 20%
```

---

## 17. AMBIENTGRACE — "Harmonic Drones"
**Concept:** Eternal harmonic presence — barely audible grace
**Duration:** 30.0s (perfect loop)

### Vital
```
OSC 1: Wavetable "Drone" → Harmonic Bed (1:φ:φ²:φ³), Level 10%
  → LFO 1 (0.033Hz, Sine) → Level (±20%)
  → LFO 2 (0.02Hz, Triangle) → Filter Cutoff (±30%)
  → LFO 3 (0.01Hz, Random) → WT Pos (±5%)
  → LFO 4 (0.016Hz, Sine, Phase 120°) → Pitch (±12ct)
FILTER: Lowpass 12dB, Cutoff 1.5kHz, Res 5%
FX:
  1. Harmonic Exciter — Drive 5%, Mix 20%
  2. Granular Shimmer — Grain 500ms, Density 5%, Pitch +12st, Mix 10%
  3. Reverb — Cathedral, Size 100%, Decay 30s, Mix 30%
  3. Stereo — Width 120%, Pan modulated by LFO 5 (0.005Hz) ±30%
  4. Limiter — Ceiling -30dB (always whisper-quiet)
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
| File Naming | `HALOS_01_Start.wav` through `HALOS_17_AmbientGrace.wav` |

## MASTERING CHAIN (Applied to all)
```
1. EQ — High-pass 20Hz, 12dB/oct
2. Multiband Compressor:
   - Low (20-200Hz): Threshold -18dB, Ratio 2:1, Attack 50ms, Release 300ms
   - Mid (200Hz-5kHz): Threshold -18dB, Ratio 1.5:1, Attack 20ms, Release 200ms
   - High (5kHz+): Threshold -24dB, Ratio 1.2:1, Attack 10ms, Release 150ms
3. Harmonic Exciter — Drive 10%, Mix 20%, Tone 70% (global)
4. Stereo Enhancer — Width 115% (Mid/Side)
5. Limiter — Ceiling -1dBTP, Release 100ms, Lookahead 2ms
6. Dither — Triangular, 24-bit
```

---

## VITAL PRESET EXPORT
All patches exported as `.vital` files in `/presets/HALOS/`
Naming: `HALOS_01_Start.vital` through `HALOS_17_AmbientGrace.vital`

## SERUM PRESET EXPORT
All patches exported as `.fxp` in `/presets/HALOS_Serum/`
Naming: `HALOS_01_Start.fxp` through `HALOS_17_AmbientGrace.fxp`

## VCV RACK PATCH EXPORT
All patches exported as `.vcv` in `/presets/HALOS_VCV/`
Naming: `HALOS_01_Start.vcv` through `HALOS_17_AmbientGrace.vcv`
