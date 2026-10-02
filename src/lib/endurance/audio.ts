// ─────────────────────────────────────────────────────────────
// Sonido 8-bit generado en el navegador con Web Audio API.
// Sin librerías ni archivos de audio: 0 KB de descarga extra.
// La música y los efectos son originales (no usan temas de terceros).
// ─────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

function tone(type: OscillatorType, freq: number, start: number, dur: number, vol: number, slideTo?: number, out?: AudioNode) {
  const c = ctx!;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(out ?? master!);
  o.start(start);
  o.stop(start + dur + 0.02);
}

function noise(start: number, dur: number, vol: number, cutoff: number, out?: AudioNode) {
  const c = ctx!;
  const s = c.createBufferSource();
  s.buffer = noiseBuf;
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(cutoff, start);
  f.frequency.exponentialRampToValueAtTime(Math.max(80, cutoff / 8), start + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  s.connect(f).connect(g).connect(out ?? master!);
  s.start(start);
  s.stop(start + dur + 0.02);
}

// ── Efectos ─────────────────────────────────────────────────
export const sfx = {
  /** Golpe seco: para los botones principales */
  punch() {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    noise(t, 0.16, 0.55, 3200);
    tone('square', 180, t, 0.16, 0.22, 45);
    tone('sine', 90, t, 0.22, 0.4, 35);
  },
  /** Toque corto: botones secundarios, pestañas, copiar */
  tap() {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    tone('square', 880, t, 0.06, 0.08, 1320);
  },
  /** Carga de energía: al encender la música */
  powerUp() {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    [57, 60, 64, 69, 72, 76, 81].forEach((n, i) => tone('square', hz(n), t + i * 0.045, 0.09, 0.09));
    tone('sawtooth', 110, t, 0.45, 0.05, 880);
  },
};

// ── Música: loop original en La menor, 150 BPM ──────────────
const STEP = 60 / 150 / 4; // duración de una semicorchea
// [nota MIDI, duración en semicorcheas]; 0 = silencio. 8 compases: Am F G E (x2)
const LEAD: [number, number][] = [
  [69, 2], [72, 2], [76, 2], [74, 1], [72, 1], [69, 4], [67, 2], [69, 2],
  [65, 2], [69, 2], [72, 2], [74, 2], [72, 4], [69, 2], [67, 2],
  [67, 2], [71, 2], [74, 2], [79, 2], [77, 2], [76, 2], [74, 2], [71, 2],
  [76, 4], [75, 2], [76, 2], [71, 4], [0, 4],
  [81, 1], [0, 1], [81, 1], [0, 1], [79, 2], [76, 2], [81, 2], [84, 2], [83, 2], [81, 2],
  [77, 2], [76, 2], [77, 2], [81, 2], [84, 4], [81, 4],
  [79, 2], [83, 2], [86, 2], [83, 2], [79, 2], [77, 2], [76, 2], [74, 2],
  [76, 2], [80, 2], [83, 2], [88, 6], [0, 4],
];
const ROOTS = [45, 41, 43, 40, 45, 41, 43, 40];
const LOOP_STEPS = 16 * ROOTS.length;

// Línea melódica expandida a una nota (o silencio) por semicorchea de inicio
const LEAD_AT: Record<number, [number, number]> = {};
{
  let s = 0;
  for (const [n, d] of LEAD) { if (n) LEAD_AT[s] = [n, d]; s += d; }
}

let musicGain: GainNode | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let nextTime = 0;
let step = 0;

function scheduleStep(s: number, t: number) {
  const bar = Math.floor(s / 16);
  const inBar = s % 16;
  const out = musicGain!;
  const lead = LEAD_AT[s];
  if (lead) tone('square', hz(lead[0]), t, lead[1] * STEP * 0.9, 0.07, undefined, out);
  if (inBar % 2 === 0) {
    const root = ROOTS[bar];
    tone('triangle', hz(inBar % 4 === 0 ? root : root + 12), t, STEP * 1.8, 0.16, undefined, out);
  }
  if (inBar === 0 || inBar === 8 || inBar === 10) tone('sine', 120, t, 0.12, 0.35, 40, out); // bombo
  if (inBar === 4 || inBar === 12) noise(t, 0.1, 0.18, 4000, out); // caja
  if (inBar % 2 === 1) noise(t, 0.03, 0.05, 9000, out); // platillo
}

export const music = {
  get playing() { return timer !== null; },
  start() {
    const c = ac(); if (!c || timer) return;
    musicGain = c.createGain();
    musicGain.gain.setValueAtTime(0.0001, c.currentTime);
    musicGain.gain.exponentialRampToValueAtTime(0.55, c.currentTime + 0.6);
    musicGain.connect(master!);
    nextTime = c.currentTime + 0.1;
    step = 0;
    timer = setInterval(() => {
      while (nextTime < c.currentTime + 0.15) {
        scheduleStep(step, nextTime);
        nextTime += STEP;
        step = (step + 1) % LOOP_STEPS;
      }
    }, 30);
  },
  stop() {
    if (!ctx || !timer) return;
    clearInterval(timer);
    timer = null;
    const g = musicGain!;
    g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    setTimeout(() => g.disconnect(), 400);
  },
};
