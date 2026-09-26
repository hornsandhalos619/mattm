-- HORNS & HALOS Animation Library
-- Breath cycle, pulse, and morph animations

function Initialize()
    breathPhase = 0
    pulsePhase = 0
    morphPhase = 0
end

function Update()
    -- Breath cycle (4s HORNS / 6s HALOS)
    local breathDuration = SELF:GetOption('6000', 4000)
    breathPhase = (breathPhase + 1000/60) % breathDuration
    local breathValue = math.sin(breathPhase / breathDuration * 2 * math.pi) * 0.5 + 0.5
    SKIN:Bang('!SetVariable', 'BreathValue', string.format('%.3f', breathValue))
    
    -- Pulse sigil (2s HORNS / 3s HALOS)
    local pulseDuration = SELF:GetOption('3000', 2000)
    pulsePhase = (pulsePhase + 1000/60) % pulseDuration
    local pulseValue = math.sin(pulsePhase / pulseDuration * 2 * math.pi) * 0.5 + 0.5
    SKIN:Bang('!SetVariable', 'PulseValue', string.format('%.3f', pulseValue))
    
    -- Morph/transition animations
    morphPhase = (morphPhase + 1000/60) % 1000
    local morphValue = math.sin(morphPhase / 1000 * 2 * math.pi) * 0.5 + 0.5
    SKIN:Bang('!SetVariable', 'MorphValue', string.format('%.3f', morphValue))
end

-- Easing functions
function EaseOutCubic(t)
    return 1 - math.pow(1 - t, 3)
end

function EaseInOutCubic(t)
    if t < 0.5 then
        return 4 * t * t * t
    else
        return 1 - math.pow(-2 * t + 2, 3) / 2
    end
end

function EaseOutElastic(t)
    local c4 = (2 * math.pi) / 3
    if t == 0 then return 0 end
    if t == 1 then return 1 end
    return math.pow(2, -10 * t) * math.sin((t * 10 - 0.75) * c4) + 1
end
