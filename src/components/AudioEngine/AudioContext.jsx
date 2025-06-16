// src/components/AudioEngine/AudioContext.jsx
import { createContext, useContext, useRef, useState, useEffect } from "react";
import vocalsSrc from "../../assets/93Til/93Til_Vocals.mp3";
import bassSrc from "../../assets/93Til/93Til_Bass.mp3";
import drumsSrc from "../../assets/93Til/93Til_Drums.mp3";
import otherSrc from "../../assets/93Til/93Til_Other.mp3";

const AudioContext = createContext();

export function AudioProvider({ children }) {
  // create one Audio element per stem
  const stems = {
    vocals: new Audio(vocalsSrc),
    bass: new Audio(bassSrc),
    drums: new Audio(drumsSrc),
    other: new Audio(otherSrc),
  };

  const audioRefs = useRef(stems);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // since all stems are same length, pick one to read metadata
  useEffect(() => {
    const onMeta = () => setDuration(audioRefs.current.vocals.duration);
    audioRefs.current.vocals.addEventListener("loadedmetadata", onMeta);
    return () =>
      audioRefs.current.vocals.removeEventListener("loadedmetadata", onMeta);
  }, []);

  const playAll = () => {
    Object.values(audioRefs.current).forEach((a) => a.play());
    setIsPlaying(true);
  };
  const pauseAll = () => {
    Object.values(audioRefs.current).forEach((a) => a.pause());
    setIsPlaying(false);
  };
  const stopAll = () => {
    Object.values(audioRefs.current).forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
    setIsPlaying(false);
  };
  const seekAll = (t) => {
    Object.values(audioRefs.current).forEach((a) => (a.currentTime = t));
  };

  return (
    <AudioContext.Provider
      value={{
        audioRefs, // useRef({ vocals, bass, drums, other })
        isPlaying,
        duration,
        playAll,
        pauseAll,
        stopAll,
        seekAll,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioEngine() {
  return useContext(AudioContext);
}
