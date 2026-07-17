"use client";

/**
 * Soft procedural ambient pad for mindful breathing sessions.
 * Uses Web Audio API so we don't ship a media asset or license attribution.
 */

type AmbientHandle = {
  stop: () => void;
  setMuted: (muted: boolean) => void;
  setBreathGain: (phase: "Inhale" | "Hold" | "Exhale") => void;
};

export function startCalmAmbient(): AmbientHandle | null {
  if (typeof window === "undefined") return null;

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);

  // Warm low pad
  const padA = ctx.createOscillator();
  padA.type = "sine";
  padA.frequency.value = 110;

  const padB = ctx.createOscillator();
  padB.type = "sine";
  padB.frequency.value = 164.81; // E3-ish

  const padGain = ctx.createGain();
  padGain.gain.value = 0.12;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 520;
  filter.Q.value = 0.7;

  padA.connect(padGain);
  padB.connect(padGain);
  padGain.connect(filter);
  filter.connect(master);

  // Gentle air / noise bed
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.02;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 380;
  noiseFilter.Q.value = 0.6;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.35;

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);

  // Slow shimmer LFO on filter
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 120;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  padA.start();
  padB.start();
  noise.start();
  lfo.start();

  // Fade in
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.22, now + 1.4);

  let muted = false;
  let target = 0.22;

  const setMaster = (value: number, seconds = 0.6) => {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
    master.gain.exponentialRampToValueAtTime(Math.max(value, 0.0001), t + seconds);
  };

  void ctx.resume();

  return {
    stop() {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      window.setTimeout(() => {
        try {
          padA.stop();
          padB.stop();
          noise.stop();
          lfo.stop();
          void ctx.close();
        } catch {
          // already closed
        }
      }, 560);
    },
    setMuted(nextMuted: boolean) {
      muted = nextMuted;
      setMaster(muted ? 0.0001 : target, 0.35);
    },
    setBreathGain(phase) {
      if (muted) return;
      target =
        phase === "Inhale" ? 0.28 : phase === "Exhale" ? 0.14 : 0.2;
      setMaster(target, 0.85);
    },
  };
}
