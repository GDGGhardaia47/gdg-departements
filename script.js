// =========================================
// GDG Departments Application Script
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // --- Configuration & State ---
  const DEPT_COLORS = {
    relations: 'var(--google-yellow)',
    design: 'var(--google-green)',
    dev: 'var(--google-purple)',
    media: 'var(--google-blue)'
  };

  const DEPT_SECTIONS = {
    relations: ["rel_foundation", "rel_track_a", "rel_track_b", "rel_track_c", "rel_learn", "rel_contrib", "rel_career", "rel_tools"],
    design: ["des_foundation", "des_track_a", "des_track_b", "des_learn", "des_contrib", "des_career", "des_tools"],
    dev: ["dev_foundation", "dev_track_a", "dev_track_b", "dev_track_c", "dev_learn", "dev_contrib", "dev_career", "dev_tools"],
    media: ["med_foundation", "med_track_a", "med_track_b", "med_track_c", "med_learn", "med_contrib", "med_career", "med_tools"]
  };

  const i18n = window.GDG_TRANSLATIONS || { en: {}, ar: {} };
  let currentLang = localStorage.getItem("gdg-lang") || "en";
  let activeDept = null;

  // --- DOM Elements ---
  const els = {
    main: document.querySelector('main'),
    // Views
    homeView: document.getElementById("home-view"),
    deptView: document.getElementById("dept-view"),
    deptContent: document.getElementById("dept-content"),
    // Controls
    langBtn: document.getElementById("langBtn"),
    backBtn: document.getElementById("backBtn"),
    menuCards: document.querySelectorAll(".menu-card"),
    // Dynamic text
    dynamicText: document.querySelectorAll("[data-k]")
  };

  // --- Core Functions ---

  /**
   * Updates the application language and text direction.
   * @param {string} lang - 'en' or 'ar'
   */
  function setLanguage(lang) {
    if (!i18n[lang]) {
      console.error("Language translation not found:", lang);
      return;
    }

    currentLang = lang;
    localStorage.setItem("gdg-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    // Update Language Button
    if (els.langBtn) {
      els.langBtn.innerHTML = lang === "en"
        ? 'AR <span class="material-symbols-outlined">language</span>'
        : '<span class="material-symbols-outlined">language</span> EN';
    }

    // Update Static Text Elements
    els.dynamicText.forEach((el) => {
      const key = el.getAttribute("data-k");
      if (i18n[lang][key]) {
        el.innerHTML = i18n[lang][key];
      }
    });

    // Re-render active department if present
    if (activeDept) {
      renderDept(activeDept);
    }
  }

  /**
   * Toggles language with a smooth fade interface transition.
   */
  function toggleLanguage() {
    // Add transition class once
    if (!els.main.classList.contains('content-transition')) {
      els.main.classList.add('content-transition');
    }

    // Fade Out
    els.main.classList.add('fading-out');

    // Wait for fade out, swap lang, then fade in
    setTimeout(() => {
      setLanguage(currentLang === 'en' ? 'ar' : 'en');
      
      // Use requestAnimationFrame to ensure DOM reflow happens before removing class
      requestAnimationFrame(() => {
        els.main.classList.remove('fading-out');
      });
    }, 300);
  }

  /**
   * Transitions from Home View to Department View.
   * @param {string} deptId 
   */
  function showDept(deptId) {
    activeDept = deptId;

    // Show back button with animation reflow
    if (els.backBtn) {
      els.backBtn.classList.remove("hidden");
      void els.backBtn.offsetWidth; 
    }

    // Animate Home Out
    els.homeView.style.opacity = "0";
    els.homeView.style.transform = "scale(0.9)";

    setTimeout(() => {
      els.homeView.classList.add("hidden");
      renderDept(deptId);

      // Show Dept View
      els.deptView.classList.remove("hidden");
      void els.deptView.offsetWidth; // Force reflow
      els.deptView.classList.add("active");
    }, 400);
  }

  /**
   * Transitions from Department View back to Home View.
   */
  function showHome() {
    activeDept = null;

    if (els.backBtn) els.backBtn.classList.add("hidden");

    // Animate Dept Out
    els.deptView.classList.remove("active");

    setTimeout(() => {
      els.deptView.classList.add("hidden");

      // Show Home
      els.homeView.classList.remove("hidden");
      void els.homeView.offsetWidth; // Force reflow
      els.homeView.style.opacity = "1";
      els.homeView.style.transform = "scale(1)";
    }, 400);
  }

  /**
   * Renders specific department content into the view.
   * @param {string} id - Department ID
   */
  function renderDept(id) {
    if (!i18n[currentLang]) return;

    const data = i18n[currentLang];
    const color = DEPT_COLORS[id];
    
    // Set dynamic accent color variable
    if (els.deptContent) {
      els.deptContent.style.setProperty("--dept-accent", color);
    }

    // Resolve Title Key
    const titleKey = `${id}_title`; // e.g., relations_title
    const introKey = `${id}_intro`;

    // Construct HTML
    let html = `
      <div class="dept-header">
        <h1 style="color: ${color}">${data[titleKey] || ""}</h1>
        <p>${data[introKey] || ""}</p>
      </div>
      <div class="cards-grid">
    `;

    // Render Sections
    const sections = DEPT_SECTIONS[id];
    if (sections) {
      sections.forEach((sectionKey) => {
        const title = data[`${sectionKey}_title`];
        const content = data[`${sectionKey}_content`];
        
        // Extract card type from key (e.g. 'rel_foundation' -> 'foundation')
        const type = sectionKey.split('_')[1] || 'generic'; 
        
        if (title || content) {
          html += `
            <div class="info-card card-${type}" data-type="${type}">
              ${title ? `<h3>${title}</h3>` : ""}
              <div class="card-content">
                ${content || ""}
              </div>
            </div>
          `;
        }
      });
    }

    html += `</div>`;
    
    if (els.deptContent) {
      els.deptContent.innerHTML = html;
    }
  }

  // --- Initialization ---

  // Event Listeners
  if (els.langBtn) els.langBtn.addEventListener("click", toggleLanguage);
  if (els.backBtn) els.backBtn.addEventListener("click", showHome);

  els.menuCards.forEach((card) => {
    card.addEventListener("click", () => {
      const dept = card.getAttribute("data-dept");
      if (dept) showDept(dept);
    });
  });

  // Initial Load
  setLanguage(currentLang);
  console.log("GDG Script Initialized");
});
