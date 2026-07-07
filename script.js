/* ==========================================
      CONGRATULATIONS PAGE
      Created with ❤️
========================================== */

// Loading Screen
const loadingScreen = document.getElementById("loading-screen");

// Main Page
const page = document.getElementById("page-shell");

// Canvas
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

// Popup
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

// Envelope
const envelope = document.getElementById("envelope");
const flap = document.querySelector(".envelope-flap");
const letter = document.querySelector(".letter");

// GPA Number
const gpaNumber = document.getElementById("gpaNumber");

// Music
const musicBtn = document.getElementById("musicBtn");

let musicPlaying = false;

// Canvas Size
let w = window.innerWidth;
let h = window.innerHeight;

canvas.width = w;
canvas.height = h;

window.addEventListener("resize", () => {

    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

});



/* ==========================================
            LOADING SCREEN
========================================== */

window.addEventListener("load",()=>{

    setTimeout(()=>{

        loadingScreen.style.opacity="0";

        setTimeout(()=>{

            loadingScreen.style.display="none";

            page.classList.remove("hidden");

            page.style.animation="fadeUp 1s forwards";

            startAnimation();

        },900);

    },3500);

});



/* ==========================================
         START EVERYTHING
========================================== */

function startAnimation(){

    createStars();

    animateBackground();

    animateGPA();

    startFloatingHearts();

    startPetals();

    startFireworks();

    startConfetti();

    showPopup();

}
/* ==========================================
      CONGRATULATIONS PAGE
      Created with ❤️
========================================== */

// Loading Screen
const loadingScreen = document.getElementById("loading-screen");

// Main Page
const page = document.getElementById("page-shell");

// Canvas
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

// Popup
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

// Envelope
const envelope = document.getElementById("envelope");
const flap = document.querySelector(".envelope-flap");
const letter = document.querySelector(".letter");

// GPA Number
const gpaNumber = document.getElementById("gpaNumber");

// Music
const musicBtn = document.getElementById("musicBtn");

let musicPlaying = false;

// Canvas Size
let w = window.innerWidth;
let h = window.innerHeight;

canvas.width = w;
canvas.height = h;

window.addEventListener("resize", () => {

    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

});



/* ==========================================
            LOADING SCREEN
========================================== */

window.addEventListener("load",()=>{

    setTimeout(()=>{

        loadingScreen.style.opacity="0";

        setTimeout(()=>{

            loadingScreen.style.display="none";

            page.classList.remove("hidden");

            page.style.animation="fadeUp 1s forwards";

            startAnimation();

        },900);

    },3500);

});



/* ==========================================
         START EVERYTHING
========================================== */

function startAnimation(){

    createStars();

    animateBackground();

    animateGPA();

    startFloatingHearts();

    startPetals();

    startFireworks();

    startConfetti();

    showPopup();

}
/* ==========================================
            GPA COUNT UP
========================================== */

function animateGPA(){

    let start = 0;
    let end = 3.80;
    let duration = 2500;

    let startTime = null;

    function update(currentTime){

        if(!startTime) startTime = currentTime;

        let progress = Math.min((currentTime-startTime)/duration,1);

        let value = progress*end;

        gpaNumber.innerHTML=value.toFixed(2);

        if(progress<1){

            requestAnimationFrame(update);

        }

    }

    requestAnimationFrame(update);

}


/* ==========================================
            FLOATING HEARTS
========================================== */

function startFloatingHearts(){

    setInterval(()=>{

        let heart=document.createElement("div");

        heart.className="heart";

        heart.innerHTML="❤️";

        heart.style.left=Math.random()*100+"vw";

        heart.style.fontSize=(18+Math.random()*18)+"px";

        heart.style.animationDuration=(6+Math.random()*5)+"s";

        document.body.appendChild(heart);

        setTimeout(()=>{

            heart.remove();

        },11000);

    },700);

}


/* ==========================================
            FLOWER PETALS
========================================== */

function startPetals(){

    const colors=["#ffd6e7","#ffe3ef","#ffc6da","#ffe9f3"];

    setInterval(()=>{

        let petal=document.createElement("div");

        petal.className="petal";

        petal.style.left=Math.random()*100+"vw";

        petal.style.background=

        colors[Math.floor(Math.random()*colors.length)];

        petal.style.animationDuration=

        (7+Math.random()*5)+"s";

        petal.style.transform=

        "rotate("+Math.random()*360+"deg)";

        document.body.appendChild(petal);

        setTimeout(()=>{

            petal.remove();

        },12000);

    },350);

}


/* ==========================================
            CONFETTI
========================================== */

function startConfetti(){

    const colors=[

        "#ff4d6d",

        "#4dabff",

        "#ffd43b",

        "#63e6be",

        "#ffffff",

        "#ff99cc"

    ];

    for(let i=0;i<180;i++){

        setTimeout(()=>{

            let c=document.createElement("div");

            c.className="confetti";

            c.style.left=Math.random()*100+"vw";

            c.style.background=

            colors[Math.floor(Math.random()*colors.length)];

            c.style.transform=

            "rotate("+Math.random()*360+"deg)";

            c.style.animationDuration=

            (3+Math.random()*2)+"s";

            document.body.appendChild(c);

            setTimeout(()=>{

                c.remove();

            },6000);

        },i*18);

    }

}


/* ==========================================
            FIREWORKS
========================================== */

function startFireworks(){

    setInterval(()=>{

        createFirework(

            Math.random()*w,

            120+Math.random()*250

        );

    },1200);

}



function createFirework(x,y){

    const colors=[

        "#ffffff",

        "#ffcc00",

        "#66ccff",

        "#ff66cc",

        "#99ffcc"

    ];

    for(let i=0;i<40;i++){

        let p=document.createElement("div");

        p.className="firework";

        p.style.left=x+"px";

        p.style.top=y+"px";

        p.style.background=

        colors[Math.floor(Math.random()*colors.length)];

        document.body.appendChild(p);

        let angle=(Math.PI*2/40)*i;

        let distance=80+Math.random()*70;

        let dx=Math.cos(angle)*distance;

        let dy=Math.sin(angle)*distance;

        p.animate([

            {

                transform:"translate(0,0)",

                opacity:1

            },

            {

                transform:`translate(${dx}px,${dy}px)`,

                opacity:0

            }

        ],{

            duration:1400,

            easing:"ease-out"

        });

        setTimeout(()=>{

            p.remove();

        },1500);

    }

}
/* ==========================================
            POPUP AFTER 5 SECONDS
========================================== */

function showPopup(){

    setTimeout(()=>{

        popup.classList.remove("hidden");

        popup.style.display="flex";

        popup.style.animation="popupAppear .8s ease forwards";

    },5000);

}



/* ==========================================
          CLOSE POPUP
========================================== */

closePopup.addEventListener("click",()=>{

    popup.style.opacity="0";

    setTimeout(()=>{

        popup.style.display="none";

        openEnvelope();

    },500);

});



/* ==========================================
          OPEN ENVELOPE
========================================== */

function openEnvelope(){

    envelope.classList.add("open");

    flap.style.transform="rotateX(180deg)";

    setTimeout(()=>{

        typeLetter();

    },1000);

}



/* ==========================================
            LETTER MESSAGE
========================================== */

const message=[

"Dear Future Nurse ❤️",

"",

"Congratulations on achieving an incredible 3.80 GPA.",

"",

"I know this wasn't easy.",

"Every assignment.",

"Every practical.",

"Every exam.",

"Every sleepless night.",

"",

"They all became part of your success.",

"",

"You chose one of the noblest professions in the world.",

"One day countless people will smile because of your kindness.",

"",

"I truly hope you continue believing in yourself because this is only the beginning.",

"",

"May Allah bless your journey.",

"May He protect you.",

"May He make you an amazing nurse.",

"",

"Congratulations once again.",

"",

"Keep smiling 😊",

"Keep healing ❤️",

"Keep shining ✨"

];


/* ==========================================
        TYPEWRITER EFFECT
========================================== */

function typeLetter(){

    letter.innerHTML="";

    let line=0;

    function writeLine(){

        if(line>=message.length){

            endingSequence();

            return;

        }

        let p=document.createElement("p");

        p.style.marginBottom="15px";

        letter.appendChild(p);

        let text=message[line];

        let i=0;

        function type(){

            if(i<text.length){

                p.innerHTML+=text.charAt(i);

                i++;

                setTimeout(type,40);

            }else{

                line++;

                setTimeout(writeLine,350);

            }

        }

        type();

    }

    writeLine();

}



/* ==========================================
            ENDING
========================================== */

function endingSequence(){

    setTimeout(()=>{

        let end=document.createElement("div");

        end.style.position="fixed";

        end.style.left="0";

        end.style.top="0";

        end.style.width="100%";

        end.style.height="100%";

        end.style.background="rgba(0,0,0,.85)";

        end.style.display="flex";

        end.style.justifyContent="center";

        end.style.alignItems="center";

        end.style.flexDirection="column";

        end.style.zIndex="99999";

        end.style.color="white";

        end.style.textAlign="center";

        end.style.padding="30px";

        end.innerHTML=`

        <h1 style="font-size:55px;font-family:Playfair Display,serif">

        🌟 Congratulations 🌟

        </h1>

        <p style="font-size:24px;max-width:700px;line-height:1.8">

        Some achievements deserve more than words.

        <br><br>

        They deserve to be remembered forever.

        <br><br>

        May your future be filled with success,

        happiness,

        and endless blessings.

        </p>

        <h2 style="margin-top:40px">

        ❤️ Made Especially For You ❤️

        </h2>

        `;

        document.body.appendChild(end);

    },2500);

}
/* ==========================================
        PREMIUM SHOOTING STARS
========================================== */

function shootingStar(){

    const star=document.createElement("div");

    star.style.position="fixed";

    star.style.left=(Math.random()*window.innerWidth)+"px";

    star.style.top=(Math.random()*200)+"px";

    star.style.width="180px";

    star.style.height="2px";

    star.style.background="linear-gradient(90deg,white,transparent)";

    star.style.transform="rotate(-25deg)";

    star.style.opacity="0";

    star.style.pointerEvents="none";

    star.style.zIndex="999";

    document.body.appendChild(star);

    star.animate([

        {

            transform:"translate(0,0) rotate(-25deg)",

            opacity:1

        },

        {

            transform:"translate(-500px,300px) rotate(-25deg)",

            opacity:0

        }

    ],{

        duration:1500,

        easing:"ease-out"

    });

    setTimeout(()=>{

        star.remove();

    },1500);

}

setInterval(shootingStar,9000);



/* ==========================================
            CAMERA FLASH
========================================== */

function cameraFlash(){

    const flash=document.createElement("div");

    flash.style.position="fixed";

    flash.style.left="0";

    flash.style.top="0";

    flash.style.width="100%";

    flash.style.height="100%";

    flash.style.background="white";

    flash.style.opacity="0";

    flash.style.pointerEvents="none";

    flash.style.zIndex="99999";

    document.body.appendChild(flash);

    flash.animate([

        {

            opacity:0

        },

        {

            opacity:.9

        },

        {

            opacity:0

        }

    ],{

        duration:600

    });

    setTimeout(()=>{

        flash.remove();

    },650);

}



/* ==========================================
        PLAY FLASH AT 3.80 GPA
========================================== */

setTimeout(()=>{

    cameraFlash();

},2600);



/* ==========================================
            CURSOR SPARKLES
========================================== */

document.addEventListener("mousemove",(e)=>{

    let spark=document.createElement("div");

    spark.style.position="fixed";

    spark.style.left=e.clientX+"px";

    spark.style.top=e.clientY+"px";

    spark.style.width="6px";

    spark.style.height="6px";

    spark.style.borderRadius="50%";

    spark.style.background="white";

    spark.style.boxShadow="0 0 15px white";

    spark.style.pointerEvents="none";

    spark.style.zIndex="9999";

    document.body.appendChild(spark);

    spark.animate([

        {

            transform:"scale(1)",

            opacity:1

        },

        {

            transform:"translateY(-25px) scale(0)",

            opacity:0

        }

    ],{

        duration:700

    });

    setTimeout(()=>{

        spark.remove();

    },700);

});



/* ==========================================
            GRAND FINALE
========================================== */

function grandFinale(){

    for(let i=0;i<12;i++){

        setTimeout(()=>{

            createFirework(

                Math.random()*window.innerWidth,

                150+Math.random()*250

            );

        },i*300);

    }

}



setTimeout(()=>{

    grandFinale();

},18000);



/* ==========================================
            SIMPLE PIANO
========================================== */

let audioCtx;

function playMusic(){

    if(audioCtx) return;

    audioCtx=new(window.AudioContext||window.webkitAudioContext)();

    const notes=[261.63,329.63,392.00,523.25];

    let index=0;

    setInterval(()=>{

        let osc=audioCtx.createOscillator();

        let gain=audioCtx.createGain();

        osc.type="triangle";

        osc.frequency.value=notes[index];

        gain.gain.value=.05;

        osc.connect(gain);

        gain.connect(audioCtx.destination);

        osc.start();

        gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+1);

        osc.stop(audioCtx.currentTime+1);

        index++;

        if(index>=notes.length){

            index=0;

        }

    },900);

}



/* ==========================================
            START MUSIC
========================================== */

document.body.addEventListener("click",()=>{

    playMusic();

},{once:true});