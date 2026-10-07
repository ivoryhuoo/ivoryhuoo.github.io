// Tiny synthesized sound effects (no audio files). Callers decide whether
// sound is switched on; nothing plays until the visitor turns it on.

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = 'square', gain = 0.04) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + at;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  boot: () => tone(880, 0, 0.05),
  ready: () => {
    tone(523, 0, 0.08, 'triangle');
    tone(784, 0.08, 0.14, 'triangle');
  },
  powerOn: () => {
    tone(330, 0, 0.07);
    tone(660, 0.07, 0.1);
  },
  powerOff: () => {
    tone(520, 0, 0.07);
    tone(260, 0.07, 0.12);
  },
  unlock: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12 + i * 0.08, 0.14, 'triangle', 0.05)),
};
