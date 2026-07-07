// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const pageShell = document.getElementById('page-shell');
const surpriseButton = document.getElementById('surprise-button');
const envelopeWrap = document.getElementById('envelope-wrap');
const envelope = document.querySelector('.envelope');
const letterContent = document.getElementById('letter-content');
const musicButton = document.getElementById('music-button');
const bgCanvas = document.getElementById('bg-canvas');
const ctx = bgCanvas.getContext('2d');
// Intro cinematic canvas
const introCanvas = document.getElementById('intro-canvas');
const introCtx = introCanvas ? introCanvas.getContext('2d') : null;
// Custom cursor element
let customCursor = null;
let width = window.innerWidth;
let height = window.innerHeight;
let animFrame;
let audioContext;
let musicGain;
let musicPlaying = false;
let particles = [];
let fireworks = [];
let confettiPieces = [];
let envelopeOpened = false;
let introAnimFrame;
let introParticles = [];
let cursorTrails = [];

const letterLines = [
  'Congratulations!',
  'Every assignment, every exam, every sleepless night, and every challenge has led you to this incredible achievement.',
  'A 3.8 GPA is more than just a number—it reflects your dedication, resilience, and passion for becoming an amazing nurse.',
  'May your kindness continue to heal hearts, your knowledge continue to save lives, and your dreams continue to grow.',
  'You should be incredibly proud of yourself because this is only the beginning of a bright and meaningful journey.',
  'Keep believing in yourself.',
  'Keep smiling.',
  'Keep shining.',
  'Congratulations once again—you truly deserve every bit of this success.',
  '❤️'
];

function setCanvasSize() {
  width = window.innerWidth;
  height = window.innerHeight;
  bgCanvas.width = width * devicePixelRatio;
  bgCanvas.height = height * devicePixelRatio;
  bgCanvas.style.width = `${width}px`;
  bgCanvas.style.height = `${height}px`;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function setIntroSize() {
  if (!introCanvas) return;
  introCanvas.width = introCanvas.clientWidth * devicePixelRatio;
  introCanvas.height = introCanvas.clientHeight * devicePixelRatio;
  introCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function createParticles() {
  // create a richer particle set: stars, fireflies, petals
  particles = [];
  for (let i = 0; i < 100; i++) {
    const t = Math.random();
    const type = t < 0.45 ? 'star' : t < 0.7 ? 'firefly' : 'petal';
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: (type === 'petal') ? (6 + Math.random() * 8) : (1 + Math.random() * 3),
      alpha: 0.05 + Math.random() * 0.9,
      vx: -0.15 + Math.random() * 0.3,
      vy: (type === 'petal') ? (0.2 + Math.random() * 0.6) : (0.05 + Math.random() * 0.45),
      type,
      phase: Math.random() * Math.PI * 2,
      hue: 180 + Math.random() * 80
    });
  }
}

function createConfetti() {
  const colors = ['#ffe7c9', '#f8c663', '#f8a3d8', '#8ad8ff', '#d8f0ff'];
  for (let i = 0; i < 90; i++) {
    confettiPieces.push({
      x: width / 2 + (Math.random() - 0.5) * 180,
      y: height / 2 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 8,
      vy: -6 - Math.random() * 4,
      size: 6 + Math.random() * 9,
      rotation: Math.random() * Math.PI * 2,
      angular: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      ttl: 90 + Math.random() * 40
    });
  }
}

function createFirework() {
  fireworks.push({
    x: Math.random() * width * 0.9 + width * 0.05,
    y: height,
    targetY: height * (0.18 + Math.random() * 0.18),
    speed: 4 + Math.random() * 3,
    exploded: false,
    sparks: []
  });
}

function updateBackground() {
  ctx.clearRect(0, 0, width, height);
  // draw particles with gentle motion
  particles.forEach(particle => {
    particle.x += particle.vx * (particle.type === 'petal' ? 0.6 : 1);
    particle.y += particle.vy * (particle.type === 'petal' ? 1 : 0.1);
    particle.phase += 0.01 + Math.random() * 0.01;

    if (particle.x < -60) particle.x = width + 60;
    if (particle.x > width + 60) particle.x = -60;
    if (particle.y < -60) particle.y = height + 60;
    if (particle.y > height + 60) particle.y = -60;

    const opacity = Math.max(0.06, Math.min(1, particle.alpha + Math.sin(particle.phase) * 0.25));
    const size = particle.radius + Math.sin(particle.phase * 0.85) * 0.8;

    if (particle.type === 'star') {
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (particle.type === 'firefly') {
      ctx.fillStyle = `rgba(180,220,255,${opacity * 0.9})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, Math.max(1.2, size), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(130,220,255,${opacity * 0.12})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, Math.max(6, size * 4), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    } else if (particle.type === 'petal') {
      // simple rotated ellipse for petal
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(Math.sin(particle.phase) * 0.6);
      ctx.fillStyle = `rgba(255, ${200 + Math.floor(Math.random()*40)}, ${220}, ${opacity})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.6, size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  fireworks = fireworks.filter(rocket => {
    if (!rocket.exploded) {
      rocket.y -= rocket.speed;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(rocket.x, rocket.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      if (rocket.y <= rocket.targetY) {
        rocket.exploded = true;
        for (let i = 0; i < 26; i++) {
          rocket.sparks.push({
            x: rocket.x,
            y: rocket.y,
            vx: Math.cos((i / 26) * Math.PI * 2) * (2 + Math.random() * 3),
            vy: Math.sin((i / 26) * Math.PI * 2) * (2 + Math.random() * 3),
            alpha: 1,
            radius: 1.5 + Math.random() * 2,
            hue: 190 + Math.random() * 60
          });
        }
      }
    } else {
      rocket.sparks = rocket.sparks.filter(spark => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.06;
        spark.alpha -= 0.022;
        if (spark.alpha <= 0) return false;
        ctx.fillStyle = `hsla(${spark.hue}, 90%, 76%, ${spark.alpha})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      return rocket.sparks.length > 0;
    }
    return true;
  });

  confettiPieces = confettiPieces.filter(piece => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += 0.18;
    piece.rotation += piece.angular;
    piece.life += 1;
    const progress = piece.life / piece.ttl;
    const alpha = Math.max(0, 1 - progress);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
    ctx.restore();

    return piece.life < piece.ttl && piece.y < height + 50;
  });

  animFrame = requestAnimationFrame(updateBackground);
}

function fadeInContent() {
  pageShell.classList.remove('hidden');
  pageShell.style.animation = 'pageEnter 1s ease forwards';
}

function hideLoading() {
  loadingScreen.style.opacity = '0';
  loadingScreen.style.transition = 'opacity 0.8s ease';
  setTimeout(() => loadingScreen.classList.add('hidden'), 850);
  fadeInContent();
}

function revealLetter() {
  letterContent.innerHTML = '';
  letterLines.forEach((line, index) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = line;
    paragraph.className = 'letter-line';
    paragraph.style.animationDelay = `${0.18 * index}s`;
    letterContent.appendChild(paragraph);
  });
}

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelopeWrap.classList.remove('hidden');
  setTimeout(() => envelope.classList.add('open'), 100);
  setTimeout(revealLetter, 700);
}

function triggerCelebration() {
  createConfetti();
  for (let i = 0; i < 3; i++) {
    setTimeout(createFirework, i * 400);
  }
}

function toggleMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    musicGain = audioContext.createGain();
    musicGain.gain.value = 0.16;
    musicGain.connect(audioContext.destination);

    const notes = [261.63, 329.63, 392.0, 523.25, 587.33];
    const chordDelay = 2.8;

    function scheduleTone(time, frequency, duration) {
      const osc = audioContext.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = frequency;
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 960;
      const env = audioContext.createGain();
      env.gain.setValueAtTime(0.0001, time);
      env.gain.exponentialRampToValueAtTime(0.13, time + 0.3);
      env.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      osc.connect(filter);
      filter.connect(env);
      env.connect(musicGain);
      osc.start(time);
      osc.stop(time + duration + 0.1);
    }

    function playLoop() {
      const now = audioContext.currentTime + 0.1;
      scheduleTone(now, notes[0], 5.5);
      scheduleTone(now + 0.25, notes[2], 4.9);
      scheduleTone(now + 0.65, notes[4], 5.1);
      scheduleTone(now + 1.4, notes[1], 4.3);
      scheduleTone(now + 2.1, notes[3], 4.5);
      setTimeout(playLoop, chordDelay * 1000);
    }
    playLoop();
  }

  if (musicPlaying) {
    musicGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.2);
    musicButton.textContent = '🎵';
  } else {
    if (audioContext.state === 'suspended') audioContext.resume();
    musicGain.gain.setTargetAtTime(0.16, audioContext.currentTime, 0.2);
    musicButton.textContent = '🔇';
  }
  musicPlaying = !musicPlaying;
}

function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  const rect = button.getBoundingClientRect();
  const top = event.clientY - rect.top - radius;
  const left = event.clientX - rect.left - radius;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${left}px`;
  circle.style.top = `${top}px`;
  circle.classList.add('ripple');
  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) ripple.remove();
  button.appendChild(circle);
}

function bindButtonRipple(button) {
  button.addEventListener('pointerdown', createRipple);
}

window.addEventListener('resize', () => {
  setCanvasSize();
  createParticles();
});

/* -------------------------
   Intro, cursor and init
   ------------------------- */
function initCustomCursor() {
  customCursor = document.createElement('div');
  customCursor.id = 'custom-cursor';
  document.body.appendChild(customCursor);

  window.addEventListener('pointermove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
    // small trail particle
    cursorTrails.push({ x: e.clientX, y: e.clientY, life: 0, ttl: 28 });
  });

  function renderCursorTrails() {
    // tiny DOM-free trails using canvas overlay would be better; keep lightweight: fade via CSS box-shadow
    cursorTrails = cursorTrails.filter(t => ++t.life < t.ttl);
    requestAnimationFrame(renderCursorTrails);
  }
  renderCursorTrails();
}

function playHeartbeat(count = 3) {
  if (!window.AudioContext) return;
  const ctxA = new (window.AudioContext || window.webkitAudioContext)();
  let i = 0;
  function beat() {
    const now = ctxA.currentTime;
    const osc = ctxA.createOscillator();
    const gain = ctxA.createGain();
    osc.type = 'sine';
    osc.frequency.value = 60;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctxA.destination);
    osc.start(now);
    osc.stop(now + 0.45);
    i++;
    if (i < count) setTimeout(beat, 420);
  }
  beat();
}

function initIntro() {
  // draw gentle stars on intro canvas and reveal lines sequentially
  if (introCanvas && introCtx) {
    setIntroSize();
    introParticles = [];
    for (let i = 0; i < 60; i++) {
      introParticles.push({ x: Math.random() * introCanvas.width / devicePixelRatio, y: Math.random() * introCanvas.height / devicePixelRatio, r: Math.random() * 1.8 + 0.6, a: Math.random() * 0.9, phase: Math.random() * Math.PI * 2 });
    }

    function drawIntro() {
      introCtx.clearRect(0,0,introCanvas.width, introCanvas.height);
      introParticles.forEach(p => {
        p.phase += 0.02;
        const opacity = 0.4 + Math.sin(p.phase) * 0.45;
        introCtx.fillStyle = `rgba(255,255,255,${Math.max(0, opacity)})`;
        introCtx.beginPath();
        introCtx.arc(p.x * devicePixelRatio, p.y * devicePixelRatio, p.r * devicePixelRatio, 0, Math.PI * 2);
        introCtx.fill();
      });
      introAnimFrame = requestAnimationFrame(drawIntro);
    }
    drawIntro();
  }

  // heartbeat and text sequence
  playHeartbeat(3);
  const lines = Array.from(document.querySelectorAll('.intro-line'));
  let idx = 0;
  function showNextLine() {
    if (idx >= lines.length) {
      // end intro after a short pause
      setTimeout(() => finishIntro(), 700);
      return;
    }
    lines[idx].classList.add('visible');
    idx++;
    setTimeout(showNextLine, 1400);
  }
  setTimeout(showNextLine, 700);
}

function finishIntro() {
  if (introAnimFrame) cancelAnimationFrame(introAnimFrame);
  hideLoading();
  // kick off background and visuals
  setCanvasSize();
  createParticles();
  updateBackground();
  initCustomCursor();
  // staged hero reveal
  stagedReveal();
  // make envelope land after hero reveal
  setTimeout(() => {
    envelope.classList.add('landed');
  }, 2400);
  // ensure the visible "Open" control is available and clickable
  const btn = document.getElementById('surprise-button');
  if (btn) {
    btn.classList.remove('hidden');
    btn.style.opacity = '1';
    btn.disabled = false;
    bindButtonRipple(btn);
    btn.addEventListener('click', () => {
      // click envelope same as envelope click
      if (envelope) envelope.click();
      btn.disabled = true;
      btn.classList.add('hidden');
    });
  }
  // also wire envelopeWrap as a clickable area
  if (envelopeWrap) {
    envelopeWrap.style.cursor = 'pointer';
    envelopeWrap.addEventListener('click', (e) => {
      // ignore clicks that are from opening animation controls
      if (envelope && !envelopeOpened) envelope.click();
    });
  }
}

function stagedReveal() {
  // cinematic staged reveal sequence for hero and achievement
  const heroIcons = document.querySelector('.hero-icons');
  const heroCard = document.querySelector('.hero-card');
  const heroTitle = document.querySelector('.hero-copy h1');
  const heroSub = document.querySelector('.hero-copy p');
  const glass = document.querySelector('.glass-card');
  const badge = document.querySelector('.card-badge');

  // Step 1: stars (already in canvas), small pause
  setTimeout(() => {
    if (heroIcons) { heroIcons.style.transition = 'opacity 0.9s ease, transform 0.9s ease'; heroIcons.style.opacity = 1; heroIcons.style.transform = 'translateY(0)'; }
  }, 400);

  // Step 2: icons float in
  setTimeout(() => {
    if (heroCard) { heroCard.style.transition = 'opacity 0.9s ease, transform 0.9s ease'; heroCard.style.opacity = 1; heroCard.style.transform = 'translateY(0)'; }
  }, 900);

  // Step 3: heading appears
  setTimeout(() => { if (heroTitle) { heroTitle.style.opacity = 1; heroTitle.style.transform = 'translateY(0)'; } }, 1400);

  // Step 4: GPA animate numbers
  setTimeout(() => {
    const h2 = document.querySelector('.glass-card h2');
    if (h2) {
      animateGPA(h2, 3, 3.8, 1200);
      h2.style.opacity = 1; h2.style.transform = 'translateY(0)';
    }
  }, 1800);

  // Step 5: glass card slides up
  setTimeout(() => { if (glass) { glass.style.opacity = 1; glass.style.transform = 'translateY(0)'; badge.style.opacity = 1; } }, 2300);
}

function animateGPA(el, start, end, duration) {
  const startTime = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const val = start + (end - start) * easeOutCubic(t);
    el.textContent = (Math.round(val * 100) / 100).toFixed(2).replace('.00','') + (t>0.98? ' GPA':'');
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// envelope click behaviour: land, bounce, open, handwriting
function bindEnvelope() {
  envelope.addEventListener('click', async () => {
    if (envelopeOpened) return;
    playPaperSound();
    // stop float and open
    envelope.classList.add('open');
    envelopeOpened = true;
    // celebration
    triggerCelebration();
    // reveal letter handwritten
    await handwrittenReveal(letterLines);
    // ending sequence: slow fade/zoom after delay
    setTimeout(() => endingSequence(), 5000);
  });
}

function playPaperSound() {
  if (!window.AudioContext) return;
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const now = ac.currentTime;
  const b = ac.createBufferSource();
  // simple paper open: filtered noise burst synthesized
  const buffer = ac.createBuffer(1, ac.sampleRate * 0.25, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i=0;i<data.length;i++) data[i] = (Math.random()*2-1) * (1 - i/data.length);
  b.buffer = buffer;
  const filter = ac.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1600;
  const gain = ac.createGain(); gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.45, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
  b.connect(filter); filter.connect(gain); gain.connect(ac.destination);
  b.start(now);
}

function handwrittenReveal(lines) {
  return new Promise((resolve) => {
    letterContent.innerHTML = '';
    const container = document.createElement('div');
    container.style.fontFamily = "'Dancing Script', cursive";
    container.style.fontSize = '1.05rem';
    container.style.color = '#23364f';
    container.style.lineHeight = '1.85';
    container.style.padding = '1rem';
    letterContent.appendChild(container);

    let lineIndex = 0;
    function writeLine() {
      if (lineIndex >= lines.length) { resolve(); return; }
      const p = document.createElement('p');
      container.appendChild(p);
      const text = lines[lineIndex];
      let i = 0;
      function writeChar() {
        if (i <= text.length) {
          p.textContent = text.slice(0, i);
          // optional small ink sound
          if (i % 6 === 0) playSparkle(0.003);
          i++;
          setTimeout(writeChar, 28 + Math.random()*18);
        } else {
          lineIndex++;
          setTimeout(writeLine, 360);
        }
      }
      writeChar();
    }
    writeLine();
  });
}

function playSparkle(volume = 0.02) {
  if (!window.AudioContext) return;
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = 'triangle'; o.frequency.value = 880 + Math.random()*220;
  g.gain.value = volume;
  o.connect(g); g.connect(ac.destination);
  const now = ac.currentTime;
  o.start(now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  o.stop(now + 0.14);
}

function endingSequence() {
  // slow fade and camera zoom into stars
  document.body.style.transition = 'background 2.4s ease, opacity 2.6s ease';
  pageShell.style.transition = 'transform 2.6s ease, opacity 2.6s ease';
  pageShell.style.transform = 'scale(1.08)';
  pageShell.style.opacity = '0.02';
  setTimeout(() => {
    document.body.style.background = '#000';
    // final text overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed'; overlay.style.inset = 0; overlay.style.display = 'grid'; overlay.style.placeItems = 'center'; overlay.style.zIndex = 99999; overlay.style.color = '#fff'; overlay.style.fontFamily = 'Playfair Display, serif'; overlay.style.textAlign = 'center'; overlay.style.padding = '2rem';
    overlay.innerHTML = `<div style="max-width:780px;font-size:clamp(1.15rem,2.6vw,1.6rem);line-height:1.6">Some achievements deserve more than congratulations.<br/><br/>They deserve to be remembered.<br/><br/><strong style=\"font-size:1.6rem\">Congratulations, Future Nurse.</strong><br/><br/>❤️<br/>Made especially for you.</div>`;
    document.body.appendChild(overlay);
  }, 2200);
}

/* Initialize and wire events */
window.addEventListener('DOMContentLoaded', () => {
  // Start intro sequence (cinematic)
  initIntro();
  // Prepare background canvas sizes early
  setCanvasSize();
  createParticles();
  // Wire music button and envelope
  musicButton.addEventListener('click', toggleMusic);
  bindButtonRipple(musicButton);
  bindEnvelope();
  // secret heart
  const secret = document.getElementById('secret-heart');
  if (secret) secret.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed'; overlay.style.inset = 0; overlay.style.display = 'grid'; overlay.style.placeItems = 'center'; overlay.style.zIndex = 99999; overlay.style.color = '#fff'; overlay.style.fontFamily = 'Poppins, sans-serif'; overlay.style.textAlign = 'center'; overlay.style.background = 'rgba(0,0,0,0.52)';
    overlay.innerHTML = `<div style="background:linear-gradient(135deg,#fff,#f7f9ff);padding:2rem;border-radius:16px;color:#1f3157;box-shadow:0 30px 80px rgba(34,53,84,0.2)">I always believed in you.<br/><button id=closeSecret style='margin-top:1rem;padding:0.6rem 1rem;border-radius:999px;border:none;background:#81dbff;cursor:pointer'>Close</button></div>`;
    document.body.appendChild(overlay);
    document.getElementById('closeSecret').addEventListener('click', () => overlay.remove());
  });
});
