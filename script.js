// jshint esversion:9

const musicInfo = document.querySelector("#music-info");
const play = document.querySelector("#play");
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const audio = document.querySelector("audio");
const img = document.querySelector("#song-img");
const songName = document.querySelector(".song");
const progressBar = document.querySelector("#progress-bar");
const progressContainer = document.querySelector("#progress-container");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const volumeButton = document.querySelector("#volume-button");
const volumeContainer = document.querySelector("#volume-container");

let songDatabase = ["La Femme D'Argent - Air", "Red Dust - Zero 7", "Anarchy Road - Carpenter Brut", "Flyers - Bradio", "Faceless - RED"];
let songIndex = localStorage.getItem("currentSong") || 0;

audio.volume = localStorage.getItem("savedVolume") || 1;
volumeBar.style.height = audio.volume * 100 + "%";


function songPlaying() {
  let song = songDatabase[songIndex];

  audio.src = `music/${song}.mp3`;
  img.src = `img/${song}.jpg`;
  songName.innerText = `${song}`;
}

songPlaying();


function changingSong() {
  if(play.classList.contains("fa-pause")) {
    audio.play();
    img.style.animationPlayState = "running";
  }

  progressBar.style.width = "0";
}

// Show song info and progress bar + audio pause and play
play.addEventListener("click", function() {
  play.classList.toggle("fa-pause");
  play.classList.toggle("fa-play");
  musicInfo.classList.toggle("music-info-show");

  if(play.classList.contains("fa-pause")) {
    audio.play();
    img.style.animationPlayState = "running";
  } else {
    audio.pause();
    img.style.animationPlayState = "paused";
  }
});


// Previous song
prev.addEventListener("click", function() {
  if(songIndex === 0) {
    songPlaying(songIndex = songDatabase.length - 1);
  } else {
    songPlaying(songIndex--);
  }

  changingSong();

  localStorage.setItem("currentSong", `${songIndex}`);
});


// Next song
next.addEventListener("click", function() {
  if(songIndex === songDatabase.length - 1) {
    songPlaying(songIndex = 0);
  } else {
    songPlaying(songIndex++);
  }

  changingSong();

  localStorage.setItem("currentSong", `${songIndex}`);
});


// Update progress bar
audio.addEventListener("timeupdate", function(e) {
  let progress = (e.srcElement.currentTime / e.srcElement.duration) * 100;

  progressBar.style.width = `${progress}%`;
});


// Click in progress bar
progressContainer.addEventListener("click", function(e) {
  let timePercent = (e.offsetX / progressContainer.clientWidth) * 100;

  audio.currentTime = (audio.duration / 100) * timePercent;
});


// Song ended
audio.addEventListener("ended", function() {
  if(songIndex === songDatabase.length - 1) {
    songPlaying(songIndex = 0);
  } else {
    songPlaying(songIndex++);
  }

  changingSong();

  localStorage.setItem("currentSong", `${songIndex}`);
});


// Key pressed events (play/pause, next song, prev song)
window.addEventListener("keydown", function(e) {
  if(e.keyCode === 32) {
    play.classList.toggle("fa-pause");
    play.classList.toggle("fa-play");
    musicInfo.classList.toggle("music-info-show");

    if(play.classList.contains("fa-pause")) {
      audio.play();
      img.style.animationPlayState = "running";
    } else {
      audio.pause();
      img.style.animationPlayState = "paused";
    }
  }
  else if(e.keyCode === 39) {
    if(songIndex === songDatabase.length - 1) {
      songPlaying(songIndex = 0);
    } else {
      songPlaying(songIndex++);
    }

    changingSong();

    localStorage.setItem("currentSong", `${songIndex}`);
  }
  else if(e.keyCode === 37) {
    if(songIndex === 0) {
      songPlaying(songIndex = songDatabase.length - 1);
    } else {
      songPlaying(songIndex--);
    }

    changingSong();

    localStorage.setItem("currentSong", `${songIndex}`);
  }
});


// Show-hide volume
volumeButton.addEventListener("mouseover", function() {
  volumeContainer.classList.add("show-volume");
});

window.addEventListener("click", function(e) {
  if(e.target !== volumeButton && e.target !== volumeBar && e.target !== volume) {
    volumeContainer.classList.remove("show-volume");
  }
});

// Volume bar
let drag = false;

function updateVolume(position) {
  let volumePercent = (position / volume.clientHeight) * 100;

  volumeBar.style.height = volumePercent + "%";
  audio.volume = volumePercent / 100;

  localStorage.setItem("savedVolume", `${audio.volume}`);
}

volume.addEventListener("mousedown", function(e) {
  drag = true;
  updateVolume(e.offsetY);
});

volume.addEventListener('mousemove',function(e){
  if(drag){
    updateVolume(e.offsetY);
  }
});
document.addEventListener('mouseup',function(e){
 drag = false;
});

// Mute
volumeButton.addEventListener("click", function() {
  if(audio.muted === false) {
    audio.muted = true;

    volumeBar.style.height = "0%";
  }
  else {
    audio.muted = false;

    volumeBar.style.height = audio.volume * 100 + "%";
  }
});

