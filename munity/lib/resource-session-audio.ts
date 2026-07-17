"use client";

/**
 * Soft procedural session audio for Resource Hub play/pause.
 * Web Audio only — no media files required for the preview.
 */

export type ResourceAudioHandle = {
  stop: () => void;
};

export function startResourceSessionAudio(kind: "video" | "read"): ResourceAudioHandle | null {
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

  const padA = ctx.createOscillator();
  padA.type = "sine";
  padA.frequency.value = kind === "video" ? 146.83 : 130.81;

  const padB = ctx.createOscillator();
  padB.type = "triangle";
  padB.frequency.value = kind === "video" ? 220 : 196;

  const padGain = ctx.createGain();
  padGain.gain.value = kind === "video" ? 0.1 : 0.07;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = kind === "video" ? 680 : 480;
  filter.Q.value = 0.8;

  padA.connect(padGain);
  padB.connect(padGain);
  padGain.connect(filter);
  filter.connect(master);

  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.015;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = kind === "video" ? 420 : 320;
  noiseFilter.Q.value = 0.7;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.28;

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = kind === "video" ? 0.12 : 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = kind === "video" ? 90 : 60;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  // Short start chime so play feedback is obvious
  const chime = ctx.createOscillator();
  chime.type = "sine";
  chime.frequency.value = kind === "video" ? 523.25 : 392;
  const chimeGain = ctx.createGain();
  chimeGain.gain.value = 0.0001;
  chime.connect(chimeGain);
  chimeGain.connect(master);

  padA.start();
  padB.start();
  noise.start();
  lfo.start();
  chime.start();

  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(kind === "video" ? 0.26 : 0.18, now + 0.7);

  chimeGain.gain.setValueAtTime(0.0001, now);
  chimeGain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
  chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
  chime.stop(now + 0.6);

  void ctx.resume();

  return {
    stop() {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
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
      }, 400);
    },
  };
}
