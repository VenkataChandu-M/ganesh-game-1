const Visuals = {
  svg(inner, extra = "") {
    return `<svg class="scene ${extra}" viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  },

  ganesha(opts = {}) {
    const {
      trunk = "left",
      smile = false,
      eyes = "open",
      profile = false,
      earsEven = true,
      jewelCenter = true,
      trunkTouches = false,
      showBowl = false,
    } = opts;
    const leftEar = earsEven ? 58 : 52;
    const rightEar = earsEven ? 58 : 68;
    const jewelX = jewelCenter ? 180 : 196;
    const trunkPath = trunk === "left"
      ? `M180 128 C150 150 128 ${trunkTouches ? 176 : 168} 138 188`
      : `M180 128 C210 150 232 ${trunkTouches ? 176 : 168} 222 188`;
    const mouth = smile ? "M168 118 Q180 128 192 118" : "M168 120 Q180 118 192 120";
    const eyeL = eyes === "open" ? `<circle cx="162" cy="98" r="5" fill="#1a0a08"/><circle cx="163" cy="97" r="1.6" fill="#fff"/>` : `<path d="M154 98 Q162 94 170 98" stroke="#1a0a08" fill="none" stroke-width="3"/>`;
    const eyeR = eyes === "open" ? `<circle cx="198" cy="98" r="5" fill="#1a0a08"/><circle cx="199" cy="97" r="1.6" fill="#fff"/>` : `<path d="M190 98 Q198 94 206 98" stroke="#1a0a08" fill="none" stroke-width="3"/>`;
    const face = profile
      ? `<ellipse cx="196" cy="110" rx="46" ry="52" fill="#f3c27a"/>
         <ellipse cx="168" cy="58" rx="28" ry="18" fill="#e8a01a"/>
         <circle cx="168" cy="50" r="8" fill="#f0c75e"/>
         <path d="M196 128 C230 148 248 170 236 192" stroke="#d9a05e" fill="none" stroke-width="16" stroke-linecap="round"/>
         <circle cx="214" cy="100" r="5" fill="#1a0a08"/>
         <path d="M210 122 Q220 126 226 120" stroke="#8a3a20" fill="none" stroke-width="3"/>`
      : `<ellipse cx="${180 - rightEar}" cy="108" rx="22" ry="36" fill="#efb56a"/>
         <ellipse cx="${180 + leftEar}" cy="108" rx="22" ry="36" fill="#efb56a"/>
         <ellipse cx="180" cy="112" rx="54" ry="58" fill="#f3c27a"/>
         <ellipse cx="180" cy="58" rx="42" ry="22" fill="#e8a01a"/>
         <circle cx="${jewelX}" cy="46" r="8" fill="#c0392b" stroke="#f0c75e" stroke-width="2"/>
         <path d="${trunkPath}" stroke="#d9a05e" fill="none" stroke-width="16" stroke-linecap="round"/>
         ${eyeL}${eyeR}
         <path d="${mouth}" stroke="#8a3a20" fill="none" stroke-width="3"/>`;
    const bowl = showBowl
      ? `<ellipse cx="250" cy="188" rx="34" ry="14" fill="#c9922a"/><ellipse cx="250" cy="182" rx="26" ry="8" fill="#fff4dc"/><circle cx="242" cy="180" r="6" fill="#e07a2f"/><circle cx="258" cy="179" r="6" fill="#e07a2f"/>`
      : "";
    const jeweled = face.replace(
      `<circle cx="${jewelX}" cy="46" r="8"`,
      `<circle class="jewel" cx="${jewelX}" cy="46" r="8"`
    );
    return this.svg(`<rect width="360" height="220" fill="none"/>${bowl}<g class="idol-sway">${jeweled}</g>
      <text x="180" y="214" text-anchor="middle" fill="#f0c75e" font-size="13" font-family="Cinzel">श्री गणेश</text>`);
  },

  bell(ringing = false) {
    const shake = ringing ? "bell-swing" : "bell-idle";
    return this.svg(`<g class="${shake}" transform="translate(180 100)">
      <path d="M-42 -10 C-42 -70 42 -70 42 -10 L50 18 Q0 38 -50 18 Z" fill="#f0c75e" stroke="#c9922a" stroke-width="4"/>
      <circle cy="36" r="10" fill="#c0392b"/>
      <rect x="-8" y="-82" width="16" height="18" rx="4" fill="#c9922a"/>
    </g>`);
  },

  handBell() {
    return this.svg(`<g class="bell-idle" transform="translate(180 120)">
      <path d="M-22 -8 C-22 -48 22 -48 22 -8 L26 16 Q0 28 -26 16 Z" fill="#e8a01a"/>
      <rect x="-4" y="-70" width="8" height="28" rx="3" fill="#8a3a20"/>
      <circle cy="28" r="7" fill="#c0392b"/>
    </g>`);
  },

  sweet(kind) {
    const fills = { modak: "#e07a2f", laddu: "#f0c75e", peda: "#fff0c8" };
    const label = { modak: "Modak", laddu: "Laddu", peda: "Peda" };
    if (kind === "modak") {
      return this.svg(`<path d="M180 60 L220 150 Q180 175 140 150 Z" fill="#e07a2f"/><path d="M180 60 L200 110 L160 110 Z" fill="#c45a18"/>
        <text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="16">${label.modak}</text>`);
    }
    if (kind === "sketch") {
      return this.svg(`<path d="M180 60 L220 150 Q180 175 140 150 Z" fill="none" stroke="#fff4dc" stroke-width="3" stroke-dasharray="6 4"/>
        <text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="16">A drawing of a Modak</text>`);
    }
    return this.svg(`<circle cx="180" cy="118" r="48" fill="${fills[kind] || fills.laddu}"/><circle cx="168" cy="108" r="8" fill="#fff6" />
      <text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="16">${label[kind] || kind}</text>`);
  },

  diyas(count = 5, opts = {}) {
    const { lit = true, taller = null, missing = false, orange = false, asyncPair = false } = opts;
    const items = [];
    const n = asyncPair ? 2 : count;
    for (let i = 0; i < n; i++) {
      const x = 180 - ((n - 1) * 48) / 2 + i * 48;
      const tall = taller === i;
      const flameH = tall ? 36 : 22;
      const color = orange ? "#e07a2f" : "#f0c75e";
      const flameId = asyncPair ? `flame-${i}` : "";
      const flame = lit
        ? `<ellipse class="flame ${flameId}" cx="${x}" cy="${138 - flameH / 2}" rx="8" ry="${flameH / 2}" fill="${color}"/>`
        : "";
      items.push(`<ellipse cx="${x}" cy="160" rx="22" ry="10" fill="#c0392b"/><ellipse cx="${x}" cy="154" rx="14" ry="6" fill="#7a1510"/>${flame}`);
    }
    if (missing) items.pop();
    return this.svg(items.join(""));
  },

  twoDiyasAsync() {
    return this.svg(`<g id="diya-pair">
      <ellipse cx="130" cy="160" rx="28" ry="12" fill="#c0392b"/>
      <ellipse class="flame" id="flame-l" cx="130" cy="118" rx="10" ry="22" fill="#f0c75e" opacity="0"/>
      <ellipse cx="230" cy="160" rx="28" ry="12" fill="#c0392b"/>
      <ellipse class="flame" id="flame-r" cx="230" cy="118" rx="10" ry="22" fill="#e07a2f" opacity="0"/>
    </g>`);
  },

  conch() {
    return this.svg(`<g class="conch-pulse"><path d="M120 130 C110 80 180 50 230 90 C270 120 240 170 190 165 C160 162 130 150 120 130" fill="#fff4dc"/>
      <path d="M150 120 C170 90 210 100 220 120" fill="none" stroke="#e8c9a0" stroke-width="4"/></g>`);
  },

  dhol(playing = false) {
    return this.svg(`<g class="${playing ? "dhol-beat" : ""}"><ellipse cx="180" cy="110" rx="70" ry="42" fill="#8a3a20"/><ellipse cx="180" cy="110" rx="58" ry="32" fill="#fff4dc"/></g>
      ${playing ? `<text class="note-float" x="180" y="200" text-anchor="middle" fill="#f0c75e" font-size="18">♪ ♫ ♪</text>` : ""}`);
  },

  pair(left, right, leftId, rightId) {
    return this.svg(`<g class="click-target" data-target="${leftId}" transform="translate(-70 0)">${left}</g>
      <g class="click-target" data-target="${rightId}" transform="translate(70 0)">${right}</g>`);
  },

  mushak() {
    return `<g><ellipse cx="180" cy="130" rx="36" ry="22" fill="#c4a484"/><circle cx="150" cy="118" r="16" fill="#c4a484"/><circle cx="144" cy="114" r="3"/><text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="14">Mushak</text></g>`;
  },

  modakMini() {
    return `<g><path d="M180 80 L210 150 Q180 168 150 150 Z" fill="#e07a2f"/><text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="14">Modak</text></g>`;
  },

  flower() {
    return `<g><circle cx="180" cy="120" r="18" fill="#ff8aa0"/><circle cx="180" cy="120" r="8" fill="#f0c75e"/><text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="14">Flower</text></g>`;
  },

  coconut() {
    return `<g><circle cx="180" cy="120" r="28" fill="#8a3a20"/><circle cx="180" cy="120" r="18" fill="#fff4dc"/><text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="14">Coconut</text></g>`;
  },

  drumMini() {
    return `<g><ellipse cx="180" cy="120" rx="34" ry="22" fill="#8a3a20"/><text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="14">Drum</text></g>`;
  },

  bellMini() {
    return `<g><path d="M160 90 C160 50 200 50 200 90 L206 110 Q180 122 154 110 Z" fill="#f0c75e"/><text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="14">Bell</text></g>`;
  },

  durva() {
    return `<g><path d="M170 170 C160 90 150 70 180 50" stroke="#2f7a32" fill="none" stroke-width="6"/><path d="M180 170 C180 90 190 70 200 48" stroke="#3d9a40" fill="none" stroke-width="6"/><text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="14">Durva</text></g>`;
  },

  marigold() {
    return `<g><circle cx="180" cy="120" r="26" fill="#e8a01a"/><circle cx="180" cy="120" r="10" fill="#c0392b"/><text x="180" y="200" text-anchor="middle" fill="#fff4dc" font-size="14">Marigold</text></g>`;
  },

  rangoliInner(symmetric = true, petals = 6) {
    let p = `<circle cx="180" cy="110" r="22" fill="#c0392b"/>`;
    for (let i = 0; i < petals; i++) {
      const a = (Math.PI * 2 * i) / petals;
      const x = 180 + Math.cos(a) * 48;
      const y = 110 + Math.sin(a) * 48;
      const r = !symmetric && i === 1 ? 10 : 16;
      p += `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? "#ff8aa0" : "#f0c75e"}"/>`;
    }
    return p;
  },

  rangoli(symmetric = true, petals = 6) {
    return this.svg(`<g class="rangoli-spin">${this.rangoliInner(symmetric, petals)}</g>`);
  },

  flowersGap(even = false) {
    const xs = even ? [70, 130, 190, 250, 310] : [70, 130, 175, 260, 320];
    return this.svg(xs.map((x) => `<circle cx="${x}" cy="110" r="18" fill="#ff8aa0"/><circle cx="${x}" cy="110" r="6" fill="#f0c75e"/>`).join(""));
  },

  crowd() {
    return this.svg(`<g class="crowd-bob" fill="#f3c27a">${[90, 140, 180, 220, 270].map((x, i) => `<circle cx="${x}" cy="${100 + (i % 2) * 8}" r="18"/><rect x="${x - 16}" y="${118 + (i % 2) * 8}" width="32" height="40" rx="10"/>`).join("")}</g>`);
  },

  banner(text) {
    return this.svg(`<rect x="40" y="70" width="280" height="80" rx="12" fill="#c0392b" stroke="#f0c75e" stroke-width="4"/>
      <text x="180" y="118" text-anchor="middle" fill="#fff4dc" font-size="20" font-family="Cinzel">${text}</text>`);
  },

  calendar(year) {
    return this.svg(`<rect x="110" y="40" width="140" height="140" rx="10" fill="#fff4dc"/>
      <rect x="110" y="40" width="140" height="36" fill="#c0392b"/>
      <text x="180" y="64" text-anchor="middle" fill="#fff" font-size="18">${year}</text>
      <text x="180" y="130" text-anchor="middle" fill="#3b0c14" font-size="28" font-family="Cinzel">SEP</text>`);
  },

  thali({ coconut = true, kumkum = true, fruit = true, banana = true, sweetsOnly = false, apple = false } = {}) {
    let bits = `<ellipse cx="180" cy="120" rx="90" ry="54" fill="#c9922a"/><ellipse cx="180" cy="120" rx="74" ry="40" fill="#fff4dc"/>`;
    if (coconut) bits += `<circle cx="140" cy="118" r="16" fill="#8a3a20"/>`;
    if (kumkum) bits += `<circle cx="180" cy="108" r="10" fill="#c0392b"/>`;
    if (fruit && !sweetsOnly) bits += `<circle cx="214" cy="122" r="12" fill="#3d9a40"/>`;
    if (banana) bits += `<path d="M210 130 Q230 110 248 128" stroke="#f0c75e" fill="none" stroke-width="10" stroke-linecap="round"/>`;
    if (apple) bits += `<circle cx="220" cy="122" r="14" fill="#c0392b"/>`;
    if (sweetsOnly) bits += `<circle cx="150" cy="122" r="12" fill="#e07a2f"/><circle cx="180" cy="128" r="12" fill="#f0c75e"/><circle cx="210" cy="122" r="12" fill="#e07a2f"/>`;
    return this.svg(bits);
  },

  grass() {
    return this.svg(this.durva());
  },

  petals() {
    return this.svg(`${[0, 1, 2, 3, 4, 5].map((i) => `<ellipse class="falling-petal" cx="${70 + i * 40}" cy="${80 + (i % 2) * 20}" rx="10" ry="16" fill="#ff8aa0" style="animation-delay:${i * 0.18}s"/>`).join("")}`);
  },

  doors() {
    return this.svg(`<g class="door-left"><rect x="70" y="30" width="90" height="160" fill="#8a3a20"/><rect x="78" y="40" width="74" height="140" fill="#c9922a"/><circle cx="150" cy="110" r="6" fill="#f0c75e"/></g>
      <g class="door-right"><rect x="200" y="30" width="90" height="160" fill="#8a3a20"/><rect x="208" y="40" width="74" height="140" fill="#c9922a"/><circle cx="220" cy="110" r="6" fill="#f0c75e"/></g>`);
  },

  curtain() {
    return this.svg(`<g class="curtain-lift"><path d="M40 20 Q180 80 320 20 L320 200 Q180 140 40 200 Z" fill="#c0392b"/>
      <path d="M40 20 Q180 8 320 20" fill="none" stroke="#f0c75e" stroke-width="8"/></g>`);
  },

  hands() {
    return this.svg(`<path class="hands-pray" d="M130 150 Q150 70 180 60 Q210 70 230 150" fill="#f3c27a" stroke="#d9a05e" stroke-width="4"/>`);
  },

  question() {
    return this.svg(`<text class="q-bounce" x="180" y="130" text-anchor="middle" fill="#f0c75e" font-size="90" font-family="Cinzel">?</text>`);
  },

  flag() {
    return this.svg(`<g class="flag-wave"><rect x="120" y="50" width="140" height="30" fill="#ff9933"/><rect x="120" y="80" width="140" height="30" fill="#fff"/><rect x="120" y="110" width="140" height="30" fill="#138808"/>
      <circle cx="190" cy="95" r="10" fill="none" stroke="#000080" stroke-width="2"/></g>`);
  },

  music() {
    return this.svg(`<text class="note-float" x="180" y="120" text-anchor="middle" fill="#f0c75e" font-size="48">♪ ♫ ♪</text>`);
  },

  twoModaks(leftBigger) {
    const l = leftBigger ? 1.15 : 1;
    const r = leftBigger ? 1 : 1.15;
    return this.svg(`<g class="click-target" data-target="left" transform="translate(-70 10) scale(${l})">${this.modakMini()}</g>
      <g class="click-target" data-target="right" transform="translate(70 10) scale(${r})">${this.modakMini()}</g>`);
  },

  twoDiyasTaller(rightTaller) {
    return this.diyas(2, { taller: rightTaller ? 1 : 0 });
  },

  oddFlower() {
    const colors = ["#ff8aa0", "#ff8aa0", "#ff8aa0", "#3d9a40", "#ff8aa0"];
    return this.svg(colors.map((c, i) => `<g class="click-target" data-target="${i === 3 ? "odd" : "same"}"><circle cx="${70 + i * 55}" cy="110" r="22" fill="${c}"/><circle cx="${70 + i * 55}" cy="110" r="7" fill="#f0c75e"/></g>`).join(""));
  },

  twoRangoli() {
    return this.svg(`<g class="click-target" data-target="left" transform="translate(-80 0) scale(0.7)">${this.rangoliInner(true, 4)}</g>
      <g class="click-target" data-target="right" transform="translate(80 0) scale(0.7)">${this.rangoliInner(true, 8)}</g>`);
  },

  diyaRowComplete() {
    return this.diyas(6, { missing: false });
  },

  fakeWin(text) {
    return this.svg(`<rect x="30" y="50" width="300" height="120" rx="16" fill="#1a3a1a" stroke="#7dce7d" stroke-width="4"/>
      <text x="180" y="105" text-anchor="middle" fill="#9dff9d" font-size="22" font-family="Cinzel">${text}</text>
      <text x="180" y="140" text-anchor="middle" fill="#c8ffc8" font-size="14">tap to continue →</text>`);
  },

  blessing() {
    return this.ganesha({ smile: true, trunk: "right" }) + "";
  },
};
