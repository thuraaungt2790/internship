/* ============================================
   BIRTHDAY SURPRISE - SCRIPT.JS
   All interactivity, animations, effects
   ============================================ */

/* ============================================
   USER CONFIGURATION - EDIT THESE VALUES
   ============================================ */

/* Change the birthday person's name here */
const BIRTHDAY_NAME = "အချစ်ကလေးရေ";

/* Change the birthday message shown during typing animation */
const BIRTHDAY_MESSAGE = `Happy Birthday ${BIRTHDAY_NAME}! ❤️

မွေးနေ့မှ စ၍နောက်နှစ်ပေါင်းများစွာ ပျော်"ရွှင်"နဲ့ 
ဖြတ်သန်းနိုင်ပါစေဗျာ၊ မိဘအားကိုးအားထားရတဲ့ 
သမီးအလိမ္မာလေး ဖြစ်ပါစေလို့
 ကို ဆုတောင်းပေးပါတယ်နော်၊ 
 အချစ်ကလေး လုပ်ချင်တာတွေ 
 ဖြစ်ချင်တာတွေ တွေးထားတာတွေ 
 မွေးနေ့မှစလို့ အောင်မြင်ပါစေ ဖြစ်ပါစေဗျာ 
 ဘာအခက်အခဲမှ မရှိဘဲကျော်လွှားနိုင်ပါစေဗျာ၊
ရည်ရွယ်ထားတဲ့ ပန်းတိုင်ကို အရောက်သွားနိုင်ပါစေလို့ 
 ဆုတောင်း ပေးလိုက်ပါတယ်ဗျာ😘😘🫶
ကို့ကို လည်း ဒီထက် မက ပိုချစ်နိုင်ပါစေဗျာ🫶💞
 အရမ်းချစ်တယ်နော်❤️😘 ဒီကြားထဲမှာ စိတ်ဆိုး
 စိတ်ကောက်အောင်လုပ်ခဲ့မိလို့လည်း
 တောင်းပန်ပါတယ်🥺❤️
 ❤️မွေးနေ့မှာချစ်ခြင်မေတ္တာတွေနဲ့ လွှမ်းခြုံ ပေးလိုက်ပြီမို့
တစ်နှစ်ပတ်လုံးဘေးမသိရန်မခ ဘေးကင်းနေပါစေအချစ်ရယ်.......💛💜🎁
I love you so much baby! 💕`;

/* Slideshow interval in milliseconds (4000 = 4 seconds) */
const SLIDESHOW_INTERVAL = 4000;

/* Music file path */
const MUSIC_FILE = "audio/mpeg/music.mp3";

/* Number of slideshow images */
const TOTAL_IMAGES = 10;

/* ============================================
   DOM REFERENCES
   ============================================ */
const cakeScene = document.getElementById('cake-scene');
const giftScene = document.getElementById('gift-scene');
const surpriseScene = document.getElementById('surprise-scene');
const cakeBtn = document.getElementById('cake-btn');
const candlesEl = document.getElementById('candles');
const giftBox = document.getElementById('gift-box');
const typingTextEl = document.getElementById('typing-text');
const finalMessage = document.getElementById('final-message');
const replayBtn = document.getElementById('replay-btn');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const confettiCanvas = document.getElementById('confetti-canvas');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const blowParticles = document.getElementById('blow-particles');

/* ============================================
   STATE
   ============================================ */
let cakeState = 'off'; // off -> lit -> blown
let currentSlide = 0;
let slideshowTimer = null;
let confettiCtx, fireworksCtx;
let confettiParticles = [];
let fireworksParticles = [];
let animFrameConfetti = null;
let animFrameFireworks = null;

/* ============================================
   UTILITY: Generate random number in range
   ============================================ */
function rand(min, max) {
    return Math.random() * (max - min) + min;
}

/* ============================================
   SCENE TRANSITION
   ============================================ */
function transitionTo(fromScene, toScene) {
    fromScene.classList.add('fade-out');
    setTimeout(() => {
        fromScene.classList.remove('active', 'fade-out');
        toScene.classList.add('active', 'fade-in');
        setTimeout(() => {
            toScene.classList.remove('fade-in');
        }, 800);
    }, 600);
}

/* ============================================
   CREATE FLOATING HEARTS (reusable)
   ============================================ */
function createFloatingHearts(container, count) {
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.classList.add('floating-heart');
        heart.textContent = ['❤️', '💖', '💕', '💗', '💓'][Math.floor(rand(0, 5))];
        heart.style.left = rand(5, 95) + '%';
        heart.style.setProperty('--dur', rand(4, 8) + 's');
        heart.style.setProperty('--delay', rand(0, 5) + 's');
        heart.style.setProperty('--size', rand(14, 30) + 'px');
        heart.style.setProperty('--rot', rand(-30, 30) + 'deg');
        container.appendChild(heart);
    }
}

/* ============================================
   CREATE STARS (gift scene background)
   ============================================ */
function createStars() {
    const starsBg = document.getElementById('stars-bg');
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = rand(0, 100) + '%';
        star.style.top = rand(0, 100) + '%';
        star.style.setProperty('--dur', rand(1.5, 4) + 's');
        star.style.animationDelay = rand(0, 3) + 's';
        star.style.width = star.style.height = rand(1, 4) + 'px';
        starsBg.appendChild(star);
    }
}

/* ============================================
   CAKE SCENE - CANDLE TOGGLE
   ============================================ */
function setupCakeButton() {
    cakeBtn.addEventListener('click', () => {
        const candles = candlesEl.querySelectorAll('.candle');

        if (cakeState === 'off') {
            /* Light candles */
            candles.forEach(c => c.classList.add('lit'));
            cakeBtn.textContent = 'မီးညှိ 🕯️';
            cakeState = 'lit';
        } else if (cakeState === 'lit') {
            /* Prepare to blow */
            cakeBtn.textContent = 'မီးမှုတ် 🎉';
            cakeState = 'ready-to-blow';
        } else if (cakeState === 'ready-to-blow') {
            /* Blow out candles */
            blowCandles();
        }
    });
}

function blowCandles() {
    cakeState = 'blown';
    const candles = candlesEl.querySelectorAll('.candle');

    /* Create wind / blow particles */
    createBlowEffect();

    /* Add blowing class to each candle with stagger */
    candles.forEach((c, i) => {
        setTimeout(() => {
            c.classList.add('blowing');
        }, i * 80);
    });

    /* Change button */
    cakeBtn.textContent = 'ထွက်ပါပြီ... 🎉';
    cakeBtn.style.pointerEvents = 'none';

    /* Transition to gift scene after delay */
    setTimeout(() => {
        transitionTo(cakeScene, giftScene);
        createStars();
        createFloatingHearts(document.getElementById('gift-hearts'), 15);
    }, 1800);
}

function createBlowEffect() {
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('blow-particle');
        p.style.left = '50%';
        p.style.top = '40%';
        p.style.setProperty('--bx', rand(60, 200) * (Math.random() > 0.5 ? 1 : -1) + 'px');
        p.style.setProperty('--by', rand(-80, 80) + 'px');
        p.style.animationDelay = rand(0, 0.3) + 's';
        blowParticles.appendChild(p);
    }
}

/* ============================================
   GIFT SCENE - GIFT BOX CLICK
   ============================================ */
function setupGiftBox() {
    giftBox.addEventListener('click', () => {
        giftBox.classList.add('open');

        setTimeout(() => {
            transitionTo(giftScene, surpriseScene);
            startSurprise();
        }, 1000);
    });
}

/* ============================================
   SURPRISE - MAIN ORCHESTRATOR
   ============================================ */
function startSurprise() {
    setupSlideshow();
    createBalloons();
    createFloatingHearts(document.getElementById('surprise-hearts'), 25);
    startConfetti();
    startFireworks();
    playMusic();
    musicToggle.style.display = 'flex';
    showTypingMessage();
}

/* ============================================
   SLIDESHOW
   ============================================ */
function setupSlideshow() {
    const container = document.getElementById('slideshow');
    container.innerHTML = '';

    for (let i = 1; i <= TOTAL_IMAGES; i++) {
        const img = document.createElement('img');
        img.src = `images/${i}.jpg`;
        img.alt = `Photo ${i}`;
        img.style.display = 'none';

        /* Skip broken images silently */
        img.onerror = function () {
            this.style.display = 'none';
            this.classList.remove('active');
            /* Move to next image */
            nextSlide();
        };

        img.onload = function () {
            this.style.display = 'block';
        };

        container.appendChild(img);
    }

    /* Show first image */
    const imgs = container.querySelectorAll('img');
    if (imgs.length > 0) {
        imgs[0].classList.add('active');
    }

    /* Auto advance */
    slideshowTimer = setInterval(nextSlide, SLIDESHOW_INTERVAL);
}

function nextSlide() {
    const imgs = document.querySelectorAll('#slideshow img');
    if (imgs.length === 0) return;

    imgs[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % imgs.length;

    /* Skip hidden (broken) images */
    let attempts = 0;
    while (imgs[currentSlide].style.display === 'none' && attempts < TOTAL_IMAGES) {
        currentSlide = (currentSlide + 1) % imgs.length;
        attempts++;
    }

    imgs[currentSlide].classList.add('active');
}

/* ============================================
   BALLOONS
   ============================================ */
function createBalloons() {
    const container = document.getElementById('balloons');
    const colors = ['#ff6b9d', '#c44dff', '#ffd700', '#ff4757', '#70a1ff', '#2ed573', '#ff6348', '#eccc68'];

    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = rand(5, 90) + '%';
        balloon.style.width = rand(30, 55) + 'px';
        balloon.style.height = rand(40, 65) + 'px';
        balloon.style.background = `radial-gradient(circle at 30% 30%, ${colors[Math.floor(rand(0, colors.length))]}, rgba(0,0,0,0.1))`;
        balloon.style.setProperty('--dur', rand(5, 10) + 's');
        balloon.style.setProperty('--delay', rand(0, 6) + 's');
        balloon.style.setProperty('--rot', rand(-15, 15) + 'deg');
        container.appendChild(balloon);
    }
}

/* ============================================
   CONFETTI
   ============================================ */
function startConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCtx = confettiCanvas.getContext('2d');

    const colors = ['#ff6b9d', '#c44dff', '#ffd700', '#ff4757', '#70a1ff', '#2ed573', '#ff6348', '#fff'];

    function createConfetti() {
        return {
            x: rand(0, confettiCanvas.width),
            y: rand(-confettiCanvas.height, 0),
            w: rand(6, 12),
            h: rand(4, 8),
            color: colors[Math.floor(rand(0, colors.length))],
            vy: rand(1.5, 4),
            vx: rand(-0.5, 0.5),
            rotation: rand(0, 360),
            rotSpeed: rand(-5, 5),
            opacity: rand(0.6, 1)
        };
    }

    /* Initialize particles */
    for (let i = 0; i < 80; i++) {
        const p = createConfetti();
        p.y = rand(0, confettiCanvas.height);
        confettiParticles.push(p);
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confettiParticles.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            p.rotation += p.rotSpeed;

            if (p.y > confettiCanvas.height + 20) {
                Object.assign(p, createConfetti());
            }

            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate((p.rotation * Math.PI) / 180);
            confettiCtx.globalAlpha = p.opacity;
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            confettiCtx.restore();
        });

        animFrameConfetti = requestAnimationFrame(animateConfetti);
    }

    animateConfetti();
}

/* ============================================
   FIREWORKS
   ============================================ */
function startFireworks() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    fireworksCtx = fireworksCanvas.getContext('2d');

    const fwColors = ['#ff6b9d', '#c44dff', '#ffd700', '#ff4757', '#70a1ff', '#2ed573', '#fff'];

    function createFireworkBurst(x, y) {
        const count = 40 + Math.floor(rand(0, 30));
        const color = fwColors[Math.floor(rand(0, fwColors.length))];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = rand(2, 6);
            fireworksParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: rand(0.01, 0.03),
                color: color,
                size: rand(1.5, 3)
            });
        }
    }

    function launchRandom() {
        const x = rand(fireworksCanvas.width * 0.1, fireworksCanvas.width * 0.9);
        const y = rand(fireworksCanvas.height * 0.1, fireworksCanvas.height * 0.5);
        createFireworkBurst(x, y);
    }

    /* Periodic launches */
    setInterval(launchRandom, 1500);
    launchRandom();

    function animateFireworks() {
        fireworksCtx.globalCompositeOperation = 'destination-out';
        fireworksCtx.fillStyle = 'rgba(0,0,0,0.15)';
        fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        fireworksCtx.globalCompositeOperation = 'lighter';

        fireworksParticles = fireworksParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.04; /* gravity */
            p.life -= p.decay;

            if (p.life <= 0) return false;

            fireworksCtx.globalAlpha = p.life;
            fireworksCtx.fillStyle = p.color;
            fireworksCtx.beginPath();
            fireworksCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            fireworksCtx.fill();

            return true;
        });

        fireworksCtx.globalAlpha = 1;
        animFrameFireworks = requestAnimationFrame(animateFireworks);
    }

    animateFireworks();
}

/* ============================================
   TYPING MESSAGE
   ============================================ */
function showTypingMessage() {
    const msgBox = document.querySelector('.message-box');
    const finalMsg = document.getElementById('final-message');
    let index = 0;

    /* Show message box after a short delay */
    setTimeout(() => {
        msgBox.classList.add('visible');
        typeChar();
    }, 1000);

    function typeChar() {
        if (index < BIRTHDAY_MESSAGE.length) {
            /* Handle newlines */
            if (BIRTHDAY_MESSAGE[index] === '\n') {
                typingTextEl.innerHTML += '<br>';
            } else {
                typingTextEl.innerHTML += BIRTHDAY_MESSAGE[index];
            }
            index++;

            /* Remove old cursor, add new one */
            const oldCursor = typingTextEl.querySelector('.typing-cursor');
            if (oldCursor) oldCursor.remove();
            const cursor = document.createElement('span');
            cursor.classList.add('typing-cursor');
            typingTextEl.appendChild(cursor);

            /* Typing speed */
            const speed = BIRTHDAY_MESSAGE[index - 1] === '\n' ? 100 : rand(40, 80);
            setTimeout(typeChar, speed);
        } else {
            /* Typing done - remove cursor and show final message */
            const cursor = typingTextEl.querySelector('.typing-cursor');
            if (cursor) cursor.remove();

            setTimeout(() => {
                msgBox.classList.remove('visible');
                msgBox.classList.add('hidden');
                setTimeout(() => {
                    finalMsg.classList.add('visible');
                }, 400);
            }, 2500);
        }
    }
}

/* ============================================
   MUSIC
   ============================================ */
function playMusic() {
    bgMusic.src = MUSIC_FILE;
    bgMusic.load();
    bgMusic.play().catch(() => {
        /* Autoplay blocked - user will click toggle */
    });
}

musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = '🎵';
        musicToggle.classList.remove('muted');
    } else {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        musicToggle.classList.add('muted');
    }
});

/* ============================================
   REPLAY
   ============================================ */
function setupReplay() {
    replayBtn.addEventListener('click', () => {
        /* Reset everything */
        clearInterval(slideshowTimer);
        cancelAnimationFrame(animFrameConfetti);
        cancelAnimationFrame(animFrameFireworks);
        confettiParticles = [];
        fireworksParticles = [];

        /* Stop music */
        bgMusic.pause();
        bgMusic.currentTime = 0;

        /* Reset cake */
        const candles = candlesEl.querySelectorAll('.candle');
        candles.forEach(c => {
            c.classList.remove('lit', 'blowing');
        });
        cakeBtn.textContent = 'မီးထွန်း 🎂';
        cakeBtn.style.pointerEvents = '';
        cakeState = 'off';

        /* Reset gift */
        giftBox.classList.remove('open');

        /* Reset slideshow */
        document.getElementById('slideshow').innerHTML = '';
        currentSlide = 0;

        /* Reset balloons */
        document.getElementById('balloons').innerHTML = '';

        /* Reset hearts containers */
        ['cake-hearts', 'gift-hearts', 'surprise-hearts'].forEach(id => {
            document.getElementById(id).innerHTML = '';
        });

        /* Reset stars */
        document.getElementById('stars-bg').innerHTML = '';

        /* Reset messages */
        typingTextEl.innerHTML = '';
        finalMessage.classList.remove('visible');
        document.querySelector('.message-box').classList.remove('visible', 'hidden');

        /* Reset music toggle */
        musicToggle.style.display = 'none';
        musicToggle.textContent = '🎵';
        musicToggle.classList.remove('muted');

        /* Reset canvas */
        if (confettiCtx) confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        if (fireworksCtx) fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

        /* Reset blow particles */
        blowParticles.innerHTML = '';

        /* Go back to cake scene */
        surpriseScene.classList.remove('active');
        giftScene.classList.remove('active');
        cakeScene.classList.add('active');

        /* Recreate hearts for cake scene */
        createFloatingHearts(document.getElementById('cake-hearts'), 12);
    });
}

/* ============================================
   WINDOW RESIZE HANDLER
   ============================================ */
function handleResize() {
    if (confettiCanvas.width > 0) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    if (fireworksCanvas.width > 0) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
}

window.addEventListener('resize', handleResize);

/* ============================================
   INITIALIZATION
   ============================================ */
function init() {
    setupCakeButton();
    setupGiftBox();
    setupReplay();
    createFloatingHearts(document.getElementById('cake-hearts'), 12);
}

/* Start when DOM is ready */
document.addEventListener('DOMContentLoaded', init);
