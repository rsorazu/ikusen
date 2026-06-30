// Bideo Proiektua — app.js (CMS-driven)

const UNITS = ['intro', 'hizkuntza', 'proiektua', 'entrega'];
const CONTENT_FILES = ['hizkuntza', 'proiektua', 'entrega'];

const DATA = {};

async function loadAllContent() {
  const promises = ['site', ...CONTENT_FILES].map(f =>
    fetch(`content/${f}.json`)
      .then(r => r.json())
      .then(d => { DATA[f] = d; })
      .catch(() => { DATA[f] = null; })
  );
  await Promise.all(promises);
}

// ── Helpers ──────────────────────────────────────────────────────

function photoArea(photo, ratio) {
  if (!photo) return '<div class="movie-photo-area"><div class="movie-photo-ph"><div class="movie-photo-ph-icon">🎬</div></div></div>';
  if (photo.image && photo.image.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
    return `<div class="movie-photo-area"><img src="${photo.image}" alt="${photo.description||''}" class="movie-photo-real"></div>`;
  }
  return `<div class="movie-photo-area"><div class="movie-photo-ph"><div class="movie-photo-ph-icon">🎬</div><p>${photo.description||''}</p></div></div>`;
}

function summaryCard(summary, nextUnitId) {
  if (!summary) return '';
  const points = (summary.points||[]).map(p => `<li>${p}</li>`).join('');
  return `<div class="summary-card">
    <h2>🎬 ${summary.heading}</h2>
    <p class="summary-intro">${summary.intro}</p>
    <ul class="summary-points">${points}</ul>
  </div>`;
}

// ── Render site / intro ──────────────────────────────────────────

function renderSite() {
  const s = DATA.site;
  if (!s) return;
  document.title = `${s.title} — ${s.subtitle}`;

  const es = document.getElementById('heroSub');
  if (es && s.hero_subtitle) es.textContent = s.hero_subtitle;

  // Filmstrip decorative element
  const fs = document.getElementById('filmstrip');
  if (fs) {
    let frames = '';
    for (let i = 0; i < 24; i++) frames += '<div class="filmstrip-frame"></div>';
    fs.innerHTML = frames;
  }

  // Requirements grid
  const reqGrid = document.getElementById('reqGrid');
  if (reqGrid) {
    reqGrid.innerHTML = `
      <div class="req-card" style="--c:#D8432E">
        <div class="req-card-icon">🎥</div>
        <h4>Planoak</h4>
        <p>${s.min_planos || ''}</p>
      </div>
      <div class="req-card" style="--c:#D9A441">
        <div class="req-card-icon">🔊</div>
        <h4>Soinua</h4>
        <p>Musika eta efektuak istorioa kontatzen lagunduz</p>
      </div>
      <div class="req-card" style="--c:#4E8B86">
        <div class="req-card-icon">✂️</div>
        <h4>Muntaketa</h4>
        <p>${s.min_muntaketa || ''}</p>
      </div>
      <div class="req-card" style="--c:#8B6FB0">
        <div class="req-card-icon">⏱️</div>
        <h4>Iraupena</h4>
        <p>Gutxienez ${s.min_duration || '2 minutu'}</p>
      </div>
    `;
  }
}

// ── Render hizkuntza ──────────────────────────────────────────────

function renderHizkuntza() {
  const d = DATA.hizkuntza;
  const section = document.getElementById('unit-hizkuntza');
  if (!d || !section) return;
  const nextId = UNITS[UNITS.indexOf('hizkuntza')+1];

  const moviesHTML = (d.examples||[]).map(e => `
    <div class="movie-card">
      ${photoArea(e.photo)}
      <div class="movie-body">
        <div class="movie-name">${e.movie}</div>
        <div class="movie-title">${e.title}</div>
        <ul class="movie-points">${(e.points||[]).map(p=>`<li>${p}</li>`).join('')}</ul>
        <div class="movie-conclusion">${e.conclusion}</div>
      </div>
    </div>`).join('');

  const planoHTML = (d.plano_motak||[]).map(p => `
    <div class="plano-card">
      <div class="plano-frame"><span class="plano-frame-icon">🎞️</span></div>
      <div class="plano-body">
        <div class="plano-name">${p.name}</div>
        <div class="plano-desc">${p.desc}</div>
        <div class="plano-use">${p.use}</div>
      </div>
    </div>`).join('');

  const muntaketaHTML = (d.muntaketa_motak||[]).map(m => `
    <div class="muntaketa-type">
      <div class="muntaketa-type-name">${m.name}</div>
      <div class="muntaketa-type-desc">${m.desc}</div>
    </div>`).join('');

  section.innerHTML = `
    <div class="unit-header" style="--accent:#D9A441">
      <span class="unit-eyebrow">${d.eyebrow}</span>
      <h1>${d.title}</h1>
      <p class="unit-desc">${d.description}</p>
    </div>
    <div class="tabs" id="tabs-hizkuntza">
      <button class="tab active" data-tab="adibideak">Adibideak</button>
      <button class="tab" data-tab="planoak">Plano motak</button>
      <button class="tab" data-tab="soinua">Soinua</button>
      <button class="tab" data-tab="muntaketa">Muntaketa</button>
    </div>
    <div class="tab-content active" data-content="adibideak">
      <h2>${d.intro_heading}</h2>
      <p>${d.intro_text}</p>
      <div class="element-chips">${(d.elements||[]).map(e=>`<span class="element-chip">${e}</span>`).join('')}</div>
      <h3>Adibideak zinemagintzatik</h3>
      ${moviesHTML}
    </div>
    <div class="tab-content" data-content="planoak">
      <h2>Plano motak</h2>
      <p>Plano bakoitzak zerbait desberdina transmititzen du:</p>
      <div class="plano-grid">${planoHTML}</div>
    </div>
    <div class="tab-content" data-content="soinua">
      <h2>${d.soinua_heading}</h2>
      <p>${d.soinua_intro}</p>
      <h3>Zertarako erabiltzen da?</h3>
      <ul class="icon-list">${(d.soinua_zertarako||[]).map(s=>`<li>${s}</li>`).join('')}</ul>
      <div class="info-box" style="--box-color:#D9A441">
        <div class="info-box-icon">💡</div>
        <div><strong>Zuen proiekturako gomendioak</strong>
          <p>${(d.soinua_gomendioak||[]).join(' · ')}</p>
        </div>
      </div>
    </div>
    <div class="tab-content" data-content="muntaketa">
      <h2>${d.muntaketa_heading}</h2>
      <p>${d.muntaketa_intro}</p>
      <h3>Zer da?</h3>
      <ul class="icon-list">${(d.muntaketa_zer_da||[]).map(s=>`<li>${s}</li>`).join('')}</ul>
      <h3>Motak</h3>
      <div class="muntaketa-types">${muntaketaHTML}</div>
    </div>
  `;

  wireTabs(section);
}

// ── Render proiektua ──────────────────────────────────────────────

function renderProiektua() {
  const d = DATA.proiektua;
  const section = document.getElementById('unit-proiektua');
  if (!d || !section) return;

  const r = d.requirements || {};
  const reqHTML = `
    <div class="req-grid">
      <div class="req-card" style="--c:#D8432E"><div class="req-card-icon">🎥</div><h4>${r.planos?.title||''}</h4>
        <ul class="icon-list" style="margin:0">${(r.planos?.items||[]).map(i=>`<li>${i}</li>`).join('')}</ul>
      </div>
      <div class="req-card" style="--c:#D9A441"><div class="req-card-icon">🔊</div><h4>${r.soinua?.title||''}</h4>
        <ul class="icon-list" style="margin:0">${(r.soinua?.items||[]).map(i=>`<li>${i}</li>`).join('')}</ul>
      </div>
      <div class="req-card" style="--c:#4E8B86"><div class="req-card-icon">✂️</div><h4>${r.muntaketa?.title||''}</h4>
        <ul class="icon-list" style="margin:0">${(r.muntaketa?.items||[]).map(i=>`<li>${i}</li>`).join('')}</ul>
      </div>
      <div class="req-card" style="--c:#8B6FB0"><div class="req-card-icon">⏱️</div><h4>${r.iraupena?.title||''}</h4>
        <p style="font-size:1.1rem;font-family:var(--font-display);color:var(--text)">${r.iraupena?.value||''}</p>
      </div>
    </div>`;

  const phasesHTML = (d.phases||[]).map(p => {
    let challengesHTML = '';
    if (p.challenges) {
      challengesHTML = `<div class="reto-grid">${p.challenges.map(c=>`
        <div class="reto-item"><span class="reto-star">${c.stars}</span><strong>${c.title}:</strong> ${c.text}</div>`).join('')}</div>`;
    }
    const checkHTML = p.checkpoint ? `<div class="checkpoint"><strong>Kontrol-puntua</strong><ul>${p.checkpoint.map(c=>`<li>${c}</li>`).join('')}</ul></div>` : '';
    return `
      <div class="fase">
        <div class="fase-num">${p.num}</div>
        <div class="fase-body">
          <h3>${p.title} <span class="fase-session">${p.session||''}</span></h3>
          ${p.content ? `<p>${p.content}</p>` : ''}
          ${challengesHTML}${checkHTML}
        </div>
      </div>`;
  }).join('');

  const toolsHTML = (d.tools||[]).map(t => `
    <div class="tool-card">
      <div class="tool-icon">${t.icon}</div>
      <h4>${t.name}</h4>
      <p>${t.desc}</p>
    </div>`).join('');

  section.innerHTML = `
    <div class="unit-header" style="--accent:#4E8B86">
      <span class="unit-eyebrow">${d.eyebrow}</span>
      <h1>${d.title}</h1>
      <p class="unit-desc">${d.description}</p>
    </div>
    <div class="tabs" id="tabs-proiektua">
      <button class="tab active" data-tab="erronka">Erronka</button>
      <button class="tab" data-tab="faseak">Faseak</button>
      <button class="tab" data-tab="tresnak">Tresnak</button>
    </div>
    <div class="tab-content active" data-content="erronka">
      <h2>${d.context_heading}</h2>
      ${(d.context_paragraphs||[]).map(p=>`<p>${p}</p>`).join('')}
      <h3>${d.requirements?.heading||'Beharrezkoa'}</h3>
      ${reqHTML}
    </div>
    <div class="tab-content" data-content="faseak">
      <h2>Proiektuaren faseak</h2>
      <div class="fase-list">${phasesHTML}</div>
    </div>
    <div class="tab-content" data-content="tresnak">
      <h2>${d.tools_heading}</h2>
      <div class="tools-grid">${toolsHTML}</div>
    </div>
  `;

  wireTabs(section);
}

// ── Render entrega ────────────────────────────────────────────────

function renderEntrega() {
  const d = DATA.entrega;
  const section = document.getElementById('unit-entrega');
  if (!d || !section) return;

  const itemsHTML = (d.items||[]).map(i => `
    <div class="entrega-item">
      <div class="entrega-item-header">
        <div class="entrega-num">${i.num}</div>
        <h3>${i.title}</h3>
        <span class="entrega-format">${i.format}</span>
      </div>
      <ul class="icon-list" style="margin:0">${(i.content||[]).map(c=>`<li>${c}</li>`).join('')}</ul>
    </div>`).join('');

  section.innerHTML = `
    <div class="unit-header" style="--accent:#8B6FB0">
      <span class="unit-eyebrow">${d.eyebrow}</span>
      <h1>${d.title}</h1>
      <p class="unit-desc">${d.description}</p>
    </div>
    <div class="content-grid">
      <div class="section-block">
        ${itemsHTML}
        <div class="info-box" style="--box-color:#8B6FB0">
          <div class="info-box-icon">📌</div>
          <div><strong>Formatua eta aholkuak</strong>
            <p>${(d.format_tips||[]).join(' · ')}</p>
          </div>
        </div>
        <div class="entrega-deadline">⏰ ${d.deadline}</div>
      </div>
    </div>
  `;
}

// ── Tabs ─────────────────────────────────────────────────────────

function wireTabs(section) {
  const tabGroup = section.querySelector('.tabs');
  if (!tabGroup) return;
  tabGroup.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      section.querySelectorAll('.tab-content').forEach(c =>
        c.classList.toggle('active', c.dataset.content === tab.dataset.tab)
      );
    });
  });
}

// ── Navigation ───────────────────────────────────────────────────

const navItems = document.querySelectorAll('.nav-item[data-unit]');
const units = document.querySelectorAll('.unit');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');
const sidebarClose = document.getElementById('sidebarClose');
const topbarTitle = document.getElementById('topbarTitle');

function goToUnit(unitId) {
  units.forEach(u => u.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  const unit = document.getElementById('unit-' + unitId);
  const nav = document.querySelector(`.nav-item[data-unit="${unitId}"]`);
  if (unit) unit.classList.add('active');
  if (nav) nav.classList.add('active');
  const title = nav?.querySelector('.nav-title')?.textContent || 'Bideo Proiektua';
  topbarTitle.textContent = title;
  if (window.innerWidth < 768) closeSidebar();
  window.scrollTo(0, 0);
}

navItems.forEach(item => item.addEventListener('click', () => goToUnit(item.dataset.unit)));

function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('show'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
menuBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// ── Bootstrap ────────────────────────────────────────────────────

async function init() {
  await loadAllContent();

  renderSite();
  renderHizkuntza();
  renderProiektua();
  renderEntrega();

  const ls = document.getElementById('loadingScreen');
  if (ls) { ls.classList.add('hidden'); setTimeout(() => ls.remove(), 500); }
}

init();
