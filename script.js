document.addEventListener("DOMContentLoaded", () => {

  // YEAR
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const nav = document.getElementById("primary-nav");
      const menuToggle = document.getElementById("menu-toggle");
      if (window.innerWidth <= 900 && nav) nav.style.display = "none";
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // MOBILE MENU
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  menuToggle?.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    if (nav) nav.style.display = expanded ? "none" : "block";
  });

  // DARK MODE
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.classList.add("dark");
      themeToggle?.setAttribute("aria-pressed", "true");
    } else {
      root.classList.remove("dark");
      themeToggle?.setAttribute("aria-pressed", "false");
    }
  }

  applyTheme(storedTheme || (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const next = root.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  // SLIDESHOW
  const slidesContainer = document.getElementById("slides");
  let slideIndex = 0;

  if (slidesContainer) {
    const prevBtn = document.querySelector(".slide-btn.prev");
    const nextBtn = document.querySelector(".slide-btn.next");

    function getSlideWidth() {
      if (!slidesContainer.children.length) return 0;
      const slide = slidesContainer.children[0];
      const rect = slide.getBoundingClientRect();
      const style = getComputedStyle(slide);
      return rect.width + parseFloat(style.marginRight || 0);
    }

    function updateSlide() {
      const width = getSlideWidth();
      const maxIndex = Math.max(0, slidesContainer.children.length - 1);
      if (slideIndex > maxIndex) slideIndex = maxIndex;
      if (!width) return;
      slidesContainer.style.transform = `translateX(${-slideIndex * width}px)`;
    }

    nextBtn?.addEventListener("click", () => {
      slideIndex = Math.min(slideIndex + 1, slidesContainer.children.length - 1);
      updateSlide();
    });

    prevBtn?.addEventListener("click", () => {
      slideIndex = Math.max(slideIndex - 1, 0);
      updateSlide();
    });

    window.addEventListener("resize", updateSlide);
    // initialize and recalc after images load
    updateSlide();
    const imgs = slidesContainer.querySelectorAll('img');
    imgs.forEach(img => {
      if (!img.complete) img.addEventListener('load', updateSlide);
    });
  }

  // SKILLS ANIMATION
  const skills = document.querySelectorAll(".skill");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const percent = entry.target.getAttribute("data-percent");
          const fill = entry.target.querySelector(".progress-fill");
          if (fill) fill.style.width = percent + "%";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skills.forEach(skill => observer.observe(skill));
  }

  // CONTACT FORM
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (status) {
        status.textContent = "Sending...";
        status.style.color = "#0ea5a4";
      }

      const data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        projectType: form.projectType.value,
        email: form.email.value.trim(),
        message: form.message.value.trim()
      };

      // Simulate form submission
      setTimeout(() => {
        if (status) {
          status.textContent = "Message sent successfully!";
          status.style.color = "#22c55e";
        }
        form.reset();
      }, 1000);
    });
  }

});

