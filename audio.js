const AudioFX = (() => {
  let ctx;

  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type = "sine", gain = 0.08, slide) {
    const c = ensure();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, c.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, c.currentTime + dur);
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  }

  function noise(dur, freq = 180) {
    const c = ensure();
    const buffer = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const src = c.createBufferSource();
    const filter = c.createBiquadFilter();
    const g = c.createGain();
    src.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = freq;
    g.gain.setValueAtTime(0.22, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    src.connect(filter).connect(g).connect(c.destination);
    src.start();
  }

  return {
    unlock: ensure,
    bell() {
      tone(880, 0.9, "triangle", 0.07, 420);
      setTimeout(() => tone(1320, 0.5, "sine", 0.04), 40);
    },
    handBell() {
      tone(1480, 0.35, "triangle", 0.06, 900);
    },
    conch() {
      tone(220, 1.1, "sawtooth", 0.035, 140);
      tone(110, 1.2, "sine", 0.05, 90);
    },
    dhol() {
      noise(0.18, 90);
      tone(80, 0.2, "sine", 0.12, 40);
    },
    fail() {
      tone(220, 0.35, "square", 0.05, 80);
    },
    success() {
      tone(523, 0.15, "sine", 0.05);
      setTimeout(() => tone(784, 0.25, "sine", 0.05), 90);
    },
    win() {
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.28, "triangle", 0.05), i * 140));
    },
  };
})();
