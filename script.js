const body = document.body;
const loader = document.querySelector(".loader");
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const parallax = document.querySelector("[data-parallax]");
const counters = document.querySelectorAll("[data-count]");
const reveals = document.querySelectorAll(".reveal");
const form = document.querySelector(".contact-form");
const year = document.getElementById("year");

body.classList.add("loading");
year.textContent = new Date().getFullYear();

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    body.classList.remove("loading");
  }, 700);
});

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setParallax = () => {
  if (!parallax) return;
  const offset = Math.min(window.scrollY * 0.13, 90);
  parallax.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
};

setHeaderState();
setParallax();

window.addEventListener(
  "scroll",
  () => {
    setHeaderState();
    requestAnimationFrame(setParallax);
  },
  { passive: true }
);

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  const duration = 1200;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased).toLocaleString("en-US");

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");

      if (entry.target.dataset.count && !entry.target.dataset.counted) {
        entry.target.dataset.counted = "true";
        animateCounter(entry.target);
      }

      entry.target.querySelectorAll?.("[data-count]").forEach((counter) => {
        if (counter.dataset.counted) return;
        counter.dataset.counted = "true";
        animateCounter(counter);
      });

      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

reveals.forEach((element) => observer.observe(element));
counters.forEach((counter) => observer.observe(counter));

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = form.querySelector("button");
  const buttonText = button.querySelector("span");
  const status = form.querySelector(".form-status");
  const originalText = buttonText.textContent;

  button.classList.add("is-sending");
  buttonText.textContent = "Envoi en cours...";
  status.textContent = "";

  window.setTimeout(() => {
    button.classList.remove("is-sending");
    buttonText.textContent = originalText;
    status.textContent = "Merci. Votre message est pret pour l'equipe AL HORRA FOODS.";
    form.reset();
  }, 850);
});
