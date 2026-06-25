// 使用Web Audio API生成古琴风格BGM和点击音效
// 无需外部音频文件

let audioCtx: AudioContext | null = null;
let bgmGain: GainNode | null = null;
let bgmPlaying = false;
let bgmTimeoutId: number | null = null;
let bgmMuted = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AC();
  }
  return audioCtx;
}

// 古琴五声音阶（宫商角徵羽）- C D E G A
const PENTATONIC = [
  130.81, // C3
  146.83, // D3
  164.81, // E3
  196.00, // G3
  220.00, // A3
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
];

// 生成单个古琴音
function playGuqinNote(freq: number, duration: number, startTime: number, volume: number = 0.15) {
  if (!audioCtx || !bgmGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  // 使用三角波模拟古琴弦音
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);

  // 低通滤波器柔化音色
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, startTime);
  filter.Q.setValueAtTime(1, startTime);

  // 古琴音色包络：快速起音，悠长衰减
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(volume * 0.5, startTime + duration * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  // 添加轻微颤音
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.frequency.setValueAtTime(4.5, startTime);
  lfoGain.gain.setValueAtTime(3, startTime);
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  lfo.start(startTime);
  lfo.stop(startTime + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(bgmGain);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// BGM循环：随机演奏五声音阶旋律，模拟古琴即兴
function scheduleBGMSequence() {
  if (!audioCtx || !bgmPlaying || bgmMuted) return;

  const now = audioCtx.currentTime;
  let noteTime = now;
  const notesToPlay = 3 + Math.floor(Math.random() * 4);

  for (let i = 0; i < notesToPlay; i++) {
    // 偏向中音区，加权随机选择音符
    const idx = Math.floor(Math.random() * PENTATONIC.length);
    const freq = PENTATONIC[idx];
    const dur = 1.2 + Math.random() * 2.5;
    const vol = 0.08 + Math.random() * 0.1;
    playGuqinNote(freq, dur, noteTime, vol);
    noteTime += dur * (0.6 + Math.random() * 0.5); // 音符间距
  }

  // 休息一段时间再继续
  const restTime = 2000 + Math.random() * 3000;
  bgmTimeoutId = window.setTimeout(scheduleBGMSequence, (noteTime - now) * 1000 + restTime);
}

export function startBGM() {
  if (bgmPlaying) return;
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  bgmGain = ctx.createGain();
  bgmGain.gain.setValueAtTime(bgmMuted ? 0 : 0.4, ctx.currentTime);
  bgmGain.connect(ctx.destination);

  bgmPlaying = true;
  scheduleBGMSequence();
}

export function stopBGM() {
  bgmPlaying = false;
  if (bgmTimeoutId) {
    clearTimeout(bgmTimeoutId);
    bgmTimeoutId = null;
  }
  if (bgmGain) {
    try {
      bgmGain.gain.exponentialRampToValueAtTime(0.001, audioCtx!.currentTime + 0.5);
      setTimeout(() => {
        bgmGain?.disconnect();
        bgmGain = null;
      }, 600);
    } catch { /* ignore */ }
  }
}

export function toggleMute(): boolean {
  bgmMuted = !bgmMuted;
  if (bgmGain && audioCtx) {
    bgmGain.gain.setTargetAtTime(bgmMuted ? 0 : 0.4, audioCtx.currentTime, 0.3);
  }
  return bgmMuted;
}

export function isMuted() {
  return bgmMuted;
}

// 点击音效（木石质感的轻击声）
export function playClick() {
  if (bgmMuted) return;
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch { /* ignore */ }
}

// 章节切换音效（钟声）
export function playChapterBell() {
  if (bgmMuted) return;
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.3;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 2);
    });
  } catch { /* ignore */ }
}
