/* ═══════════════════════ LANGUAGE DROPDOWN ═══════════════════════ */
function toggleDropdown() {
    const btn = document.getElementById('langBtn');
    const menu = document.getElementById('langDropdown');
    if (btn && menu) { btn.classList.toggle('open'); menu.classList.toggle('open'); }
}
function closeDropdown() {
    const btn = document.getElementById('langBtn');
    const menu = document.getElementById('langDropdown');
    if (btn && menu) { btn.classList.remove('open'); menu.classList.remove('open'); }
}
document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-wrapper')) closeDropdown();
});

/* ═══════════════════════ SMOOTH SCROLL TO SECTION ═══════════════════════ */
function scrollToCard(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═══════════════════════ ICON PROTECTION ═══════════════════════
   Marks every Font Awesome icon as translate="no" + .notranslate so
   browser/Google Translate never wraps or reflows the glyph nodes —
   this is what breaks icons when a page gets machine-translated or
   toggled to Arabic. Runs on load and self-heals via MutationObserver
   for any icon injected later (e.g. dynamic TOC active states). */
function protectIcons(root) {
    (root || document).querySelectorAll('i[class*="fa-"]').forEach(el => {
        el.setAttribute('translate', 'no');
        el.classList.add('notranslate');
    });
}
protectIcons();
if ('MutationObserver' in window) {
    const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches && node.matches('i[class*="fa-"]')) {
                    node.setAttribute('translate', 'no');
                    node.classList.add('notranslate');
                } else if (node.querySelectorAll) {
                    protectIcons(node);
                }
            });
        }
    });
    mo.observe(document.body, { childList: true, subtree: true });
}

/* ═══════════════════════ SCROLL REVEAL ═══════════════════════ */
(function initReveal() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
        targets.forEach(t => t.classList.add('in-view'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
})();

/* ═══════════════════════ ACTIVE TOC PILL ON SCROLL ═══════════════════════ */
(function initTocActive() {
    const pills = document.querySelectorAll('.toc-pill');
    const cards = document.querySelectorAll('.legal-card');
    if (!pills.length || !cards.length || !('IntersectionObserver' in window)) return;
    const byId = {};
    pills.forEach(p => { byId[p.dataset.target] = p; });
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const pill = byId[entry.target.id];
            if (!pill) return;
            if (entry.isIntersecting) {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    cards.forEach(c => io.observe(c));
})();
