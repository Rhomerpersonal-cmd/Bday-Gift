const galleryCards = [...document.querySelectorAll(".photo-card")];
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const closeLightboxButton = lightbox.querySelector(".lightbox-close");
const previousPhotoButton = lightbox.querySelector(".lightbox-previous");
const nextPhotoButton = lightbox.querySelector(".lightbox-next");
let activePhotoIndex = 0;

function showPhoto(index) {
  activePhotoIndex = (index + galleryCards.length) % galleryCards.length;
  const card = galleryCards[activePhotoIndex];
  const image = card.querySelector("img");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = card.dataset.caption;
}

galleryCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    showPhoto(index);
    lightbox.showModal();
  });
});

closeLightboxButton.addEventListener("click", () => lightbox.close());
previousPhotoButton.addEventListener("click", () => showPhoto(activePhotoIndex - 1));
nextPhotoButton.addEventListener("click", () => showPhoto(activePhotoIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    showPhoto(activePhotoIndex - 1);
  } else if (event.key === "ArrowRight") {
    showPhoto(activePhotoIndex + 1);
  }
});

const audio = document.querySelector("#birthday-song");
const playerCard = document.querySelector("#player-card");
const playButton = document.querySelector("#play-button");
const seekBar = document.querySelector("#seek-bar");
const currentTimeLabel = document.querySelector("#current-time");
const durationLabel = document.querySelector("#duration");
const audioStatus = document.querySelector("#audio-status");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function updateProgress() {
  const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  seekBar.value = String(progress);
  seekBar.style.background = `linear-gradient(to right, var(--purple) ${progress}%, #eee4f4 ${progress}%)`;
  currentTimeLabel.textContent = formatTime(audio.currentTime);
}

function setPlaying(isPlaying) {
  playerCard.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute(
    "aria-label",
    isPlaying ? "Pause Aphrodite by The Ridleys" : "Play Aphrodite by The Ridleys",
  );
}

playButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {
      setPlaying(false);
      audioStatus.textContent = "The song couldn't be played. Check that the audio file is in the audio folder.";
    });
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  setPlaying(true);
  audioStatus.textContent = "Playing Aphrodite by The Ridleys.";
});

audio.addEventListener("pause", () => {
  setPlaying(false);
  if (!audio.ended && audio.currentTime > 0) {
    audioStatus.textContent = "Paused.";
  }
});

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", () => {
  durationLabel.textContent = formatTime(audio.duration);
  updateProgress();
});
audio.addEventListener("ended", () => {
  setPlaying(false);
  audioStatus.textContent = "A song for Claire, with all my love.";
  updateProgress();
});
audio.addEventListener("error", () => {
  setPlaying(false);
  audioStatus.textContent = "The song couldn't be loaded. Check that the audio file is in the audio folder.";
});

seekBar.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (Number(seekBar.value) / 100) * audio.duration;
    updateProgress();
  }
});

updateProgress();
