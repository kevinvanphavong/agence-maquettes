// Shared header & footer injection — Family Games Center
// Drop placeholders <div data-fgc-header></div> and <div data-fgc-footer></div>
// in any page; this script fills them. Set <body data-page="…"> to highlight nav.

(function () {
  const page = document.body.dataset.page || '';

  const NAV = [
    {
      key: 'activites',
      label: 'Activités',
      children: [
        { key: 'bowling', label: '🎳 Bowling', href: 'bowling.html' },
        { key: 'billard', label: '🎱 Billard', href: 'billard.html' },
        { key: 'arcade', label: '🕹️ Jeux d\'arcade', href: 'arcade.html' },
        { key: 'vr', label: '🥽 Réalité Virtuelle', href: 'realite-virtuelle.html' },
        { key: 'karaoke', label: '🎤 Karaoké', href: 'karaoke.html' },
        { key: 'blindtest', label: '🎵 Blind Test', href: 'blind-test.html' },
        { key: 'flechettes', label: '🎯 Fléchettes', href: 'flechettes.html' },
      ],
    },
    { key: 'tarifs', label: 'Tarifs', href: 'tarifs.html' },
    { key: 'formules', label: 'Nos Formules', href: 'formules.html' },
    { key: 'bar', label: 'Bar & Snack', href: 'bar-snack.html' },
    { key: 'entreprises', label: 'Entreprises', href: 'entreprises.html' },
    { key: 'contact', label: 'Contact', href: 'contact.html' },
  ];

  const ACTIVITY_KEYS = ['bowling', 'billard', 'arcade', 'vr', 'karaoke', 'blindtest', 'flechettes'];

  function navHtml() {
    return NAV.map((item) => {
      if (item.children) {
        const isActive = item.children.some((c) => c.key === page) || ACTIVITY_KEYS.includes(page);
        const sub = item.children
          .map((c) => `<a href="${c.href}" class="${c.key === page ? 'active' : ''}">${c.label}</a>`)
          .join('');
        return `<div class="dropdown"><a href="#" class="${isActive ? 'active' : ''}">${item.label}</a><div class="dropdown-menu">${sub}</div></div>`;
      }
      return `<a href="${item.href}" class="${item.key === page ? 'active' : ''}">${item.label}</a>`;
    }).join('');
  }

  const HEADER = `
    <header class="site-header">
      <div class="wrap">
        <a href="index.html" class="brand">
          <span class="logo-mark">🎳</span>
          <span class="logo-text">
            <span class="top">Family</span>
            <span class="mid">GAMES</span>
            <span class="bot">CENTER</span>
          </span>
        </a>
        <button class="nav-toggle" aria-label="Menu" onclick="document.querySelector('.main-nav').classList.toggle('open')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <nav class="main-nav">${navHtml()}</nav>
        <a href="https://www.bowling-de-blois.fr/" target="_blank" rel="noopener" class="btn btn-primary btn-reserve">Réserver</a>
      </div>
    </header>
  `;

  const FOOTER = `
    <div class="info-strip">
      <div class="wrap">
        <div class="info-item"><span class="ic">📅</span><span>Ouvert 7J/7</span></div>
        <div class="info-item"><span class="ic">🥤</span><span>Snack & Bar</span></div>
        <div class="info-item"><span class="ic">☺</span><span>Ambiance & Fun garantis</span></div>
        <div class="info-item pink"><span class="ic">🎉</span><span>Anniversaires · EVG/EVJF · Événements</span></div>
      </div>
    </div>

    <footer class="footer">
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="brand" style="margin-bottom:18px;display:inline-flex">
              <span class="logo-mark">🎳</span>
              <span class="logo-text">
                <span class="top">Family</span>
                <span class="mid">GAMES</span>
                <span class="bot">CENTER</span>
              </span>
            </a>
            <p style="opacity:0.75;max-width:340px;margin-top:14px;font-size:0.92rem">
              Le plus grand espace de loisirs à Blois. Bowling, billard, arcade, VR, karaoké, bar &amp; snack — pour tous les âges, tous les moments.
            </p>
            <div class="socials" style="margin-top:18px">
              <a href="https://www.facebook.com/BowlingWorldBlois/" target="_blank" rel="noopener" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.49 17.52 2 11.93 2 6.34 2 1.87 6.49 1.87 12.07c0 5.02 3.66 9.18 8.45 9.93v-7.02H7.78v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33v7.02c4.79-.75 8.45-4.91 8.45-9.93Z"/></svg>
              </a>
              <a href="https://www.instagram.com/bowling.blois/" target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4>Activités</h4>
            <ul class="footer-links">
              <li><a href="bowling.html">🎳 Bowling</a></li>
              <li><a href="billard.html">🎱 Billard</a></li>
              <li><a href="arcade.html">🕹️ Jeux d'arcade</a></li>
              <li><a href="realite-virtuelle.html">🥽 Réalité Virtuelle</a></li>
              <li><a href="karaoke.html">🎤 Karaoké</a></li>
              <li><a href="blind-test.html">🎵 Blind Test</a></li>
              <li><a href="flechettes.html">🎯 Fléchettes</a></li>
            </ul>
          </div>
          <div>
            <h4>Le centre</h4>
            <ul class="footer-links">
              <li><a href="tarifs.html">Tarifs</a></li>
              <li><a href="formules.html">Nos Formules</a></li>
              <li><a href="bar-snack.html">Bar & Snack</a></li>
              <li><a href="entreprises.html">Entreprises</a></li>
              <li><a href="contact.html">Contact & Infos</a></li>
              <li><a href="mentions-legales.html">Mentions légales</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <div class="footer-contact">
              <div class="line"><span class="ic">📍</span><span>25 rue Robert Nau<br>41000 Blois</span></div>
              <div class="line"><span class="ic">📞</span><span><a href="tel:0254748521">02 54 74 85 21</a></span></div>
              <div class="line"><span class="ic">✉️</span><span><a href="mailto:contact@familygamescenter.fr">contact@familygamescenter.fr</a></span></div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Family Games Center — Bowling de Blois</span>
          <span>Site repensé · UI/UX 2026</span>
        </div>
      </div>
    </footer>
  `;

  const headerSlot = document.querySelector('[data-fgc-header]');
  const footerSlot = document.querySelector('[data-fgc-footer]');
  if (headerSlot) headerSlot.outerHTML = HEADER;
  if (footerSlot) footerSlot.outerHTML = FOOTER;
})();
