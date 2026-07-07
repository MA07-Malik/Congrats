const loadingScreen = document.getElementById('loading-screen');
const pageShell = document.getElementById('page-shell');
const surpriseButton = document.getElementById('surprise-button');
const envelopeWrap = document.getElementById('envelope-wrap');
const envelope = document.querySelector('.envelope');
const letterContent = document.getElementById('letter-content');
const musicButton = document.getElementById('music-button');
const bgCanvas = document.getElementById('bg-canvas');
const ctx = bgCanvas.getContext('2d');
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

function createParticles() {
  particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 3,
      alpha: 0.1 + Math.random() * 0.7,
      vx: -0.2 + Math.random() * 0.4,
      vy: 0.2 + Math.random() * 0.7,
      type: Math.random() > 0.55 ? 'star' : 'sparkle',
      phase: Math.random() * Math.PI * 2,
      hue: 190 + Math.random() * 55
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

  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y -= particle.vy;
    particle.phase += 0.02;

    if (particle.x < -40) particle.x = width + 40;
    if (particle.x > width + 40) particle.x = -40;
    if (particle.y < -40) particle.y = height + 40;
    if (particle.y > height + 40) particle.y = -40;

    const opacity = particle.alpha + Math.sin(particle.phase) * 0.25;
    const size = particle.radius + Math.sin(particle.phase * 0.85) * 0.8;

    if (particle.type === 'star') {
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(particle.x - size, particle.y);
      ctx.lineTo(particle.x + size, particle.y);
      ctx.moveTo(particle.x, particle.y - size);
      ctx.lineTo(particle.x, particle.y + size);
      ctx.stroke();
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

window.addEventListener('DOMContentLoaded', () => {
  setCanvasSize();
  createParticles();
  updateBackground();
  setTimeout(() => {
    hideLoading();
  }, 3000);

  surpriseButton.addEventListener('click', () => {
    triggerCelebration();
    openEnvelope();
    surpriseButton.disabled = true;
    surpriseButton.style.opacity = '0';
    setTimeout(() => surpriseButton.classList.add('hidden'), 500);
  });

  musicButton.addEventListener('click', toggleMusic);
  bindButtonRipple(surpriseButton);
  bindButtonRipple(musicButton);
});
