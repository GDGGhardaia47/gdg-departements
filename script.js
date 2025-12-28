
// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {

    // Access globals
    const i18n = window.GDG_TRANSLATIONS || { en: {}, ar: {} };
    let currentLang = localStorage.getItem('gdg-lang') || 'en';

    // DOM Elements
    const els = {
        title: document.querySelectorAll('[data-k="title"]'),
        welcomeTitle: document.querySelector('[data-k="welcome_title"]'),
        langBtn: document.getElementById('langBtn'),
        homeView: document.getElementById('home-view'),
        deptView: document.getElementById('dept-view'),
        deptContent: document.getElementById('dept-content'),
        backBtn: document.getElementById('backBtn'),
        menuCards: document.querySelectorAll('.menu-card')
    };

    // Navigation State
    let activeDept = null;

    // --- Core Functions ---

    function setLanguage(lang) {
        if (!i18n[lang]) {
            console.error('Language not found:', lang);
            return;
        }

        currentLang = lang;
        localStorage.setItem('gdg-lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update Button
        if (els.langBtn) els.langBtn.innerHTML = lang === 'en' ? 'EN <span class="material-symbols-outlined">language</span>' : 'AR <span class="material-symbols-outlined">language</span>';

        // Update Static Text
        document.querySelectorAll('[data-k]').forEach(el => {
            const key = el.getAttribute('data-k');
            if (i18n[lang][key]) {
                el.innerHTML = i18n[lang][key]; // innerHTML to allow tags like <br>
            }
        });

        // Re-render dept if active
        if (activeDept) {
            renderDept(activeDept);
        }
    }

    function toggleLanguage() {
        setLanguage(currentLang === 'en' ? 'ar' : 'en');
    }

    function showDept(deptId) {
        activeDept = deptId;

        // Show back button
        if (els.backBtn) els.backBtn.classList.remove('hidden');

        // Animate Home Out
        els.homeView.style.opacity = '0';
        els.homeView.style.transform = 'scale(0.9)';

        setTimeout(() => {
            els.homeView.classList.add('hidden');
            renderDept(deptId);

            // Show Dept View
            els.deptView.classList.remove('hidden');
            // Force reflow
            void els.deptView.offsetWidth;
            els.deptView.classList.add('active');
        }, 400); // Wait for transition
    }

    function showHome() {
        activeDept = null;

        // Hide back button
        if (els.backBtn) els.backBtn.classList.add('hidden');

        // Animate Dept Out
        els.deptView.classList.remove('active');

        setTimeout(() => {
            els.deptView.classList.add('hidden');

            // Show Home
            els.homeView.classList.remove('hidden');
            void els.homeView.offsetWidth;
            els.homeView.style.opacity = '1';
            els.homeView.style.transform = 'scale(1)';
        }, 400);
    }

    function renderDept(id) {
        if (!i18n[currentLang]) return;

        const data = i18n[currentLang];
        let html = '';

        const colors = {
            relations: 'var(--google-blue)',
            design: 'var(--google-red)',
            dev: 'var(--google-yellow)',
            media: 'var(--google-green)'
        };

        const titleKey = {
            relations: 'relations_title',
            design: 'design_title',
            dev: 'dev_title',
            media: 'media_title'
        }[id];

        // Header
        html += `
            <div class="dept-header">
            <h2 style="color: ${colors[id]}">${data[titleKey] || ''}</h2>
            </div>
            <div class="cards-grid">
        `;

        // Sections
        const sections = {
            relations: ['rel_s1', 'rel_s2', 'rel_s3'],
            design: ['des_s1', 'des_s2', 'des_s3'],
            dev: ['dev_s1', 'dev_s2', 'dev_s3', 'dev_s4'],
            media: ['med_s1', 'med_s2', 'med_s3', 'med_s4']
        };

        if (sections[id]) {
            sections[id].forEach(code => {
                html += `
                    <div class="info-card">
                        <h3>${data[code + '_t'] || ''}</h3>
                        <ul class="meta">
                            <li><b>${data['label_tools'] || ''}</b> ${data[code + '_tools'] || ''}</li>
                            <li><b>${data['label_install'] || ''}</b> ${data[code + '_install'] || ''}</li>
                            <li><b>${data['label_content'] || ''}</b> ${data[code + '_content'] || ''}</li>
                        </ul>
                        <div class="goal">${data[code + '_goal'] || ''}</div>
                    </div>
                `;
            });
        }

        html += `</div>`;

        if (els.deptContent) {
            els.deptContent.innerHTML = html;
        }
    }

    // --- Init ---

    // Listeners
    if (els.langBtn) els.langBtn.addEventListener('click', toggleLanguage);
    if (els.backBtn) els.backBtn.addEventListener('click', showHome);

    els.menuCards.forEach(card => {
        card.addEventListener('click', () => {
            const dept = card.getAttribute('data-dept');
            showDept(dept);
        });
    });

    // Start
    setLanguage(currentLang);
    console.log("GDG Script Initialized");
});
