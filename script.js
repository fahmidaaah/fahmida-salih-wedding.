const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");
const openBtn = document.getElementById("openBtn");

openBtn.addEventListener("click", () => {
  intro.classList.add("opened");
  openBtn.disabled = true;
  openBtn.textContent = "Opening with love…";
  window.setTimeout(() => {
    intro.style.display = "none";
    invitation.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "auto" });
    initScrollReveal();
  }, 950);
});

const weddingDate = new Date("2026-11-23T10:30:00+05:30").getTime();
function updateCountdown() {
  const now = Date.now();
  let diff = weddingDate - now;
  if (diff <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    document.querySelector(".countdown-title").textContent = "TODAY IS OUR SPECIAL DAY";
    return;
  }
  const days = Math.floor(diff / 86400000); diff %= 86400000;
  const hours = Math.floor(diff / 3600000); diff %= 3600000;
  const minutes = Math.floor(diff / 60000); diff %= 60000;
  const seconds = Math.floor(diff / 1000);
  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Swipe / drag the parchment envelope to reveal the wedding date with a soft, physical motion.
const dateRevealStage = document.getElementById("dateRevealStage");
const dateRevealCard = document.getElementById("dateRevealCard");
const revealedDate = document.getElementById("revealedDate");
if (dateRevealStage && dateRevealCard && revealedDate) {
  let startX = 0, startY = 0, dragX = 0, dragging = false, revealed = false, moved = false;
  const resetCard = () => {
    dateRevealCard.style.transition = "transform .72s cubic-bezier(.2,.85,.2,1), filter .5s ease";
    dateRevealCard.style.transform = "translate3d(0,0,0) rotate(0deg) scale(1)";
    dateRevealCard.style.filter = "brightness(1)";
    window.setTimeout(() => { if (!revealed) dateRevealCard.style.transition = ""; }, 740);
  };
  const revealWeddingDate = () => {
    if (revealed) return;
    revealed = true;
    dateRevealCard.style.transition = "transform .9s cubic-bezier(.16,1,.3,1), opacity .65s ease, filter .65s ease";
    dateRevealStage.classList.add("is-revealed");
    revealedDate.setAttribute("aria-hidden", "false");
    dateRevealCard.setAttribute("aria-label", "Wedding date revealed: November 23, 2026 at 10:30 AM");
    showerPetals();
    window.setTimeout(() => { dateRevealCard.style.display = "none"; }, 950);
  };
  dateRevealCard.addEventListener("pointerdown", (event) => {
    if (revealed) return;
    dragging = true; moved = false; startX = event.clientX; startY = event.clientY; dragX = 0;
    dateRevealCard.style.transition = "none";
    dateRevealCard.style.cursor = "grabbing";
    if (dateRevealCard.setPointerCapture) dateRevealCard.setPointerCapture(event.pointerId);
  });
  dateRevealCard.addEventListener("pointermove", (event) => {
    if (!dragging || revealed) return;
    const dx = event.clientX - startX, dy = event.clientY - startY;
    if (Math.abs(dx) > 5) moved = true;
    // A sideways swipe peels the card away; vertical page scrolling stays native and smooth.
    if (Math.abs(dx) > Math.abs(dy) * 1.05 && Math.abs(dx) > 4) {
      event.preventDefault();
      dragX = dx;
      const rotate = Math.max(-7, Math.min(7, dx / 22));
      const scale = Math.max(.965, 1 - Math.abs(dx) / 1800);
      dateRevealCard.style.transform = `translate3d(${dx}px, ${Math.min(8, Math.abs(dx) * .025)}px, 0) rotate(${rotate}deg) scale(${scale})`;
      dateRevealCard.style.filter = `brightness(${1 + Math.min(.1, Math.abs(dx) / 900)})`;
    }
  }, { passive: false });
  const finishSwipe = () => {
    if (!dragging) return;
    dragging = false;
    dateRevealCard.style.cursor = "grab";
    if (Math.abs(dragX) > Math.min(90, window.innerWidth * .22)) {
      revealWeddingDate();
    } else {
      resetCard();
    }
  };
  dateRevealCard.addEventListener("pointerup", finishSwipe);
  dateRevealCard.addEventListener("pointercancel", finishSwipe);
  dateRevealCard.addEventListener("click", (event) => {
    if (revealed) return;
    // Tap works too; suppress the synthetic click after an actual drag.
    if (moved) { moved = false; return; }
    revealWeddingDate();
  });
  dateRevealCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); revealWeddingDate();
    }
  });
}

// RSVP buttons are purely decorative interactions: show a brief falling-petal celebration.
function showerPetals() {
  const layer = document.createElement("div");
  layer.className = "petal-shower";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  const petals = ["🌸", "🌷", "✿", "❀", "🌺"];
  for (let i = 0; i < 28; i++) {
    const petal = document.createElement("span");
    petal.className = "falling-petal";
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 0.9}s`;
    petal.style.animationDuration = `${2.4 + Math.random() * 2}s`;
    petal.style.setProperty("--drift", `${Math.round(Math.random() * 140 - 70)}px`);
    petal.style.fontSize = `${16 + Math.random() * 17}px`;
    layer.appendChild(petal);
  }
  window.setTimeout(() => layer.remove(), 5200);
}
document.getElementById("yesBtn").addEventListener("click", showerPetals);
document.getElementById("noBtn").addEventListener("click", showerPetals);

// Background music: upload your own licensed audio file as wedding-music.mp3
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
if (music && musicToggle && musicLabel) {
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicLabel.textContent = "Pause music";
        musicToggle.setAttribute("aria-label", "Pause background music");
      } catch (error) {
        musicLabel.textContent = "Music unavailable";
      }
    } else {
      music.pause();
      musicLabel.textContent = "Play music";
      musicToggle.setAttribute("aria-label", "Play background music");
    }
  });
}


// Subtle scroll reveals: content remains readable if the browser lacks IntersectionObserver.
function initScrollReveal() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const sections = document.querySelectorAll("#invitation > section");
  sections.forEach((section) => {
    const items = Array.from(section.children).filter((el) => {
      return !el.classList.contains("map-lines") && el.tagName !== "SCRIPT";
    });
    items.forEach((item) => item.classList.add("reveal-item"));
  });

  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  document.querySelectorAll("#invitation .reveal-item").forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      item.classList.add("is-visible");
    } else {
      observer.observe(item);
    }
  });
}

// Prevent rapid repeated taps on anchor links from feeling abrupt on mobile.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
