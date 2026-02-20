const API_BASE = window.API_BASE_URL || "http://localhost:4000";

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const yearEl = document.getElementById("year");
const highlightsContainer = document.getElementById("highlights");
const storiesTrack = document.getElementById("stories-track");
const metricsEls = document.querySelectorAll(".metric");
const contactForm = document.getElementById("contact-form");
const formStatus = document.querySelector(".form-status");

let storiesData = [];
let activeStoryIndex = 0;

navToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
});

yearEl.textContent = new Date().getFullYear();

async function fetchJson(path) {
  try {
    const response = await fetch(`${API_BASE}${path}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Unable to load", path, error);
    return null;
  }
}

function renderMetrics(metrics) {
  metricsEls.forEach(metric => {
    const key = metric.dataset.key;
    const valueEl = metric.querySelector(".metric-value");
    if (!metrics || !(key in metrics)) {
      valueEl.textContent = "--";
      return;
    }
    const value = metrics[key];
    valueEl.textContent = value.toLocaleString();
  });
}

function createProgramCard(program) {
  const card = document.createElement("article");
  card.className = "program-card";

  const date = new Date(program.date);
  const dateLabel = document.createElement("span");
  dateLabel.className = "program-date";
  if (!Number.isNaN(date.valueOf())) {
    dateLabel.textContent = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } else {
    dateLabel.textContent = program.date;
  }

  const title = document.createElement("h3");
  title.textContent = program.title;

  const location = document.createElement("p");
  location.className = "program-location";
  location.textContent = program.location;

  const description = document.createElement("p");
  description.textContent = program.description;

  card.append(dateLabel, title, location, description);
  return card;
}

function renderPrograms(highlights = []) {
  if (!highlightsContainer) return;
  highlightsContainer.innerHTML = "";
  highlights.forEach(program => {
    highlightsContainer.appendChild(createProgramCard(program));
  });
}

function createStoryCard(story) {
  const card = document.createElement("article");
  card.className = "story-card";

  const title = document.createElement("h3");
  title.textContent = story.title;

  const region = document.createElement("span");
  region.className = "region";
  region.textContent = `${story.name} • ${story.region}`;

  const excerpt = document.createElement("p");
  excerpt.textContent = story.excerpt;

  card.append(title, region, excerpt);
  return card;
}

function renderStories(stories = []) {
  storiesTrack.innerHTML = "";
  stories.forEach(story => {
    storiesTrack.appendChild(createStoryCard(story));
  });
  updateStoryPosition(0);
}

function updateStoryPosition(delta) {
  if (!storiesData.length) return;
  if (typeof delta === "number") {
    activeStoryIndex = (activeStoryIndex + delta + storiesData.length) % storiesData.length;
  }
  const offset = activeStoryIndex * storiesTrack.firstElementChild.offsetWidth;
  storiesTrack.style.transform = `translateX(-${offset}px)`;
}

const prevBtn = document.querySelector(".carousel-control.prev");
const nextBtn = document.querySelector(".carousel-control.next");

prevBtn?.addEventListener("click", () => updateStoryPosition(-1));
nextBtn?.addEventListener("click", () => updateStoryPosition(1));

window.addEventListener("resize", () => updateStoryPosition(0));

async function bootstrap() {
  const [metricsPayload, highlightsPayload, storiesPayload] = await Promise.all([
    fetchJson("/api/metrics"),
    fetchJson("/api/highlights"),
    fetchJson("/api/stories")
  ]);

  renderMetrics(metricsPayload?.metrics);
  renderPrograms(highlightsPayload?.highlights || []);
  storiesData = storiesPayload?.stories || [];
  renderStories(storiesData);
}

contactForm?.addEventListener("submit", async event => {
  event.preventDefault();
  formStatus.textContent = "Sending...";
  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Unable to submit form");
    }

    const result = await response.json();
    formStatus.textContent = result.message || "Thank you!";
    contactForm.reset();
  } catch (error) {
    console.error(error);
    formStatus.textContent = "We could not send your message. Please try again.";
  }
});

bootstrap();
