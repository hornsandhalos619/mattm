/* ========================================
   OAKWOOD RESIDENCES SAN DIEGO — SCRIPTS
   Uses shared OAKWOOD_STORE from store.js for data persistence.
   ======================================== */

/* --- Data (amenities & neighborhoods are static) --- */
const AMENITIES = [
  { icon:'&#x1F3D6;&#xFE0F;', title:'Pool & Spa', desc:'Heated infinity pool with cabanas and a spa deck for quiet time.' },
  { icon:'&#x1F3CB;', title:'Fitness Center', desc:'2,400 sqft gym with Peloton studio, yoga room, and personal trainers.' },
  { icon:'&#x1F3E1;', title:'Rooftop Deck', desc:'Sky lounge with fire pits, outdoor kitchen, and panoramic city views.' },
  { icon:'&#x1F436;', title:'Pet Friendly', desc:'Dog run, pet spa, and nearby dog parks — your pets are family here.' },
  { icon:'&#x1F9FA;', title:'In-Unit Laundry', desc:'Full-size washer and dryer in every residence. Miele appliances standard.' },
  { icon:'&#x1F527;', title:'Covered Parking', desc:'Secure underground parking with EV charging and car-wash station.' },
  { icon:'&#x1F4BB;', title:'Business Center', desc:'Private offices, conference rooms, and a co-working lounge with fast WiFi.' },
  { icon:'&#x1F6E0;', title:'Concierge', desc:'24/7 on-site concierge for packages, reservations, and event planning.' },
];

const NEIGHBORHOODS = [
  { name:'Downtown', desc:'Walking distance to the waterfront, USS Midway Museum, and Gaslamp Quarter nightlife.', gradient:'linear-gradient(135deg,#264653,#2a9d8f)' },
  { name:'Little Italy', desc:"The city's foodie capital — farm-to-table restaurants, artisan markets, and daily farmers market steps away." },
  { name:'Hillcrest', desc:'Vibrant cultural hub with Balboa Park, renowned dining, cafes, and a thriving LGBTQ+ community.', gradient:'linear-gradient(135deg,#e76f51,#f4a261)' },
  { name:'North Park', desc:'Bohemian neighborhood with craft breweries, vintage shops, street art, and the historic North Park Theatre.' },
  { name:'Mission Hills', desc:'Quiet, tree-lined streets with mid-century architecture and proximity to Old Town San Diego.' },
  { name:'Bankers Hill', desc:'Serene bluffs with sweeping bay views, Coronado Bridge sightlines, and nearby Horton Plaza.' },
];

/* --- Chatbot canned replies --- */
const CHATBOT_KNOWLEDGE = [
  { keywords:['price','cost','rent','how much'], reply:'Our floor plans range from **$1,895/mo for a Studio** to **$5,200/mo for our Penthouse**. Would you like more details on any specific plan?' },
  { keywords:['available','availability','open','lease','move in'], reply:'We have units available starting as early as August 2026! Some plans include a free-rent promotion. Our leasing team can give you the latest availability calendar.' },
  { keywords:['amenity','pool','gym','fitness','rooftop','laundry','parking','concierge'], reply:'Oakwood offers: **Pool & Spa, 2,400 sqft Fitness Center, Rooftop Sky Lounge, In-Unit Laundry, Covered EV Parking, Business Center, Concierge**, and more! All in an 8,000 sqft amenity building.' },
  { keywords:['pet','dog','cat','animal'], reply:'Oakwood is **100% pet-friendly**! We\'ll have a dedicated dog run and on-site pet spa. No breed restrictions, and we offer two pet tiers with reasonable deposits.' },
  { keywords:['parking','car','ev','electric'], reply:'Every unit comes with dedicated covered parking — 1 space for studios/1-bed, 2 spaces for 2-3 bed units. We also have **EV charging stations** in the underground garage.' },
  { keywords:['location','where','address','neighborhood','downtown'], reply:'We\'re located at **1250 Pacific Highway, San Diego, CA 92101** — right between Downtown and Little Italy. Walk score is 96 (Walker\'s Paradise) and we\'re 5 minutes from the Gaslamp Quarter.' },
  { keywords:['lease','terms','length','mininum'], reply:'Lease terms range from **6 to 15 months**. Most of our residents sign a standard 12-month lease. Short-term leases may be available for move-in during off-peak months.' },
  { keywords:['tour','visit','see','schedule','walkthrough'], reply:'We\'d love to show you around! You can **schedule a tour** by using the contact form on our site or calling **(619) 555-0188**. Our gallery is open Mon-Sat 9am-6pm, Sun 10am-4pm.' },
  { keywords:['contact','email','phone','call'], reply:'You can reach us at: **Phone: (619) 555-0188** | **Email: leasing@oakwoodresidences-sd.com**. Or fill out the inquiry form below and we\'ll get back within 24 hours.' },
];

/* --- Navbar scroll effect --- */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* --- Mobile hamburger menu --- */
document.getElementById('hamburger')?.addEventListener('click', () => {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  btn.classList.toggle('active');
  menu.classList.toggle('active');
});

function closeMobile() {
  document.getElementById('hamburger').classList.remove('active');
  document.getElementById('mobileMenu').classList.remove('active');
}

/* --- Render Floor Plans from store --- */
function getFloorPlans() {
  return window.OAKWOOD_STORE ? OAKWOOD_STORE.getFloorPlans() : [];
}

function renderFloorPlans(filter = 'all') {
  const grid = document.getElementById('floorPlanGrid');
  if (!grid) return;
  const plans = getFloorPlans();
  grid.innerHTML = '';
  plans.forEach((plan, idx) => {
    const show = filter === 'all' || plan.id === filter;
    const card = document.createElement('div');
    card.className = `property-card fade-in ${show ? '' : 'hidden'}`;
    card.dataset.planId = plan.id;
    card.innerHTML = `
      <div class="prop-img" style="background:${plan.gradient};display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7);font-size:.9rem;font-weight:600;">${plan.name}</div>
      <span class="property-badge rent">${plan.beds} · ${plan.sqft}</span>
      <button class="property-fav" onclick="event.stopPropagation();this.classList.toggle('active')" aria-label="Favorite">&#x2665;</button>
      <div class="prop-info">
        <div class="prop-price">${plan.price}<span>${plan.perMonth}</span></div>
        <div class="prop-title">${plan.name}</div>
        <div class="prop-location">&#x1F4CB; Oakwood Residences, San Diego</div>
        <div class="prop-features">
          <span class="feature">&#x1F6CC; ${plan.beds}</span>
          <span class="feature">&#x1F6C1; ${plan.baths}</span>
          <span class="feature">&#x1F4D8; ${plan.sqft}</span>
        </div>
        <button class="btn btn-primary" style="width:100%;margin-top:16px;" onclick="openPlanModal('${plan.id}')">Learn More</button>
      </div>`;
    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), idx * 80);
  });
}

/* --- Render Amenities --- */
function renderAmenities() {
  const grid = document.getElementById('amenitiesGrid');
  if (!grid) return;
  AMENITIES.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = 'amenity-card fade-in';
    card.innerHTML = `<div class="amenity-icon">${a.icon}</div><h3>${a.title}</h3><p>${a.desc}</p>`;
    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), i * 60);
  });
}

/* --- Render Neighborhoods --- */
function renderNeighborhoods() {
  const layout = document.getElementById('neighborhoodsLayout');
  if (!layout) return;
  let mapHtml = `<div class="nbr-map"><div style="position:relative;z-index:1;"><p style="font-size:3rem;margin-bottom:12px;">&#x1F3D6;&#xFE0F;</p><strong>San Diego</strong><br><span style="opacity:.7;font-size:.85rem;">Oakwood Residences is centrally located</span></div></div>`;
  let infoHtml = `<div class="nbr-info"><div class="nbr-filter-pills">`;
  NEIGHBORHOODS.forEach((n, i) => {
    infoHtml += `<button class="nbr-pill ${i === 0 ? 'active' : ''}" onclick="selectNbr(${i})">${n.name}</button>`;
  });
  infoHtml += `</div><div class="nbr-desc"><p>${NEIGHBORHOODS[0].desc}</p></div></div>`;
  layout.innerHTML = mapHtml + infoHtml;
  const items = layout.querySelectorAll('.fade-in, .nbr-map, .nbr-info');
  items.forEach((el, i) => { setTimeout(() => el.classList.add('visible'), i * 80); });
}

function selectNbr(idx) {
  const n = NEIGHBORHOODS[idx];
  document.querySelectorAll('.nbr-pill').forEach((p, i) => p.classList.toggle('active', i === idx));
  const map = document.querySelector('.nbr-map');
  if (map) { const bg = n.gradient || 'linear-gradient(135deg,var(--teal),var(--teal-light))'; map.style.background = bg; }
  const descEl = document.querySelector('.nbr-desc p');
  if (descEl) descEl.textContent = n.desc;
}

/* --- Filter plans by type --- */
function filterPlans(type) {
  document.querySelectorAll('#floorPlanFilters .pill').forEach(p => p.classList.toggle('active', p.dataset.filter === type));
  renderFloorPlans(type);
}

/* --- Hero search Enter key --- */
function handleHeroSearch(e) {
  if (e.key === 'Enter') filterByNeighborhood(e.target.value.trim());
}

/* --- Hero search filter to neighborhoods --- */
function filterByNeighborhood(query) {
  if (!query) { renderFloorPlans('all'); return; }
  const lower = query.toLowerCase();
  const matchNbr = NEIGHBORHOODS.find(n => n.name.toLowerCase().includes(lower));
  if (matchNbr) { document.getElementById('neighborhoods').scrollIntoView({ behavior: 'smooth' }); selectNbr(NEIGHBORHOODS.indexOf(matchNbr)); }
}

/* --- Open Floor Plan Detail Modal --- */
function openPlanModal(planId) {
  const plans = getFloorPlans();
  const plan = plans.find(p => p.id === planId);
  if (!plan) return;
  const modal = document.getElementById('planModal');
  const heroEl = document.getElementById('modalHero');
  const bodyEl = document.getElementById('modalBody');
  heroEl.style.background = plan.gradient;
  heroEl.innerHTML = `<h3 style="position:absolute;bottom:24px;left:24px;color:#fff;font-size:1.6rem;">${plan.name}</h3>`;
  let featHtml = '';
  for (const [key, val] of Object.entries(plan.features)) {
    featHtml += `<div class="modal-feat"><span class="val">${val}</span><span class="lbl">${key}</span></div>`;
  }
  bodyEl.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <h2>${plan.name}</h2>
      <span style="font-size:1.8rem;font-weight:900;color:var(--terra);">${plan.price}<span style="font-size:.95rem;color:var(--text-light);">/${plan.perMonth}</span></span>
    </div>
    <p style="color:var(--text-light);margin-top:8px;font-size:.95rem;">${plan.desc}</p>
    <div class="modal-feature-grid">${featHtml}</div>
    <button class="btn btn-primary btn-lg" onclick="closePlanModal();openInquiryModal('${plan.name}')">Schedule a Tour</button>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePlanModal() {
  document.getElementById('planModal').classList.remove('active');
  document.body.style.overflow = '';
}

/* --- Quick Inquiry Modal (from floor plan CTA) --- */
function openInquiryModal(planName) {
  document.getElementById('inquiryPlanName').textContent = planName;
  document.getElementById('inquiryModal').classList.add('active');
}
function closeInquiryModal() {
  document.getElementById('inquiryModal').classList.remove('active');
  const qs = document.getElementById('quickFormSuccess');
  if (qs) qs.classList.add('hidden');
  document.querySelector('#inquiryModal form')?.reset();
}

/* --- Contact Inquiry Form Handler --- */
function handleInquiry(e) {
  e.preventDefault();
  const form = document.getElementById('inquiryForm');
  const success = document.getElementById('formSuccess');
  form.querySelectorAll('.btn-primary').forEach(b => b.style.display = 'none');
  success.classList.remove('hidden');
}

/* --- Quick Inquiry Form Handler --- */
function handleQuickInquiry(e) {
  e.preventDefault();
  const qs = document.getElementById('quickFormSuccess');
  qs.classList.remove('hidden');
  setTimeout(closeInquiryModal, 3000);
}

/* --- Chatbot --- */
function toggleChatbot() {
  document.getElementById('chatbotBody').classList.toggle('open');
  const body = document.getElementById('chatbotBody');
  if (body.classList.contains('open')) showSuggestions();
}

function showSuggestions() {
  const box = document.getElementById('chatbotSuggestions');
  if (!box) return;
  const topics = ['Pricing', 'Availability', 'Pet Policy', 'Neighborhoods', 'Schedule a Tour'];
  box.innerHTML = topics.map(t => `<button class="chatbot-sug" onclick="sendSuggestion('${t}')">${t}</button>`).join('');
}

function sendSuggestion(topic) {
  document.getElementById('chatbotInput').value = topic;
  sendMessage(topic);
}

function handleChatInput(e) {
  if (e.key === 'Enter') sendChat();
}

function sendChat() {
  const input = document.getElementById('chatbotInput');
  const msg = input.value.trim();
  if (!msg) return;
  sendMessage(msg);
  input.value = '';
}

function sendMessage(msg) {
  const box = document.getElementById('chatbotMessages');
  const userDiv = document.createElement('div');
  userDiv.className = 'msg user';
  userDiv.textContent = msg;
  box.appendChild(userDiv);

  const lower = msg.toLowerCase();
  let reply = null;
  for (const entry of CHATBOT_KNOWLEDGE) {
    if (entry.keywords.some(kw => lower.includes(kw))) { reply = entry.reply; break; }
  }
  if (!reply) reply = 'Thanks for your interest! For specific questions, please reach out to our leasing team at **(619) 555-0188** or use the contact form on our site.';

  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.className = 'msg bot';
    botDiv.innerHTML = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    box.appendChild(botDiv);
    box.scrollTop = box.scrollHeight;
  }, 400);

  box.scrollTop = box.scrollHeight;
}

/* --- Intersection Observer for scroll fade-in animations --- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* --- Close modals on backdrop click --- */
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) { closePlanModal(); closeInquiryModal(); }
});

/* --- Initialize site from store --- */
function applySiteSettings() {
  if (!window.OAKWOOD_STORE) return;
  const s = OAKWOOD_STORE.getSettings();

  // Page title
  if (s.siteTitle) document.title = s.siteTitle;

  // Hero badge
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge && s.heroBadge) heroBadge.innerHTML = s.heroBadge;

  // Hero heading
  const heroH1 = document.querySelector('.hero-content h1');
  if (heroH1) {
    const span = heroH1.querySelector('span');
    if (s.heroHeading) heroH1.firstChild.textContent = s.heroHeading + ' ';
    if (span && s.heroHighlight) span.textContent = s.heroHighlight;
  }

  // Hero subheading
  const heroP = document.querySelector('.hero-content > p');
  if (heroP && s.heroSubheading) heroP.textContent = s.heroSubheading;

  // Announcement banner
  const banner = document.getElementById('announcementBanner');
  if (banner && s.announcementEnabled && s.announcementText) {
    banner.textContent = s.announcementText;
    banner.classList.remove('hidden');
  } else if (banner) {
    banner.classList.add('hidden');
  }

  // Contact info
  const addr = document.querySelector('.contact-item div');
  if (addr && s.contactAddress) addr.innerHTML = '<strong>Sales Gallery</strong><br>' + s.contactAddress;

  const phoneEl = document.querySelectorAll('.contact-item')[1];
  if (phoneEl && s.contactPhone) phoneEl.querySelector('div').innerHTML = '<strong>Phone</strong><br>' + s.contactPhone;

  const emailEl = document.querySelectorAll('.contact-item')[2];
  if (emailEl && s.contactEmail) emailEl.querySelector('div').innerHTML = '<strong>Email</strong><br>' + s.contactEmail;

  const hoursEl = document.querySelectorAll('.contact-item')[3];
  if (hoursEl && s.contactHours) hoursEl.querySelector('div').innerHTML = '<strong>Office Hours</strong><br>' + s.contactHours;

  // Footer tagline
  const footerTagline = document.querySelector('.footer-col p');
  if (footerTagline && s.footerTagline) footerTagline.textContent = s.footerTagline;
}

/* --- Initialize --- */
document.addEventListener('DOMContentLoaded', () => {
  // Apply site settings first (before render so content is there)
  applySiteSettings();

  // Admin portal link in footer (only show if admin session in this browser)
  const adminLink = document.getElementById('adminPortalLink');
  if (adminLink) {
    try {
      const adminSession = JSON.parse(sessionStorage.getItem('oakwoodAdminSession'));
      if (adminSession?.role === 'admin') adminLink.classList.remove('hidden');
    } catch (_) {}
  }

  renderFloorPlans();
  renderAmenities();
  renderNeighborhoods();
  initScrollAnimations();
});

/* ===== SPLASH SCREEN FUNCTIONALITY ===== */
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splashScreen');
  if (splash) {
    const hideSplash = () => { splash.classList.add('hide'); };
    setTimeout(hideSplash, 3000);
    splash.addEventListener('click', hideSplash);
    splash.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'opacity' && splash.classList.contains('hide')) {
        splash.style.display = 'none';
      }
    });
  }
});