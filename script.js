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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

function prepareRSVP(answer) {
  const message = answer === "yes"
    ? "Assalamu alaikum! In shaa Allah, I will attend the Nikah of Fahmida & Salih on 23 November 2026 at 10:30 AM at Sabha Hall, 1st Mail, Kizhisseri, Malappuram."
    : "Assalamu alaikum! Thank you for inviting me to the Nikah of Fahmida & Salih on 23 November 2026. Unfortunately, I will not be able to attend. May Allah bless you both.";
  document.getElementById("rsvpNote").textContent = "Your RSVP message is ready. Choose Share or copy it to send to the couple.";
  if (navigator.share) {
    navigator.share({ title: "Fahmida & Salih — RSVP", text: message }).catch(() => {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(message).then(() => {
      document.getElementById("rsvpNote").textContent = "RSVP message copied. Paste it into WhatsApp to send it.";
    }).catch(() => {
      window.prompt("Copy your RSVP message:", message);
    });
  } else {
    window.prompt("Copy your RSVP message:", message);
  }
}
document.getElementById("yesBtn").addEventListener("click", () => prepareRSVP("yes"));
document.getElementById("noBtn").addEventListener("click", () => prepareRSVP("no"));

document.getElementById("shareBtn").addEventListener("click", async () => {
  const shareData = {
    title: "Fahmida & Salih — Wedding Invitation",
    text: "With love and duas, you are invited to the Nikah of Fahmida & Salih on 23 November 2026 at 10:30 AM at Sabha Hall, 1st Mail, Kizhisseri, Malappuram.",
    url: window.location.href
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (e) {}
  } else if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareData.text + " " + shareData.url);
      document.getElementById("rsvpNote").textContent = "Invitation details copied. You can paste them into WhatsApp.";
    } catch (e) {
      window.prompt("Copy this invitation:", shareData.text + " " + shareData.url);
    }
  } else {
    window.prompt("Copy this invitation:", shareData.text + " " + shareData.url);
  }
});
