# Projectsixxx.com — Gothic Luxury Digital Empire
## Master Specification & Design System

---

### BRAND IDENTITY
**Brand:** Horns & Halos (HnH) — Streetwear meets Dark Divinity  
**Domain:** projectsixxx.com  
**Vibe:** *Dracula's penthouse after midnight — where luxury bleeds into the profane*  
**Archetypes:** The Seducer + The Ruler + The Outlaw  

---

### DESIGN SYSTEM: "NOCTURNE"

#### COLOR PALETTE — "VEIN & VELVET"
```css
:root {
  /* Abyssal Core */
  --void-950: #030305;        /* Near-black depth */
  --void-900: #0a0a0f;        /* True background */
  --void-800: #11111a;        /* Card surfaces */
  --void-700: #1a1a28;        /* Elevated surfaces */
  
  /* Blood & Wine Accents */
  --blood-400: #c0392b;       /* Primary accent - arterial */
  --blood-500: #8b1e1e;       /* Hover/pressed */
  --blood-600: #5c1414;       /* Deep shadow */
  --wine-300: #d4a574;        /* Aged gold/amber */
  --wine-400: #b8956a;        /* Muted luxury */
  --wine-500: #8b7355;        /* Subtle trim */
  
  /* Flesh & Pallor */
  --pallor-50:  #faf8f5;      /* Pure highlight */
  --pallor-100: #f0ebe3;      /* Primary text */
  --pallor-200: #d4c8b8;      /* Secondary text */
  --pallor-300: #a89888;      /* Muted */
  --pallor-400: #7a6d62;      /* Subtle */
  
  /* Sensual Texture Overlays */
  --velvet-gloss: rgba(192, 57, 43, 0.08);
  --silk-sheen: rgba(212, 165, 116, 0.06);
  --obsidian-glass: rgba(10, 10, 15, 0.85);
  
  /* Semantic */
  --text-primary: var(--pallor-100);
  --text-secondary: var(--pallor-300);
  --text-muted: var(--pallor-400);
  --accent-primary: var(--blood-400);
  --accent-secondary: var(--wine-400);
  --surface: var(--void-800);
  --surface-elevated: var(--void-700);
  --border-subtle: rgba(212, 165, 116, 0.12);
  --border-focus: var(--blood-400);
}
```

#### TYPOGRAPHY — "SCRIPTURE & SIN"
```css
/* Display: Gothic Ornate — for headlines that command worship */
@font-face {
  font-family: 'Gothic-Ornate';
  src: url('/fonts/UnifrakturMaguntia-Regular.woff2') format('woff2');
  font-display: swap;
}

/* Display Alt: Sharp Modern Gothic — for subheads with bite */
@font-face {
  font-family: 'Gothic-Sharp';
  src: url('/fonts/CinzelDecorative-Bold.woff2') format('woff2');
  font-display: swap;
}

/* Body: Elegant Serif — readable luxury */
@font-face {
  font-family: 'Nocturne-Serif';
  src: url('/fonts/CormorantGaramond-Regular.woff2') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: 'Nocturne-Serif';
  src: url('/fonts/CormorantGaramond-Italic.woff2') format('woff2');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'Nocturne-Serif';
  src: url('/fonts/CormorantGaramond-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

/* UI: Clean Sans — forms, buttons, data */
@font-face {
  font-family: 'Nocturne-Sans';
  src: url('/fonts/InterVariable.woff2') format('woff2');
  font-display: swap;
}

:root {
  --font-display: 'Gothic-Ornate', 'Gothic-Sharp', Georgia, serif;
  --font-display-alt: 'Gothic-Sharp', 'Gothic-Ornate', Georgia, serif;
  --font-body: 'Nocturne-Serif', Georgia, serif;
  --font-ui: 'Nocturne-Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Fluid type scale */
  --step--2: clamp(0.69rem, 0.67rem + 0.11vw, 0.76rem);
  --step--1: clamp(0.83rem, 0.80rem + 0.16vw, 0.92rem);
  --step-0: clamp(1rem, 0.96rem + 0.22vw, 1.12rem);
  --step-1: clamp(1.2rem, 1.15rem + 0.28vw, 1.35rem);
  --step-2: clamp(1.44rem, 1.37rem + 0.36vw, 1.62rem);
  --step-3: clamp(1.73rem, 1.62rem + 0.55vw, 1.95rem);
  --step-4: clamp(2.07rem, 1.92rem + 0.81vw, 2.35rem);
  --step-5: clamp(2.49rem, 2.28rem + 1.15vw, 2.85rem);
  --step-6: clamp(2.98rem, 2.70rem + 1.54vw, 3.5rem);
  --step-7: clamp(3.58rem, 3.18rem + 2.05vw, 4.3rem);
}
```

#### MOTION LANGUAGE — "BREATH & PULSE"
```css
:root {
  /* Micro: The Flutter */
  --ease-flutter: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --dur-flutter: 180ms;
  
  /* Macro: The Sigh */
  --ease-sigh: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-sigh: 400ms;
  
  /* Epic: The Ritual */
  --ease-ritual: cubic-bezier(0.05, 0.61, 0.41, 0.9);
  --dur-ritual: 800ms;
  
  /* Sensual: The Caress */
  --ease-caress: cubic-bezier(0.23, 1, 0.32, 1);
  --dur-caress: 600ms;
}
```

#### TEXTURE LAYERING SYSTEM
```css
/* Each layer adds depth. Stack like sediment. */
.texture-velvet {
  background-image: 
    radial-gradient(ellipse at 20% 20%, var(--velvet-gloss) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, var(--silk-sheen) 0%, transparent 50%),
    url('/textures/velvet-noise.png');
  background-blend-mode: overlay, soft-light, multiply;
}

.texture-cracked-obsidian {
  background-image: url('/textures/obsidian-cracks.svg');
  background-size: cover;
  opacity: 0.04;
}

.texture-gold-leaf {
  background-image: url('/textures/gold-leaf-flecks.svg');
  background-size: 400px;
  opacity: 0.06;
  animation: goldDrift 60s linear infinite;
}

@keyframes goldDrift {
  0% { background-position: 0 0; }
  100% { background-position: 400px 400px; }
}
```

---

### SITE ARCHITECTURE — "THE CATHEDRAL"

```
projectsixxx.com/
├── /                          # Home — The Altar
├── /shop/                     # Shop Hub — The Bazaar
│   ├── /shop/hnh/             # Horns & Halos Official
│   ├── /shop/spreadshirt/     # Spreadshirt Collection
│   ├── /shop/threadless/      # Threadless Collection
│   ├── /shop/etsy/            # Etsy Curated
│   └── /shop/affiliates/      # Affiliate Marketplace
├── /services/                 # Services Portfolio — The Guild
│   ├── /services/formation    # LLC & C-Corp Formation
│   ├── /services/business-model # Business Model Design
│   ├── /services/digital-production # Digital Production
│   ├── /services/web-dev      # Website Dev & Deployment
│   ├── /services/agentic-bots # Agentic Bot Integrations
│   ├── /services/custom-features # Custom Features & Apps
│   ├── /services/tech-support # General Tech Support
│   ├── /services/financial    # Financial Services
│   ├── /services/data         # Data Management
│   ├── /services/art-music    # Art & Music Production
│   └── /services/collab       # Collaboration Services
├── /gallery/                  # Art Gallery — The Sanctum
│   ├── /gallery/digital       # Digital Art
│   ├── /gallery/photography   # Dark Photography
│   ├── /gallery/generative    # AI/Generative
│   └── /gallery/commissions   # Commission Portal
├── /journal/                  # Blog & Community — The Scriptorium
│   ├── /journal/articles      # Long-form Essays
│   ├── /journal/boards        # Message Boards
│   ├── /journal/announcements # Official Updates
│   └── /journal/topics/       # Topic Channels
├── /contact/                  # Contact & Booking — The Confessional
│   ├── /contact/services      # Service Inquiries
│   ├── /contact/collab        # Collaboration Requests
│   ├── /contact/press         # Press & Media
│   └── /contact/general       # General Contact
└── /account/                  # User Portal — The Inner Circle
    ├── /account/dashboard
    ├── /account/orders
    ├── /account/commissions
    └── /account/settings
```

---

### PAGE SPECIFICATIONS

#### 1. HOME — "THE ALTAR"
**Purpose:** Visceral brand immersion, gateway to all realms  
**Key Elements:**
- Full-viewport hero with WebGL particle field (blood cells, gold dust, velvet fibers)
- Gothic logotype animated letter-by-letter (GSAP ScrollTrigger)
- Ambient audio hint: sub-bass heartbeat (opt-in, respects prefers-reduced-motion)
- Three portals: SHOP • SERVICES • GALLERY — each a living thumbnail
- "Currently Haunting" — live activity feed (recent orders, gallery uploads, journal entries)
- Newsletter sigil: "Swear Fealty" — email capture with wax-seal animation
- Footer: Dark navigation, social sigils, legal scrolls

**Interactions:**
- Mouse parallax on hero depth layers (20px max)
- Scroll-reveal: each section bleeds in from darkness
- Hover portals: subtle scale + glow + audio whisper
- Reduced motion: instant reveals, no parallax

#### 2. SHOP HUB — "THE BAZAAR"
**Purpose:** Unified marketplace aggregator with HnH brand dominance  
**Key Elements:**
- Sticky filter bar: Source (HnH/Spreadshirt/Threadless/Etsy/Affiliate) | Category | Price | Tag
- Masonry grid with infinite scroll (IntersectionObserver)
- Product cards: hover reveals quick-add, variant pills, "Blood Type" (bestseller/new/sale)
- Sidebar: Faceted search with animated counts
- Affiliate disclosure elegantly integrated (not hidden)
- "Curated by the Coven" — editorial picks with storytelling
- Cart drawer: slides from right, velvet texture, persistent across sub-shops

**Data Strategy:**
- Shopify Storefront API (HnH primary)
- Spreadshirt/Threadless/Etsy via affiliate feeds (cached, refreshed 4x/day)
- Unified product schema → normalized in Sanity/Contentlayer
- ISR: 60s revalidate for prices, 1hr for inventory

#### 3. SERVICES — "THE GUILD"
**Purpose:** Convert high-value leads for 12 service categories  
**Structure per Service:**
- Hero: Gothic icon + poetic value prop + "Summon This Service" CTA
- Process: 4-step ritual (Discovery → Design → Forge → Deliver)
- Proof: 2-3 case studies with metrics, testimonials as "sworn oaths"
- Pricing: Tiered (Acolyte / Adept / Archmage) with transparent scope
- FAQ: Accordion with "Confessions" microcopy
- Booking: Calendly embed styled to match, pre-filled with service context

**Services Matrix:**
| Category | Icon | Tier Pricing | Lead Magnet |
|----------|------|--------------|-------------|
| LLC/C-Corp Formation | ⚖️ | $497/$1,497/$3,997 | "Entity Selection Grimoire" |
| Business Model Design | 🏗️ | $2,500/$7,500/$15,000 | "Revenue Architecture Canvas" |
| Digital Production | 🎬 | $1,500/$5,000/$12,000 | "Production Pipeline Map" |
| Web Dev & Deployment | 🕸️ | $3,000/$10,000/$25,000 | "Tech Stack Divination" |
| Agentic Bot Integrations | 🤖 | $2,000/$8,000/$20,000 | "Agent Workforce Blueprint" |
| Custom Features/Apps | ⚙️ | $5,000/$15,000/$50,000 | "Feature Spec Ritual" |
| Tech Support | 🛡️ | $197/mo/$497/mo/$1,297/mo | "Incident Response Runes" |
| Financial Services | 💰 | Custom | "Wealth Architecture Audit" |
| Data Management | 🗃️ | $1,000/$3,500/$10,000 | "Data Sovereignty Guide" |
| Art & Music Production | 🎨 | $500/$2,500/$10,000 | "Creative Direction Codex" |
| Collaboration Services | 🤝 | Revenue Share | "Partnership Covenant" |
| General Consulting | 🔮 | $300/hr/$1,500/day/$5,000/wk | "Oracle Session" |

#### 4. GALLERY — "THE SANCTUM"
**Purpose:** Showcase dark art, enable commissions, sell prints  
**Tech:** WebGL shader gallery (Three.js + custom fragment shaders)
- Shader effects: "Blood Rain", "Velvet Vignette", "Gold Leaf Decay", "Obsidian Reflection"
- Masonry with fluid layout (react-masonry-css or custom)
- Lightbox: fullscreen with shader transitions between works
- Artist profiles: "Summoned By" with links to their realms
- Commission portal: brief builder → quote → contract → progress updates
- Print sales: integrated with Printful/Gelato API, framed options
- NFT optional: "Soul-Bound Editions" on Base/Arbitrum (future)

#### 5. JOURNAL — "THE SCRIPTORIUM"
**Purpose:** SEO authority, community retention, thought leadership  
**Content Types:**
- **Essays** (2000+ words): Deep dives on business, creativity, darkness
- **Rituals** (500-1500): How-to guides, frameworks, templates
- **Confessions** (300-800): Personal notes, failures, lessons
- **Summonings** (announcements): Launches, partnerships, drops
- **Boards** (forum): Category-threaded, markdown, reactions, mentions

**Tech:** MDX + Contentlayer + Next.js App Router
- Syntax highlighting: Dracula Pro theme
- Reading progress bar (blood red)
- Estimated read time (ritual duration)
- Table of contents (floating, sticky)
- Newsletter inline capture every ~40% scroll
- Comments: Giscus (GitHub Discussions) — dark themed

#### 6. CONTACT — "THE CONFESSIONAL"
**Purpose:** High-touch lead capture with sensual UX  
**Forms per Intent:**
- Services: Multi-step (Service → Scope → Budget → Timeline → Contact)
- Collaboration: Project type → Vision → Assets → Team → NDA toggle
- Press: Outlet → Angle → Deadline → Assets needed
- General: Category → Message → "Seal with Wax" submit

**UX Details:**
- Field focus: velvet glow expansion
- Validation: blood-drip error states
- Success: wax seal animation + confirmation email
- reCAPTCHA v3 invisible (no checkbox)
- Webhook → HubSpot/Close CRM + Slack alert + Notion database

---

### TECHNICAL STACK — "THE FORGE"

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | RSC, streaming, ISR, optimal SEO |
| Language | TypeScript (strict) | Type safety at scale |
| Styling | Tailwind CSS + CSS Variables | Design tokens, dark mode native |
| Animation | GSAP + Framer Motion | Complex sequences + React integration |
| 3D/WebGL | Three.js + React Three Fiber | Shader gallery, hero particles |
| State | Zustand + TanStack Query | Global UI state + server cache |
| Forms | React Hook Form + Zod | Validation, type inference |
| CMS | Sanity.io (free tier) | Structured content, real-time preview |
| Auth | NextAuth.js (Credentials + GitHub) | Account portal, admin |
| Database | PostgreSQL (Vercel Postgres) | Orders, leads, users |
| ORM | Prisma | Type-safe DB |
| Email | Resend + React Email | Beautiful transactional |
| Analytics | Vercel Analytics + Plausible | Privacy-first |
| Hosting | Vercel (Pro) | Edge, ISR, zero-config |
| Domain | projectsixxx.com (Cloudflare) | DNS, WAF, analytics |

---

### PERFORMANCE BUDGETS — "THE DISCIPLINE"

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.5s | Vercel Analytics |
| CLS | < 0.1 | Web Vitals |
| TBT | < 200ms | Lighthouse |
| JS Bundle (gz) | < 120kb initial | next-bundle-analyzer |
| CSS (gz) | < 30kb | -- |
| Fonts | < 50kb (woff2, subset) | -- |
| Images | AVIF/WebP, sized | next/image |
| Lighthouse | 95+ all categories | CI gate |

---

### ACCESSIBILITY — "THE INCLUSIVE ABYSS"
- WCAG 2.1 AA minimum
- `prefers-reduced-motion`: disable all non-essential animation
- `prefers-contrast`: high-contrast mode (blood on void)
- Keyboard navigation: visible focus rings (blood-400, 3px)
- Screen readers: semantic HTML, ARIA labels, live regions
- Color contrast: 7:1 for text, 3:1 for UI elements
- No content flashes > 3Hz

---

### CONTENT STRATEGY — "THE LORE"

**Voice Guidelines:**
- **Tone:** Authoritative, sensual, slightly dangerous, never apologetic
- **Vocabulary:** Ritualistic (summon, forge, bind, covenant, grimoire, sanctum)
- **Perspective:** Second-person intimate ("You seek..." "Your empire...")
- **Humor:** Dry, dark, self-aware — never camp
- **CTAs:** Imperative, ceremonial ("Swear Fealty", "Summon the Guild", "Enter the Sanctum")

**Microcopy Examples:**
- Loading: "Summoning shadows..." "Binding the grimoire..." "Awakening the coven..."
- Error: "The ritual failed. The spirits are restless." "A seal is broken. Try again."
- Empty states: "The sanctum awaits its first offering." "No confessions yet. Be the first."
- Success: "The covenant is sealed." "Your offering has been received."

---

### LAUNCH CHECKLIST — "THE CONSECRATION"

**Pre-Launch:**
- [ ] All 6 core pages complete + responsive
- [ ] Design system documented in Storybook
- [ ] E2E tests: Cypress (critical paths)
- [ ] Unit tests: Vitest (utils, hooks, schemas)
- [ ] Lighthouse CI gate in GitHub Actions
- [ ] Accessibility audit: axe-core + manual
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge
- [ ] Mobile: iOS Safari, Chrome Android
- [ ] 404/500 pages branded
- [ ] Sitemap.xml + robots.txt
- [ ] Open Graph / Twitter cards per page
- [ ] JSON-LD structured data (Organization, Product, Service, Article)
- [ ] CSP headers configured
- [ ] Rate limiting on forms/API
- [ ] Backup/restore tested

**Launch Day:**
- [ ] DNS cutover
- [ ] SSL verified
- [ ] Analytics firing
- [ ] Forms → CRM verified
- [ ] Shop sync verified
- [ ] Newsletter welcome flow live
- [ ] Monitoring alerts configured

**Post-Launch (Week 1):**
- [ ] Core Web Vitals monitoring
- [ ] Error tracking (Sentry)
- [ ] User session replay (PostHog)
- [ ] A/B test: Hero CTA copy
- [ ] Heatmaps on key pages

---

### FUTURE PHASES — "THE ASCENSION"

**Phase 2 (Month 2-3):**
- User accounts: order history, wishlist, commission tracking
- Loyalty: "Blood Oath" tiers with perks
- Referral: "Spawn a Disciple" program
- Admin dashboard: analytics, content, orders, users

**Phase 3 (Month 4-6):**
- Mobile app (React Native / Expo)
- AR try-on for apparel (WebXR)
- AI stylist: "The Oracle" (wardrobe recommendations)
- Community marketplace: user-to-user resale
- Physical: pop-up rituals, limited drops

**Phase 4 (Year 2):**
- Franchise: white-label "Sanctum" for other dark brands
- Media: "Projectsixxx Chronicles" video series
- Physical flagship: "The Cathedral" retail experience

---

### AGENT TEAM ASSIGNMENTS

| Agent | Role | Focus |
|-------|------|-------|
| **Lead (You)** | Creative Director / Architect | Vision, design system, code review, integration |
| **Agent A** | Frontend Architect | Next.js setup, routing, RSC patterns, performance |
| **Agent B** | UI/UX Engineer | Components, design tokens, animations, accessibility |
| **Agent C** | Shop Integration Specialist | Shopify, affiliate APIs, cart, checkout |
| **Agent D** | Services/Forms Engineer | Service pages, multi-step forms, CRM integration |
| **Agent E** | Creative Technologist | WebGL shaders, Three.js, gallery, hero particles |
| **Agent F** | Content/SEO Engineer | MDX, Contentlayer, journal, structured data |
| **Agent G** | DevOps/Quality | CI/CD, testing, monitoring, deployment |

---

### IMMEDIATE NEXT STEPS

1. **Initialize Next.js 14 project** with TypeScript, Tailwind, ESLint, Prettier
2. **Install font files** (download & subset Gothic-Ornate, Gothic-Sharp, Nocturne-Serif, Nocturne-Sans)
3. **Create design token system** (Tailwind config + CSS variables)
4. **Build base layout** (App Router, providers, global styles)
5. **Implement global components** (Navigation, Footer, ThemeProvider)
6. **Spawn specialist agents** for parallel page development
7. **Establish component library** in Storybook
8. **Set up Sanity CMS** for content management
9. **Configure Vercel project** with preview deployments
10. **Begin page-by-page implementation** per priority

---

*This specification is a living document. Update as the darkness evolves.*