const SETS = buildSets();
const CIRC = 2 * Math.PI * 54;

const el = {
  title: document.getElementById("screen-title"),
  play: document.getElementById("screen-play"),
  fail: document.getElementById("screen-fail"),
  win: document.getElementById("screen-win"),
  instruction: document.getElementById("instruction"),
  visual: document.getElementById("visual"),
  wrap: document.getElementById("button-wrap"),
  btn: document.getElementById("press-btn"),
  fill: document.getElementById("timer-fill"),
  tiny: document.getElementById("tiny-hint"),
  set: document.getElementById("hud-set"),
  trial: document.getElementById("hud-trial"),
  reason: document.getElementById("fail-reason"),
  winTitle: document.getElementById("win-title"),
  winIdol: document.getElementById("win-idol"),
  titleIdol: document.getElementById("title-idol"),
  visualBg: document.getElementById("visual-bg"),
};

let setIndex = 0;
let trialIndex = 0;
let ready = false;
let ended = false;
let raf = 0;
let timers = [];
let loops = [];
let startedAt = 0;
let duration = 7000;
let overlapOpen = false;

function show(name) {
  [el.title, el.play, el.fail, el.win].forEach((s) => s.classList.remove("active"));
  ({ title: el.title, play: el.play, fail: el.fail, win: el.win }[name].classList.add("active"));
}

function clearJobs() {
  cancelAnimationFrame(raf);
  timers.forEach(clearTimeout);
  timers = [];
  loops.forEach(clearInterval);
  loops = [];
  overlapOpen = false;
  ready = false;
  el.btn.classList.remove("ready");
  el.wrap.classList.remove("hidden", "shift");
  el.instruction.classList.remove("upside");
  el.tiny.className = "tiny-hint";
  el.tiny.textContent = "";
  el.visualBg.classList.remove('active');
}

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}

function renderVisual(key) {
  const V = Visuals;
  const map = {
    bell: () => V.bell(false),
    "bell-ring": () => V.bell(true),
    "bell-still": () => V.bell(false),
    laddu: () => V.sweet("laddu"),
    peda: () => V.sweet("peda"),
    "modak-sketch": () => V.sweet("sketch"),
    "one-modak": () => V.sweet("modak"),
    "diyas-5": () => V.diyas(5),
    "diya-unlit": () => V.diyas(1, { lit: false }),
    "diya-orange": () => V.diyas(1, { orange: true }),
    "diyas-equal": () => V.diyas(6),
    "diyas-complete": () => V.diyaRowComplete(),
    "diyas-right-tall": () =>
      V.svg(`<g class="click-target" data-target="left">${V.diyas(1).replace(/<\/?svg[^>]*>/g, "")}</g>
        <g class="click-target" data-target="right" transform="translate(90 0) scale(1) ">
          <ellipse cx="180" cy="160" rx="22" ry="10" fill="#c0392b"/>
          <ellipse class="flame" cx="180" cy="118" rx="8" ry="22" fill="#f0c75e"/>
        </g>`),
    question: () => V.question(),
    conch: () => V.conch(),
    "ganesha-trunk-right": () => V.ganesha({ trunk: "right" }),
    "ganesha-neutral": () => V.ganesha({ smile: false }),
    "ganesha-ears": () => V.ganesha({ earsEven: false }),
    "ganesha-closed": () => V.ganesha({ eyes: "closed" }),
    "ganesha-profile": () => V.ganesha({ profile: true }),
    "ganesha-jewel": () => V.ganesha({ jewelCenter: false }),
    "ganesha-bowl": () => V.ganesha({ showBowl: true, trunkTouches: false, trunk: "left" }),
    "mushak-modak": () =>
      V.svg(`<g class="click-target" data-target="mushak" transform="translate(-80 0)">${V.mushak()}</g>
        <g class="click-target" data-target="modak" transform="translate(80 0)">${V.modakMini()}</g>`),
    "flower-coconut": () =>
      V.svg(`<g class="click-target" data-target="flower" transform="translate(-80 0)">${V.flower()}</g>
        <g class="click-target" data-target="coconut" transform="translate(80 0)">${V.coconut()}</g>`),
    "bell-drum": () =>
      V.svg(`<g class="click-target" data-target="bell" transform="translate(-80 0)">${V.bellMini()}</g>
        <g class="click-target" data-target="drum" transform="translate(80 0)">${V.drumMini()}</g>`),
    "durva-marigold": () =>
      V.svg(`<g class="click-target" data-target="durva" transform="translate(-80 0)">${V.durva()}</g>
        <g class="click-target" data-target="marigold" transform="translate(80 0)">${V.marigold()}</g>`),
    "modaks-left-big": () => V.twoModaks(true),
    "fake-win": () => V.fakeWin("YOU WIN"),
    "fake-prize": () => V.fakeWin("PRIZE!"),
    "fake-skip": () => V.fakeWin("SKIP AHEAD"),
    "fake-exit": () => V.fakeWin("EXIT"),
    "rangoli-asym": () => V.rangoli(false, 8),
    "rangoli-6": () => V.rangoli(true, 6),
    "rangoli-compare": () => V.twoRangoli(),
    crowd: () => V.crowd(),
    "date-wrong": () => V.banner("15 Jan 2026"),
    "date-mismatch": () => V.banner("4 May 2024"),
    "date-weekday": () => V.banner("15 Sep 2026"),
    "durva-full": () => V.svg(V.durva()),
    dim: () => V.svg(`<text x="180" y="120" text-anchor="middle" fill="#f0c75e" font-size="18">...</text>`, "dim"),
    "thali-no-coconut": () => V.thali({ coconut: false, banana: false, fruit: true }),
    "thali-no-kumkum": () => V.thali({ kumkum: false, banana: false }),
    "thali-sweets": () => V.thali({ sweetsOnly: true, coconut: false, banana: false, fruit: false, kumkum: false }),
    "thali-apple": () => V.thali({ banana: false, apple: true, coconut: false, fruit: false }),
    "thali-full": () => V.thali({}),
    "dhol-play": () => V.dhol(true),
    dhol: () => V.dhol(false),
    "dhol-bell": () =>
      V.svg(`<g transform="translate(-70 0)">${V.dhol(true).replace(/<\/?svg[^>]*>/g, "")}</g>
        <g transform="translate(90 20) scale(0.7)">${V.bellMini()}</g>`),
    doors: () => V.doors(),
    blessing: () => V.ganesha({ smile: true, trunk: "right" }),
    handbell: () => V.handBell(),
    flag: () => V.flag(),
    "flowers-gap": () => V.flowersGap(false),
    plain: () => V.svg(""),
    fade: () => V.ganesha({ smile: true }),
    music: () => V.music(),
    curtain: () => V.curtain(),
    hands: () => V.hands(),
    "calendar-wrong": () => V.calendar(String(new Date().getFullYear() - 1)),
    "flower-full": () => V.svg(V.flower()),
    "garland-odd": () => V.flowersGap(false),
    "odd-flower": () => V.oddFlower(),
    petals: () => V.petals(),
    "diyas-async": () => V.twoDiyasAsync(),
  };
  el.visual.innerHTML = (map[key] || map.plain)();

  /* Dynamic background image */
  const bgUrl = getTrialBg(key);
  if (bgUrl) {
    el.visualBg.style.backgroundImage = `url('${bgUrl}')`;
    el.visualBg.classList.add('active');
  } else {
    el.visualBg.classList.remove('active');
    el.visualBg.style.backgroundImage = '';
  }

  if (key === "fade") el.visual.querySelector(".scene")?.classList.add("fade-in");
}

function tick() {
  if (ended) return;
  const t = (performance.now() - startedAt) / duration;
  const p = Math.min(1, Math.max(0, t));
  el.fill.style.strokeDashoffset = String(CIRC * p);
  if (p < 1) {
    raf = requestAnimationFrame(tick);
  } else {
    onTimeout();
  }
}

function startTimer(ms) {
  duration = ms;
  startedAt = performance.now();
  el.fill.style.strokeDasharray = String(CIRC);
  el.fill.style.strokeDashoffset = "0";
  raf = requestAnimationFrame(tick);
}

function beginCues(trial) {
  if (trial.cue === "conch") {
    later(() => {
      AudioFX.conch();
      armWait();
    }, trial.waitMs);
  } else if (trial.cue === "handbell") {
    later(() => {
      AudioFX.handBell();
      armWait();
    }, trial.waitMs);
  } else if (trial.cue === "dhol") {
    later(() => {
      AudioFX.dhol();
      armWait();
    }, trial.waitMs);
  } else if (trial.cue === "bell-stop") {
    AudioFX.bell();
    later(() => {
      AudioFX.bell();
    }, 900);
    later(armWait, trial.waitMs);
  } else if (trial.cue === "conch-stop") {
    AudioFX.conch();
    later(() => AudioFX.conch(), 1200);
    later(armWait, trial.waitMs);
  } else if (trial.cue === "conch-twice") {
    AudioFX.conch();
    later(() => {
      AudioFX.conch();
      armWait();
    }, trial.waitMs);
  } else if (trial.cue === "bell-twice") {
    AudioFX.bell();
    later(() => {
      AudioFX.handBell();
      armWait();
    }, trial.waitMs);
  } else if (trial.cue === "dhol-loop") {
    AudioFX.dhol();
    loops.push(setInterval(() => AudioFX.dhol(), 520));
  } else if (trial.cue === "both") {
    AudioFX.dhol();
    AudioFX.bell();
    loops.push(
      setInterval(() => {
        AudioFX.dhol();
        AudioFX.handBell();
      }, 700)
    );
  } else if (trial.cue === "overlap") {
    const fl = document.getElementById("flame-l");
    const fr = document.getElementById("flame-r");
    later(() => {
      if (fl) fl.style.opacity = "1";
    }, 800);
    later(() => {
      if (fr) fr.style.opacity = "1";
      overlapOpen = true;
      armWait();
    }, trial.waitMs);
    later(() => {
      if (fl) fl.style.opacity = "0";
      overlapOpen = false;
      ready = false;
      el.btn.classList.remove("ready");
    }, trial.waitMs + 1600);
    later(() => {
      if (fr) fr.style.opacity = "0";
    }, trial.waitMs + 2800);
  }
}

function armWait() {
  ready = true;
  el.btn.classList.add("ready");
}

function loadTrial() {
  clearJobs();
  ended = false;
  const set = SETS[setIndex];
  const trial = set[trialIndex];
  el.set.textContent = `Set ${setIndex + 1}`;
  el.trial.textContent = `Trial ${trialIndex + 1} / ${set.length}`;
  el.instruction.textContent = trial.instruction;
  if (trial.extra === "upside") el.instruction.classList.add("upside");
  renderVisual(trial.visual);
  if (trial.tiny) {
    el.tiny.textContent = trial.tiny;
    if (trial.visual === "dim") el.tiny.classList.add("corner");
  }

  if (trial.action === "tap") {
    el.wrap.classList.add("hidden");
    el.visual.querySelectorAll("[data-target]").forEach((node) => {
      node.addEventListener("click", () => onTap(node.getAttribute("data-target")));
    });
    startTimer(trial.timeout || 8000);
    return;
  }

  if (trial.action === "auto") {
    el.wrap.classList.add("hidden");
    startTimer(3200);
    return;
  }

  if (trial.action === "win") {
    succeedWin(trial);
    return;
  }

  el.wrap.classList.remove("hidden");
  if (trial.shift) {
    el.wrap.classList.add("shift");
    later(() => el.wrap.classList.remove("shift"), 900);
  }

  if (trial.action === "wait-press") {
    ready = false;
    startTimer(trial.timeout || 12000);
    beginCues(trial);
  } else if (trial.action === "no-press") {
    ready = false;
    beginCues(trial);
    startTimer(trial.timeout || 5200);
  } else {
    ready = true;
    beginCues(trial);
    startTimer(trial.timeout || 8000);
  }
}

function onTap(target) {
  if (ended) return;
  const trial = SETS[setIndex][trialIndex];
  if (target === trial.correct) succeed();
  else fail(trial.fail);
}

function onPress() {
  if (ended) return;
  const trial = SETS[setIndex][trialIndex];
  if (trial.action === "tap" || trial.action === "auto") return;
  if (trial.action === "no-press") {
    fail(trial.fail);
    return;
  }
  if (trial.action === "wait-press") {
    if (trial.cue === "overlap" && !overlapOpen) {
      fail(trial.fail);
      return;
    }
    if (!ready) {
      fail(trial.fail);
      return;
    }
    succeed();
    return;
  }
  succeed();
}

function onTimeout() {
  if (ended) return;
  const trial = SETS[setIndex][trialIndex];
  if (trial.action === "no-press" || trial.action === "auto") succeed();
  else fail(trial.fail || "Time ran out.");
}

function succeed() {
  ended = true;
  clearJobs();
  AudioFX.success();
  trialIndex += 1;
  later(loadTrial, 280);
}

function succeedWin(trial) {
  ended = true;
  clearJobs();
  AudioFX.win();
  el.winTitle.textContent = trial.winText;
  el.winIdol.innerHTML = Visuals.ganesha({ smile: true, trunk: "right" });
  show("win");
}

function fail(reason) {
  ended = true;
  clearJobs();
  AudioFX.fail();
  el.reason.textContent = reason || "The offering was not accepted this time.";
  show("fail");
}

document.getElementById("btn-begin").addEventListener("click", () => {
  AudioFX.unlock();
  trialIndex = 0;
  show("play");
  loadTrial();
});

document.getElementById("btn-retry").addEventListener("click", () => {
  AudioFX.unlock();
  setIndex = (setIndex + 1) % SETS.length;
  trialIndex = 0;
  show("play");
  loadTrial();
});

document.getElementById("btn-again").addEventListener("click", () => {
  AudioFX.unlock();
  setIndex = (setIndex + 1) % SETS.length;
  trialIndex = 0;
  show("play");
  loadTrial();
});

el.btn.addEventListener("click", () => {
  AudioFX.unlock();
  onPress();
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    if (!el.play.classList.contains("active")) return;
    e.preventDefault();
    onPress();
  }
});

el.titleIdol.innerHTML = Visuals.ganesha({ smile: true, trunk: "left" });
