import { createContext, useContext, useRef, useState, useEffect } from "react";
import vocalsSrc from "../../assets/93Til/93Til_Vocals.mp3";

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio(vocalsSrc));
  const audio = audioRef.current;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const updateMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", updateMetadata);
    return () => audio.removeEventListener("loadedmetadata", updateMetadata);
  }, [audio]);

  const togglePlay = () => {
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const seek = (time) => {
    audio.currentTime = time;
  };

  const toggleMute = () => {
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        isPlaying,
        togglePlay,
        stop,
        seek,
        duration,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioEngine() {
  return useContext(AudioContext);
}
