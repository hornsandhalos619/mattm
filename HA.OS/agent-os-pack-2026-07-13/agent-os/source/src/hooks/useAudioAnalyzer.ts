import { useEffect, useState } from "react";
import { useAudioContext } from "@/contexts/AudioContext";

export function useAudioAnalyzer() {
  const { audioContext, analyser, isListening, isSpeaking } = useAudioContext();
  const [audioData, setAudioData] = useState(new Float32Array(0));
  
  useEffect(() => {
    if (!analyser) return;
    
    const dataArray = new Float32Array(analyser.frequencyBinCount);
    
    const analyze = () => {
      analyser.getFloatTimeDomainData(dataArray);
      setAudioData(dataArray.slice()); // copy so each frame has its own buffer
      
      if (audioContext?.state === "running") {
        requestAnimationFrame(analyze);
      }
    };
    
    if (audioContext?.state === "running") {
      requestAnimationFrame(analyze);
    }
    
    return () => {
      // Cleanup handled by audio context
    };
  }, [analyser, audioContext]);
  
  return { audioData: new Float32Array(audioData), isListening, isSpeaking };
}
