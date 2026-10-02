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
/** Despierta el audio (llamar dentro de un toque o clic) */
export function unlockAudio() { ac(); }

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

// ── Música: tema original de batalla en Re menor, 165 BPM ────
// Bajo galopante en semicorcheas, arpegio de "carga de energía" y una
// melodía heroica. Progresión i–VI–VII–i / i–VI–VII–V.
const STEP = 60 / 165 / 4; // duración de una semicorchea
// [nota MIDI, duración en semicorcheas]; 0 = silencio. 8 compases
const LEAD: [number, number][] = [
  [74, 6], [72, 2], [74, 4], [77, 4],
  [76, 6], [74, 2], [72, 4], [70, 4],
  [72, 4], [76, 4], [79, 4], [76, 2], [79, 2],
  [81, 12], [0, 4],
  [74, 2], [74, 2], [77, 2], [81, 2], [86, 6], [84, 2],
  [82, 6], [81, 2], [79, 4], [77, 4],
  [79, 4], [77, 2], [76, 2], [77, 4], [79, 4],
  [81, 8], [73, 4], [76, 4],
];
const ROOTS = [38, 34, 36, 38, 38, 34, 36, 33];
const CHORDS = [
  [62, 65, 69], [58, 62, 65], [60, 64, 67], [62, 65, 69],
  [62, 65, 69], [58, 62, 65], [60, 64, 67], [57, 61, 64],
];
const LOOP_STEPS = 16 * ROOTS.length;

// Melodía expandida: nota que empieza en cada semicorchea
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
  if (lead) {
    tone('square', hz(lead[0]), t, lead[1] * STEP * 0.95, 0.075, undefined, out);
    tone('square', hz(lead[0]) * 1.005, t, lead[1] * STEP * 0.95, 0.03, undefined, out); // grosor
  }
  // Bajo galopante: raíz, raíz, octava, raíz
  const root = ROOTS[bar];
  tone('triangle', hz(inBar % 4 === 2 ? root + 12 : root), t, STEP * 0.9, 0.2, undefined, out);
  if (inBar % 4 === 0) tone('square', hz(root), t, STEP * 0.8, 0.035, undefined, out);
  // Arpegio de energía
  const c = CHORDS[bar];
  const arp = [c[0], c[1], c[2], c[0] + 12][inBar % 4] + 12;
  tone('square', hz(arp), t, STEP * 0.6, 0.022, undefined, out);
  // Batería: bombo en 1 y 3 (+ doble al final del ciclo), caja en 2 y 4, platillo en corcheas
  const lastBar = bar === ROOTS.length - 1;
  if (inBar === 0 || inBar === 8 || inBar === 7 || (lastBar && inBar >= 12)) tone('sine', 130, t, 0.13, 0.38, 38, out);
  if (inBar === 4 || inBar === 12 || (lastBar && inBar >= 13)) noise(t, 0.11, 0.2, 4500, out);
  if (inBar % 2 === 0) noise(t, 0.03, 0.045, 10000, out);
}

export const music = {
  get playing() { return timer !== null; },
  /** Arranca la música. Si el navegador aún no deja sonar (sin interacción), queda lista y suena al primer toque. */
  start() {
    const c = ac(); if (!c || timer) return;
    musicGain = c.createGain();
    musicGain.gain.setValueAtTime(0.0001, c.currentTime);
    musicGain.gain.exponentialRampToValueAtTime(0.55, c.currentTime + 0.6);
    musicGain.connect(master!);
    nextTime = c.currentTime + 0.1;
    step = 0;
    timer = setInterval(() => {
      if (c.state !== 'running') { nextTime = c.currentTime + 0.1; return; }
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
