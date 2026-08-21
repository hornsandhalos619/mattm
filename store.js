/* ========================================
   OAKWOOD RESIDENCES — SHARED DATA STORE
   localStorage-backed persistence shared by the public site
   (index.html / script.js) and the admin portal (admin.html / admin.js).
   ======================================== */

const OAKWOOD_STORE = {
  plansKey: 'oakwood_floor_plans_v1',
  settingsKey: 'oakwood_site_settings_v1',

  defaultFloorPlans: [
    { id: 'studio', name: 'The Studio', price: '$1,895', perMonth: '/mo', beds: 'Studio', baths: '1 Bath', sqft: '650 sqft',
      gradient: 'linear-gradient(135deg,#f4a261 0%,#e9c46a 100%)',
      features: { 'Max Height': "9' 6\"", 'Window': 'Floor-to-ceiling', 'Balcony': 'None', 'Laundry': 'Building', 'Parking': '1 Space' },
      desc: 'Effortless city living. A smart Studio layout with premium finishes throughout, a full kitchen, and an en-suite spa bath.' },
    { id: '1bed', name: 'The One Bedroom', price: '$2,450', perMonth: '/mo', beds: '1 Bed', baths: '1 Bath', sqft: '780 sqft',
      gradient: 'linear-gradient(135deg,#2a9d8f 0%,#264653 100%)',
      features: { 'Max Height': "9' 6\"", 'Window': 'Floor-to-ceiling', 'Balcony': 'Private', 'Laundry': 'In-unit', 'Parking': '1 Space' },
      desc: "The ideal urban retreat. A spacious one-bedroom with a separate chef's kitchen, walk-in closet, and private balcony." },
    { id: '2bed', name: 'The Two Bedroom', price: '$3,350', perMonth: '/mo', beds: '2 Beds', baths: '2 Baths', sqft: '1,100 sqft',
      gradient: 'linear-gradient(135deg,#e76f51 0%,#f4a261 100%)',
      features: { 'Max Height': "10' 6\"", 'Window': 'Floor-to-ceiling', 'Balcony': 'Corner Wrap', 'Laundry': 'In-unit', 'Parking': '2 Spaces' },
      desc: 'Room to breathe. Two full bedrooms, an open-plan living area, corner wrap balcony with sunset views.' },
    { id: '3bed', name: 'The Three Bedroom', price: '$4,500', perMonth: '/mo', beds: '3 Beds', baths: '2 Baths', sqft: '1,450 sqft',
      gradient: 'linear-gradient(135deg,#264653 0%,#2a9d8f 100%)',
      features: { 'Max Height': "10' 6\"", 'Window': 'Floor-to-ceiling', 'Balcony': 'Terrace', 'Laundry': 'In-unit', 'Parking': '2 Spaces' },
      desc: 'The ultimate family layout. Three bedrooms, a great room with dining, and a full terrace overlooking the bay.' },
    { id: 'penthouse', name: 'The Penthouse', price: '$5,200', perMonth: '/mo', beds: '3 Beds', baths: '2.5 Baths', sqft: '1,800 sqft',
      gradient: 'linear-gradient(135deg,#e76f51 0%,#264653 50%,#f4a261 100%)',
      features: { 'Max Height': "12' 6\"", 'Window': 'Panoramic', 'Balcony': 'Rooftop Deck', 'Laundry': 'In-unit Miele', 'Parking': '3 Spaces' },
      desc: 'At the top. A full-floor penthouse with 360-degree panoramic views, private rooftop deck, and Italian marble baths.' },
    { id: 'garden', name: 'The Garden Suite', price: '$3,800', perMonth: '/mo', beds: '2 Beds (Flex)', baths: '1 Bath', sqft: '950 sqft',
      gradient: 'linear-gradient(135deg,#d4a373 0%,#e9c46a 100%)',
      features: { 'Max Height': "9' 6\"", 'Window': 'Garden-facing', 'Balcony': 'Patios Access', 'Laundry': 'In-unit', 'Parking': '1 Space' },
      desc: 'Ground-floor living at its finest. A flexible second bedroom, direct patio access to the landscaped garden courtyard.' }
  ],

  defaultSettings: {
    siteTitle: 'Oakwood Residences San Diego - Find a great place to live!',
    heroBadge: '\u2605 Now Leasing \u2014 Summer 2026',
    heroHeading: 'Live Exceptionally in the',
    heroHighlight: 'Heart of San Diego',
    heroSubheading: 'Fine rentals city-wide \u2014 homes and apartments for rent. Oakwood Residences redefines premium rental living with stunning city views, resort-style amenities, and a walkable address that puts everything within reach.',
    announcementEnabled: false,
    announcementText: '',
    contactAddress: '1250 Pacific Highway, San Diego, CA 92101',
    contactPhone: '(619) 555-0188',
    contactEmail: 'leasing@oakwoodresidences-sd.com',
    contactHours: 'Mon\u2013Sat: 9am \u2013 6pm \u2022 Sun: 10am \u2013 4pm',
    footerTagline: 'Luxury apartment living in the heart of San Diego.'
  },

  getFloorPlans: function () {
    try {
      const raw = localStorage.getItem(this.plansKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* fall through to defaults */ }
    return JSON.parse(JSON.stringify(this.defaultFloorPlans));
  },

  saveFloorPlans: function (plans) {
    localStorage.setItem(this.plansKey, JSON.stringify(plans));
  },

  getSettings: function () {
    const base = JSON.parse(JSON.stringify(this.defaultSettings));
    try {
      const raw = localStorage.getItem(this.settingsKey);
      if (raw) return Object.assign(base, JSON.parse(raw));
    } catch (e) { /* fall through to defaults */ }
    return base;
  },

  saveSettings: function (settings) {
    localStorage.setItem(this.settingsKey, JSON.stringify(settings));
  },

  resetAll: function () {
    localStorage.removeItem(this.plansKey);
    localStorage.removeItem(this.settingsKey);
  }
};
