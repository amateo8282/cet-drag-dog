// Web Audio API 기반 효과음 합성
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// 강아지 짖는 소리 (Fetch! 클릭 시)
export function playBarkSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // 짧은 "멍!" 소리 - 주파수 변조로 짖는 느낌
  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300 + i * 100, now + i * 0.12);
    osc.frequency.exponentialRampToValueAtTime(150, now + i * 0.12 + 0.1);

    gain.gain.setValueAtTime(0.15, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.15);
  }
}

// 완료 차임 (스크랩 저장 완료 시)
export function playSuccessSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + i * 0.1);

    gain.gain.setValueAtTime(0.12, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.35);
  });
}
