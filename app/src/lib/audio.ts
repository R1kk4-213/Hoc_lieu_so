let ctx: AudioContext | null = null;
let muted = false;

function getCtx() {
  if (!ctx) {
    const Ctor =
      (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctor) ctx = new Ctor();
  }
  return ctx;
}

export function unlockAudio() {
  const c = getCtx();
  if (c?.state === "suspended") c.resume();
}

export function setMuted(v: boolean) {
  muted = v;
}
export function isMuted() {
  return muted;
}

export type SfxType = "pass" | "fail" | "tada";

export function playSound(type: SfxType) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  const t = c.currentTime;
  if (type === "pass") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(820, t);
    osc.frequency.exponentialRampToValueAtTime(1550, t + 0.1);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc.start();
    osc.stop(t + 0.3);
  } else if (type === "fail") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(170, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.22);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
    osc.start();
    osc.stop(t + 0.22);
  } else {
    osc.type = "triangle";
    [523, 659, 784, 1046].forEach((f, i) => {
      osc.frequency.setValueAtTime(f, t + i * 0.09);
    });
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.6);
    osc.start();
    osc.stop(t + 0.6);
  }
}
