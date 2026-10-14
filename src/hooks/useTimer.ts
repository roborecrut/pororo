import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';

export function useTimer() {
  const {
    timeLeft,
    isRunning,
    mode,
    settings,
    setTimeLeft,
    setIsRunning,
    completeSession,
    startSession,
  } = useStore();

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const expectedTimeRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const now = Date.now();
    const expected = expectedTimeRef.current!;
    const drift = now - expected;

    setTimeLeft(useStore.getState().timeLeft - 1);
    expectedTimeRef.current = expected + 1000;

    // Compensate for drift
    const nextTick = Math.max(0, 1000 - drift);
    intervalRef.current = window.setTimeout(tick, nextTick);
  }, [setTimeLeft]);

  useEffect(() => {
    if (isRunning) {
      expectedTimeRef.current = Date.now() + 1000;
      intervalRef.current = window.setTimeout(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, tick]);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      completeSession();
      if (settings.soundEnabled) {
        playNotificationSound();
      }
    }
  }, [timeLeft, isRunning, completeSession, settings.soundEnabled]);

  const start = useCallback(() => {
    if (!useStore.getState().currentSession) {
      startSession();
    } else {
      setIsRunning(true);
    }
  }, [startSession, setIsRunning]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, [setIsRunning]);

  const reset = useCallback(() => {
    useStore.getState().resetTimer();
  }, []);

  return {
    timeLeft,
    isRunning,
    mode,
    totalTime: settings[mode] * 60,
    start,
    pause,
    reset,
  };
}

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Play a pleasant two-tone chime
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = audioCtx.currentTime;
    playTone(523.25, now, 0.3);       // C5
    playTone(659.25, now + 0.15, 0.3); // E5
    playTone(783.99, now + 0.3, 0.5);  // G5

    setTimeout(() => audioCtx.close(), 1500);
  } catch (e) {
    console.log('Audio not supported');
  }
}
