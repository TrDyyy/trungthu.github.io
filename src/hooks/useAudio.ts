import { useRef, useState, useCallback, useEffect } from 'react';

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'none';

    audio.addEventListener('canplaythrough', () => setIsAvailable(true));
    audio.addEventListener('error', () => setIsAvailable(false));

    audio.src = src;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Fade out
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
          audio.pause();
          audio.volume = 0.3;
          clearInterval(fadeOut);
        }
      }, 80);
      setIsPlaying(false);
    } else {
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        setIsAvailable(true);
        // Fade in
        const fadeIn = setInterval(() => {
          if (audio.volume < 0.28) {
            audio.volume = Math.min(0.3, audio.volume + 0.03);
          } else {
            clearInterval(fadeIn);
          }
        }, 80);
      }).catch(() => {
        setIsAvailable(false);
      });
    }
  }, [isPlaying]);

  return { isPlaying, isAvailable, toggle };
}
