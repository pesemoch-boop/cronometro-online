const defaultTitle = document.title;
const alarmFile = document.getElementById("alarmFile");
const fileName = document.getElementById("fileName");
const removeAlarm = document.getElementById("removeAlarm");

let alarmAudio = new Audio();

const timer = document.getElementById("timer");

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

const modeStopwatch = document.getElementById("modeStopwatch");
const modeCountdown = document.getElementById("modeCountdown");

const countdownInputs = document.getElementById("countdownInputs");

const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

let mode = "stopwatch";

let interval = null;

let isPaused = false;

let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;

let totalCountdownTime = 0;



// =========================
// SUBIR MP3
// =========================

alarmFile.addEventListener("change", () => {

  const file = alarmFile.files[0];

  if(file){

    fileName.innerText = file.name;

    const fileURL = URL.createObjectURL(file);

    alarmAudio.src = fileURL;

  }

});



// =========================
// QUITAR MP3
// =========================

removeAlarm.addEventListener("click", () => {

  alarmAudio.pause();
  alarmAudio.currentTime = 0;

  alarmAudio.src = "";

  alarmFile.value = "";

  fileName.innerText = "Ningún archivo seleccionado";

});


function updateTabTitle(){

  if(mode === "stopwatch"){

    let h = hours.toString().padStart(2,'0');
    let m = minutes.toString().padStart(2,'0');
    let s = seconds.toString().padStart(2,'0');
    let ms = milliseconds.toString().padStart(2,'0');

    document.title = `⏱️ ${h}:${m}:${s}.${ms}`;

  }

  else{

    let h = Math.floor(totalCountdownTime / 3600);
    let m = Math.floor((totalCountdownTime % 3600) / 60);
    let s = totalCountdownTime % 60;

    h = h.toString().padStart(2,'0');
    m = m.toString().padStart(2,'0');
    s = s.toString().padStart(2,'0');

    document.title = `⏳ ${h}:${m}:${s}`;

    updateTabTitle();

  }

}


// =========================
// ACTUALIZAR STOPWATCH
// =========================

function updateStopwatchDisplay(){

  let h = hours.toString().padStart(2,'0');
  let m = minutes.toString().padStart(2,'0');
  let s = seconds.toString().padStart(2,'0');
  let ms = milliseconds.toString().padStart(2,'0');

  timer.innerText = `${h}:${m}:${s}.${ms}`;

}



// =========================
// ACTUALIZAR COUNTDOWN
// =========================

function updateCountdownDisplay(){

  let h = Math.floor(totalCountdownTime / 3600);
  let m = Math.floor((totalCountdownTime % 3600) / 60);
  let s = totalCountdownTime % 60;

  h = h.toString().padStart(2,'0');
  m = m.toString().padStart(2,'0');
  s = s.toString().padStart(2,'0');

  timer.innerText = `${h}:${m}:${s}`;

}



// =========================
// INICIAR TIMER
// =========================

function startTimer(){

  if(interval !== null) return;

  pauseBtn.innerText = "PAUSAR";

  isPaused = false;

  // =====================
  // STOPWATCH
  // =====================

  if(mode === "stopwatch"){

    // CONTINUAR AUDIO SI ESTÁ PAUSADO
    if(alarmAudio.src && alarmAudio.paused){

      alarmAudio.play();

    }

    interval = setInterval(() => {

      milliseconds++;

      if(milliseconds === 100){

        milliseconds = 0;
        seconds++;

      }

      if(seconds === 60){

        seconds = 0;
        minutes++;

      }

      if(minutes === 60){

        minutes = 0;
        hours++;

      }

      updateStopwatchDisplay();

    },10);

  }

  // =====================
  // COUNTDOWN
  // =====================

  else {

    if(totalCountdownTime <= 0){

      totalCountdownTime =
        (parseInt(hoursInput.value) || 0) * 3600 +
        (parseInt(minutesInput.value) || 0) * 60 +
        (parseInt(secondsInput.value) || 0);

    }

    updateCountdownDisplay();

    interval = setInterval(() => {

      if(totalCountdownTime <= 0){

        clearInterval(interval);

        interval = null;

        document.body.classList.add("flash");

        // REPRODUCIR ALARMA
        if(alarmAudio.src){

          alarmAudio.currentTime = 0;

          alarmAudio.play();

        }

        return;

      }

      totalCountdownTime--;

      updateCountdownDisplay();

    },1000);

  }

}



// =========================
// PAUSAR / CONTINUAR
// =========================

function pauseTimer(){

  // PAUSAR
  if(interval !== null){

    clearInterval(interval);

    interval = null;

    alarmAudio.pause();

    pauseBtn.innerText = "CONTINUAR";

    isPaused = true;

  }

  // CONTINUAR
  else if(isPaused){

    startTimer();

    if(alarmAudio.src){

      alarmAudio.play();

    }

    pauseBtn.innerText = "PAUSAR";

  }

}



// =========================
// RESET TIMER
// =========================

function resetTimer(){

  document.body.classList.remove("flash");

  clearInterval(interval);

  interval = null;

  pauseBtn.innerText = "PAUSAR";

  isPaused = false;

  // DETENER AUDIO
  alarmAudio.pause();

  alarmAudio.currentTime = 0;

  milliseconds = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;

  totalCountdownTime = 0;

  hoursInput.value = "";
  minutesInput.value = "";
  secondsInput.value = "";

  if(mode === "stopwatch"){

    updateStopwatchDisplay();

  }

  else {

    timer.innerText = "00:00:00";

  }

}



// =========================
// CAMBIAR A STOPWATCH
// =========================

modeStopwatch.addEventListener("click", () => {

  resetTimer();

  mode = "stopwatch";

  countdownInputs.style.display = "none";

  modeStopwatch.classList.add("active");

  modeCountdown.classList.remove("active");

  updateStopwatchDisplay();

});



// =========================
// CAMBIAR A COUNTDOWN
// =========================

modeCountdown.addEventListener("click", () => {

  resetTimer();

  mode = "countdown";

  countdownInputs.style.display = "flex";

  modeCountdown.classList.add("active");

  modeStopwatch.classList.remove("active");

  timer.innerText = "00:00:00";

});



// =========================
// BOTONES
// =========================

startBtn.addEventListener("click", startTimer);

pauseBtn.addEventListener("click", pauseTimer);

resetBtn.addEventListener("click", resetTimer);



// =========================
// INICIO
// =========================

updateStopwatchDisplay();