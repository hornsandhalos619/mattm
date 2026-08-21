/* ========================================
   OAKWOOD RESIDENCES — ADMIN PORTAL
   Demo credentials (client-side): admin / password
   ======================================== */

const ADMIN_CREDENTIALS = { user: 'admin', pass: 'password' };
const AUTH_KEY = 'oakwood_admin_authed';

const THEME_PRESETS = [
  { label: 'Gold', value: 'linear-gradient(135deg,#f4a261 0%,#e9c46a 100%)' },
  { label: 'Deep Teal', value: 'linear-gradient(135deg,#2a9d8f 0%,#264653 100%)' },
  { label: 'Terracotta', value: 'linear-gradient(135deg,#e76f51 0%,#f4a261 100%)' },
  { label: 'Ocean', value: 'linear-gradient(135deg,#264653 0%,#2a9d8f 100%)' },
  { label: 'Sunset Trio', value: 'linear-gradient(135deg,#e76f51 0%,#264653 50%,#f4a261 100%)' },
  { label: 'Sand', value: 'linear-gradient(135deg,#d4a373 0%,#e9c46a 100%)' }
];

let plans = [];
let editingId = null;

/* ---------- Helpers ---------- */
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str == null ? '' : String(str);
  return d.innerHTML;
}
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}
function val(id) { return document.getElementById(id).value.trim(); }
function setVal(id, v) { document.getElementById(id).value = v == null ? '' : v; }

/* ---------- Auth ---------- */
function isAuthed() { return sessionStorage.getItem(AUTH_KEY) === '1'; }

function doLogin() {
  const u = val('loginUser');
  const p = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  if (u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass) {
    sessionStorage.setItem(AUTH_KEY, '1');
    err.classList.remove('visible');
    showDashboard();
  } else {
    err.textContent = 'Invalid username or password.';
    err.classList.add('visible');
    document.getElementById('loginPass').value = '';
  }
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  location.reload();
}

/* ---------- Dashboard shell ---------- */
function showDashboard() {
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('dashView').classList.remove('hidden');
  plans = OAKWOOD_STORE.getFloorPlans();
  renderListings();
  loadSettingsForm();
}

function switchTab(tab) {
  document.querySelectorAll('.side-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('panelListings').classList.toggle('hidden', tab !== 'listings');
  document.getElementById('panelSettings').classList.toggle('hidden', tab !== 'settings');
  document.getElementById('pageTitle').textContent = tab === 'listings' ? 'Floor Plan Listings' : 'Site-Wide Settings';
}

/* ---------- Listings ---------- */
function renderListings() {
  const box = document.getElementById('listingsList');
  if (plans.length === 0) {
    box.innerHTML = '<div class="empty-note">No listings yet. Click "Add New Listing" to create one.</div>';
  } else {
    box.innerHTML = plans.map(p => `
      <div class="listing-row">
        <div class="listing-swatch" style="background:${esc(p.gradient)}"></div>
        <div class="listing-main">
          <strong>${esc(p.name)}</strong>
          <div class="listing-meta">${esc(p.beds)} &middot; ${esc(p.baths)} &middot; ${esc(p.sqft)}</div>
        </div>
        <div class="listing-price">${esc(p.price)}<span>/mo</span></div>
        <div class="listing-actions">
          <button class="btn-mini btn-edit" onclick="openEditor('${esc(p.id)}')">Edit</button>
          <button class="btn-mini btn-del" onclick="deleteListing('${esc(p.id)}')">Delete</button>
        </div>
      </div>`).join('');
  }
  document.getElementById('listingCount').textContent =
    plans.length + ' active listing' + (plans.length === 1 ? '' : 's');
}

function buildThemeSelect() {
  const sel = document.getElementById('fTheme');
  sel.innerHTML = THEME_PRESETS.map(t => `<option value="${esc(t.value)}">${t.label}</option>`).join('');
}

function openEditor(id) {
  editingId = id || null;
  document.getElementById('editorTitle').textContent = id ? 'Edit Listing' : 'Add New Listing';
  const p = id ? plans.find(x => x.id === id) : null;
  setVal('fName', p ? p.name : '');
  setVal('fPrice', p ? p.price : '$');
  setVal('fBeds', p ? p.beds : '');
  setVal('fBaths', p ? p.baths : '');
  setVal('fSqft', p ? p.sqft : '');
  setVal('fDesc', p ? p.desc : '');
  const feats = (p && p.features) ? p.features : {};
  setVal('fFeatHeight', feats['Max Height']);
  setVal('fFeatWindow', feats['Window']);
  setVal('fFeatBalcony', feats['Balcony']);
  setVal('fFeatLaundry', feats['Laundry']);
  setVal('fFeatParking', feats['Parking']);
  buildThemeSelect();
  const sel = document.getElementById('fTheme');
  if (p && p.gradient) {
    const known = THEME_PRESETS.some(t => t.value === p.gradient);
    if (!known) {
      const opt = document.createElement('option');
      opt.value = p.gradient;
      opt.textContent = 'Current (custom)';
      sel.appendChild(opt);
    }
    sel.value = p.gradient;
  }
  document.getElementById('editorModal').classList.add('open');
}

function closeEditor() {
  document.getElementById('editorModal').classList.remove('open');
  editingId = null;
}

function saveListing() {
  const name = val('fName');
  const price = val('fPrice');
  if (!name) { toast('Listing name is required.'); return; }
  if (!price) { toast('Price is required.'); return; }
  const plan = {
    id: editingId || ('plan-' + Date.now().toString(36)),
    name: name,
    price: price,
    perMonth: '/mo',
    beds: val('fBeds') || 'Studio',
    baths: val('fBaths') || '1 Bath',
    sqft: val('fSqft') || '',
    gradient: document.getElementById('fTheme').value,
    features: {
      'Max Height': val('fFeatHeight'),
      'Window': val('fFeatWindow'),
      'Balcony': val('fFeatBalcony'),
      'Laundry': val('fFeatLaundry'),
      'Parking': val('fFeatParking')
    },
    desc: val('fDesc')
  };
  if (editingId) {
    const i = plans.findIndex(p => p.id === editingId);
    if (i >= 0) plans[i] = plan;
  } else {
    plans.push(plan);
  }
  OAKWOOD_STORE.saveFloorPlans(plans);
  renderListings();
  closeEditor();
  toast('Listing saved \u2014 live on the site.');
}

function deleteListing(id) {
  const p = plans.find(x => x.id === id);
  if (!p) return;
  if (!confirm('Delete "' + p.name + '"? This cannot be undone.')) return;
  plans = plans.filter(x => x.id !== id);
  OAKWOOD_STORE.saveFloorPlans(plans);
  renderListings();
  toast('Listing deleted.');
}

/* ---------- Site Settings ---------- */
const SETTING_FIELDS = [
  'siteTitle', 'heroBadge', 'heroHeading', 'heroHighlight', 'heroSubheading',
  'announcementText', 'contactAddress', 'contactPhone', 'contactEmail',
  'contactHours', 'footerTagline'
];

function loadSettingsForm() {
  const s = OAKWOOD_STORE.getSettings();
  SETTING_FIELDS.forEach(k => setVal('set_' + k, s[k]));
  document.getElementById('set_announcementEnabled').checked = !!s.announcementEnabled;
}

function saveSettingsForm() {
  const s = {};
  SETTING_FIELDS.forEach(k => { s[k] = val('set_' + k); });
  s.announcementEnabled = document.getElementById('set_announcementEnabled').checked;
  OAKWOOD_STORE.saveSettings(s);
  toast('Settings saved \u2014 refresh the site tab to see them.');
}

function resetAllData() {
  if (!confirm('Reset ALL site data (listings + settings) back to defaults?')) return;
  OAKWOOD_STORE.resetAll();
  plans = OAKWOOD_STORE.getFloorPlans();
  renderListings();
  loadSettingsForm();
  toast('All data reset to defaults.');
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (isAuthed()) {
    showDashboard();
  } else {
    ['loginUser', 'loginPass'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') doLogin();
      });
    });
    document.getElementById('loginUser').focus();
  }
});
