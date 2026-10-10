/**
 * Web Audio API Retro 8-bit Synthesizer
 * Zero external audio files required!
 */
class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private bgmOscillators: OscillatorNode[] = [];
  private isBgmPlaying: boolean = false;
  private bgmTimeoutId: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Blip when hovering or switching items
  public playBlip(freq = 440) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // AudioContext could be blocked by browser policy before first interaction
    }
  }

  // Typewriter soft 8-bit click
  public playTypewriter() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const pitch = 300 + Math.random() * 80;
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Ignore
    }
  }

  // Equip fanfare sound (when player selects a new costume)
  public playEquip() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [261.63, 329.63, 392.0, 523.25]; // C, E, G, High C
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        const start = this.ctx!.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.14);
      });
    } catch {
      // Ignore
    }
  }

  // Celebratory Login Fanfare chime
  public playLoginSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Traditional Vietnamese pentatonic welcoming chime: Do, Re, Fa, Sol, La, High Do
      const notes = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        const start = this.ctx!.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  // Âm thanh Đóng Dấu Thần Tốc (Thump & Golden Chime khi cấp con dấu di sản)
  public playStampSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Tiếng dập ấn gỗ / kim ngọc (Low punch thump)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      subGain.gain.setValueAtTime(0.25, now);
      subGain.gain.linearRampToValueAtTime(0.001, now + 0.14);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.14);

      // 2. Tiếng ngân vàng kim lấp lánh (Golden sparkle arpeggio)
      const chimes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      chimes.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        const t = now + 0.04 + idx * 0.05;
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      });
    } catch {
      // Ignore
    }
  }

  // Khúc Khải Hoàn Đại Sứ Di Sản Hoàn Thành 100% (Grand Journey Completion Fanfare)
  public playJourneyCompleteFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Dàn hợp âm đại hỷ: Do - Mi - Sol - La - Đô cao - Mi cao
      const grandNotes = [
        { f: 261.63, delay: 0, dur: 0.2 },
        { f: 329.63, delay: 0.12, dur: 0.2 },
        { f: 392.0, delay: 0.24, dur: 0.2 },
        { f: 523.25, delay: 0.36, dur: 0.3 },
        { f: 659.25, delay: 0.52, dur: 0.35 },
        { f: 783.99, delay: 0.70, dur: 0.4 },
        { f: 1046.5, delay: 0.90, dur: 0.8 },
      ];

      grandNotes.forEach(({ f, delay, dur }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        const start = now + delay;
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // Ignore
    }
  }

  // Toggle Court Chime Retro BGM (Traditional Vietnamese pentatonic mode: Hò, Xự, Xang, Xê, Cống)
  public toggleBgm(onState?: boolean): boolean {
    this.initCtx();
    const target = onState !== undefined ? onState : !this.isBgmPlaying;
    if (!target) {
      this.stopBgm();
      return false;
    } else {
      this.startCourtBgm();
      return true;
    }
  }

  public getBgmState(): boolean {
    return this.isBgmPlaying;
  }

  private stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId) {
      clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
    this.bgmOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // Already stopped
      }
    });
    this.bgmOscillators = [];
  }

  private startCourtBgm() {
    if (!this.enabled || !this.ctx) return;
    this.stopBgm();
    this.isBgmPlaying = true;

    // Vietnamese Court Melodic Pentatonic Motif (C4, D4, F4, G4, A4, C5)
    const melody = [
      { note: 261.63, dur: 0.4 }, // C4
      { note: 293.66, dur: 0.4 }, // D4
      { note: 349.23, dur: 0.6 }, // F4
      { note: 392.0, dur: 0.8 },  // G4
      { note: 349.23, dur: 0.4 }, // F4
      { note: 440.0, dur: 0.6 },  // A4
      { note: 523.25, dur: 1.0 }, // C5
      { note: 392.0, dur: 0.5 },  // G4
      { note: 349.23, dur: 0.5 }, // F4
      { note: 293.66, dur: 0.8 }, // D4
      { note: 261.63, dur: 1.2 }, // C4
    ];

    let step = 0;
    const playNext = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const current = melody[step % melody.length];
      const now = this.ctx.currentTime;

      // Melody note (triangle/soft square)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(current.note, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur * 0.95);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + current.dur);

      step++;
      this.bgmTimeoutId = window.setTimeout(playNext, current.dur * 1000);
    };

    playNext();
  }
}

export const retroAudio = new RetroSoundEngine();
