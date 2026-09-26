# Horns & Halos — Complete Shopify Store Setup Checklist

> **Brand:** Horns & Halos Streetwear  
> **Date:** 2026-08-24  
> **Status:** Ready for Implementation

---

## 1. COLLECTIONS ARCHITECTURE

### 1.1 Collection Handles & Structure

| Collection Handle | Display Name | Description | Parent Collection | Product Types | Sort Order |
|-------------------|--------------|-------------|-------------------|---------------|------------|
| `horns` | **HORNS** | Dark, edgy, rebellious pieces | — | Tees, Hoodies | 1 |
| `halos` | **HALOS** | Clean, elevated, minimalist pieces | — | Tees, Hoodies | 2 |
| `duality` | **DUALITY** | Split-design & reversible pieces bridging both worlds | — | Tees, Hoodies | 3 |
| `accessories` | **ACCESSORIES** | Bags, jewelry, socks, belts, keychains | — | Bags, Jewelry, Socks, Belts, Keychains | 4 |
| `headwear` | **HEADWEAR** | Caps, beanies, bucket hats | — | Caps, Beanies, Bucket Hats | 5 |
| `new-arrivals` | **NEW ARRIVALS** | Auto-collection: last 30 days | — | All | 0 (hidden from nav) |
| `sale` | **SALE** | Auto-collection: compare-at-price > price | — | All | 6 |
| `bundles` | **BUNDLES** | Curated multi-piece sets | — | Bundles | 7 |

### 1.2 Collection Rules (Smart Collections)

```json
{
  "smart_collections": [
    {
      "handle": "new-arrivals",
      "title": "NEW ARRIVALS",
      "rules": [
        { "column": "published_at", "relation": "greater_than", "condition": "-30 days" }
      ],
      "sort_order": "created-descending",
      "published_scope": "web"
    },
    {
      "handle": "sale",
      "title": "SALE",
      "rules": [
        { "column": "variant_compare_at_price", "relation": "greater_than", "condition": "0" },
        { "column": "variant_price", "relation": "less_than", "condition": "variant_compare_at_price" }
      ],
      "sort_order": "best-selling",
      "published_scope": "web"
    },
    {
      "handle": "under-50",
      "title": "UNDER $50",
      "rules": [
        { "column": "variant_price", "relation": "less_than", "condition": "50" }
      ],
      "sort_order": "price-ascending",
      "published_scope": "web"
    },
    {
      "handle": "hoodies",
      "title": "ALL HOODIES",
      "rules": [
        { "column": "type", "relation": "equals", "condition": "Hoodie" }
      ],
      "sort_order": "manual",
      "published_scope": "web"
    },
    {
      "handle": "tees",
      "title": "ALL TEES",
      "rules": [
        { "column": "type", "relation": "equals", "condition": "Tee" }
      ],
      "sort_order": "manual",
      "published_scope": "web"
    },
    {
      "handle": "caps",
      "title": "ALL CAPS",
      "rules": [
        { "column": "type", "relation": "equals", "condition": "Cap" }
      ],
      "sort_order": "manual",
      "published_scope": "web"
    }
  ]
}
```

### 1.3 Product Type Taxonomy

```
Product Types (used for filtering & reporting):
├── Tee
├── Hoodie
├── Cap
├── Beanie
├── Bucket Hat
├── Bag
├── Jewelry
├── Socks
├── Belt
├── Keychain
└── Bundle
```

### 1.4 Tag Schema (for filtering)

```json
{
  "tag_categories": {
    "collection": ["horns", "halos", "duality", "accessories", "headwear"],
    "fit": ["oversized", "relaxed", "standard", "cropped", "fitted"],
    "fabric": ["heavyweight-cotton", "midweight-cotton", "lightweight-cotton", "french-terry", "fleece", "mesh", "canvas", "denim"],
    "color": ["black", "white", "grey", "cream", "charcoal", "navy", "olive", "burgundy", "rust", "mustard"],
    "graphic": ["screen-print", "embroidery", "puff-print", "discharge", "dtg", "sublimation", "woven-label"],
    "feature": ["reversible", "split-design", "hidden-pocket", "thumb-holes", "drawstring", "adjustable-strap"],
    "drop": ["ss26", "fw26", "core", "capsule", "collab"],
    "gender": ["unisex", "mens", "womens"]
  }
}
```

---

## 2. NAVIGATION / MENU STRUCTURE

### 2.1 Main Navigation JSON

```json
{
  "menu_handle": "main-menu",
  "title": "Main Navigation",
  "items": [
    {
      "title": "SHOP",
      "type": "dropdown",
      "handle": "shop",
      "children": [
        { "title": "HORNS", "type": "collection", "handle": "horns", "url": "/collections/horns" },
        { "title": "HALOS", "type": "collection", "handle": "halos", "url": "/collections/halos" },
        { "title": "DUALITY", "type": "collection", "handle": "duality", "url": "/collections/duality" },
        { "title": "ACCESSORIES", "type": "collection", "handle": "accessories", "url": "/collections/accessories" },
        { "title": "HEADWEAR", "type": "collection", "handle": "headwear", "url": "/collections/headwear" },
        { "type": "divider" },
        { "title": "NEW ARRIVALS", "type": "collection", "handle": "new-arrivals", "url": "/collections/new-arrivals", "badge": "NEW" },
        { "title": "SALE", "type": "collection", "handle": "sale", "url": "/collections/sale", "badge": "SALE" },
        { "title": "BUNDLES", "type": "collection", "handle": "bundles", "url": "/collections/bundles" }
      ]
    },
    {
      "title": "LOOKBOOK",
      "type": "page",
      "handle": "lookbook",
      "url": "/pages/lookbook"
    },
    {
      "title": "SIZE GUIDE",
      "type": "page",
      "handle": "size-guide",
      "url": "/pages/size-guide"
    },
    {
      "title": "OUR STORY",
      "type": "page",
      "handle": "our-story",
      "url": "/pages/our-story"
    },
    {
      "title": "COMMUNITY",
      "type": "dropdown",
      "handle": "community",
      "children": [
        { "title": "AMBASSADORS", "type": "page", "handle": "ambassadors", "url": "/pages/ambassadors" },
        { "title": "AFFILIATE PROGRAM", "type": "page", "handle": "affiliate-program", "url": "/pages/affiliate-program" },
        { "title": "PRESS", "type": "page", "handle": "press", "url": "/pages/press" }
      ]
    }
  ]
}
```

### 2.2 Footer Navigation JSON

```json
{
  "menu_handle": "footer-menu",
  "title": "Footer Navigation",
  "columns": [
    {
      "heading": "SHOP",
      "items": [
        { "title": "HORNS", "url": "/collections/horns" },
        { "title": "HALOS", "url": "/collections/halos" },
        { "title": "DUALITY", "url": "/collections/duality" },
        { "title": "ACCESSORIES", "url": "/collections/accessories" },
        { "title": "HEADWEAR", "url": "/collections/headwear" },
        { "title": "BUNDLES", "url": "/collections/bundles" },
        { "title": "SALE", "url": "/collections/sale" }
      ]
    },
    {
      "heading": "SUPPORT",
      "items": [
        { "title": "SIZE GUIDE", "url": "/pages/size-guide" },
        { "title": "SHIPPING & RETURNS", "url": "/pages/shipping-returns" },
        { "title": "FAQ", "url": "/pages/faq" },
        { "title": "CONTACT US", "url": "/pages/contact" },
        { "title": "ORDER TRACKING", "url": "/pages/track-order" }
      ]
    },
    {
      "heading": "COMPANY",
      "items": [
        { "title": "OUR STORY", "url": "/pages/our-story" },
        { "title": "SUSTAINABILITY", "url": "/pages/sustainability" },
        { "title": "AMBASSADORS", "url": "/pages/ambassadors" },
        { "title": "AFFILIATE PROGRAM", "url": "/pages/affiliate-program" },
        { "title": "WHOLESALE", "url": "/pages/wholesale" },
        { "title": "CAREERS", "url": "/pages/careers" }
      ]
    },
    {
      "heading": "LEGAL",
      "items": [
        { "title": "PRIVACY POLICY", "url": "/policies/privacy-policy" },
        { "title": "TERMS OF SERVICE", "url": "/policies/terms-of-service" },
        { "title": "REFUND POLICY", "url": "/policies/refund-policy" },
        { "title": "COOKIE POLICY", "url": "/policies/cookie-policy" }
      ]
    }
  ]
}
```

### 2.3 Mobile Navigation JSON

```json
{
  "menu_handle": "mobile-menu",
  "title": "Mobile Navigation",
  "items": [
    { "title": "🛍 SHOP", "type": "expandable", "children": ["horns", "halos", "duality", "accessories", "headwear", "bundles", "sale"] },
    { "title": "📸 LOOKBOOK", "url": "/pages/lookbook" },
    { "title": "📏 SIZE GUIDE", "url": "/pages/size-guide" },
    { "title": "❤️ COMMUNITY", "type": "expandable", "children": ["ambassadors", "affiliate-program", "press"] },
    { "title": "👤 ACCOUNT", "url": "/account" },
    { "title": "🛒 CART", "url": "/cart" }
  ]
}
```

---

## 3. PRODUCT PAGE TEMPLATE — CONVERSION-OPTIMIZED SECTION SCHEMA

### 3.1 Section Architecture (Dawn 2.0+ / Online Store 2.0)

```json
{
  "template": "product",
  "sections": {
    "product-hero": {
      "type": "product-hero",
      "settings": {
        "enable_sticky_atc": true,
        "enable_image_zoom": true,
        "enable_video_loop": true,
        "gallery_layout": "thumbnails-bottom",
        "show_video_play_button": true,
        "aspect_ratio": "4:5",
        "mobile_aspect_ratio": "3:4"
      },
      "blocks": [
        { "type": "featured_image", "settings": { "priority": "high" } },
        { "type": "gallery_thumbnails", "settings": { "max_visible": 8 } },
        { "type": "video_player", "settings": { "autoplay": false, "loop": true, "muted": true } },
        { "type": "360_viewer", "settings": { "enabled": false } }
      ]
    },
    "product-badges": {
      "type": "product-badges",
      "settings": {
        "show_new_badge": true,
        "new_badge_days": 30,
        "show_sale_badge": true,
        "show_bestseller_badge": true,
        "show_limited_badge": true,
        "badge_position": "top-left"
      }
    },
    "product-title-meta": {
      "type": "product-title-meta",
      "settings": {
        "show_vendor": false,
        "show_sku": false,
        "show_collections": true,
        "show_tags": false,
        "collection_links_enabled": true
      }
    },
    "product-price": {
      "type": "product-price",
      "settings": {
        "show_compare_at_price": true,
        "show_unit_price": false,
        "show_payment_terms": true,
        "payment_terms_text": "or 4 interest-free payments of {{ amount }} with",
        "enable_price_animation": true
      }
    },
    "size-confidence": {
      "type": "size-confidence",
      "settings": {
        "enable_size_guide_modal": true,
        "enable_model_specs": true,
        "enable_fit_predictor": true,
        "enable_size_comparison": true,
        "default_model": {
          "height_cm": 183,
          "weight_kg": 82,
          "chest_cm": 104,
          "waist_cm": 84,
          "wearing_size": "L",
          "fit_preference": "relaxed"
        },
        "size_chart_type": "per-product",
        "show_customer_reviews_sizing": true
      },
      "blocks": [
        { "type": "size_chart_table", "settings": { "measurements": ["chest", "length", "sleeve", "shoulder"] } },
        { "type": "model_specs_card", "settings": { "show_multiple_models": true } },
        { "type": "fit_predictor_quiz", "settings": { "questions": 4 } },
        { "type": "size_comparison", "settings": { "compare_to_brands": ["Nike", "Carhartt", "Champion", "Gildan"] } }
      ]
    },
    "product-variant-selector": {
      "type": "product-variant-selector",
      "settings": {
        "selector_type": "swatch",
        "show_color_swatches": true,
        "show_size_chips": true,
        "enable_inline_stock": true,
        "low_stock_threshold": 5,
        "sold_out_behavior": "hide",
        "show_sku_on_select": false
      }
    },
    "product-atc-sticky": {
      "type": "product-atc-sticky",
      "settings": {
        "enable_sticky": true,
        "trigger_scroll": 300,
        "show_price": true,
        "show_quantity": true,
        "button_text": "ADD TO CART",
        "enable_apple_pay": true,
        "enable_google_pay": true,
        "enable_shop_pay": true
      }
    },
    "product-description": {
      "type": "product-description",
      "settings": {
        "description_style": "tabs",
        "tabs": [
          { "title": "DETAILS", "content": "product.description" },
          { "title": "MATERIALS & CARE", "content": "metafield.materials_care" },
          { "title": "SIZING & FIT", "content": "metafield.sizing_fit" },
          { "title": "SHIPPING", "content": "metafield.shipping_info" }
        ],
        "enable_collapsible_faq": true
      }
    },
    "trust-signals": {
      "type": "trust-signals",
      "settings": {
        "show_free_shipping": true,
        "free_shipping_threshold": 100,
        "show_free_returns": true,
        "return_window_days": 60,
        "show_secure_checkout": true,
        "show_sustainability_badge": true,
        "show_community_count": true,
        "custom_badges": [
          { "icon": "shield", "text": "60-Day Easy Returns" },
          { "icon": "truck", "text": "Free Shipping $100+" },
          { "icon": "leaf", "text": "Sustainably Made" },
          { "icon": "users", "text": "50K+ Community Members" }
        ]
      }
    },
    "lifestyle-gallery": {
      "type": "lifestyle-gallery",
      "settings": {
        "heading": "STYLED BY COMMUNITY",
        "source": "metafield.lifestyle_images",
        "layout": "masonry",
        "enable_lookbook_tags": true,
        "show_instagram_feed": true,
        "instagram_hashtag": "#HornsAndHalos",
        "max_images": 12,
        "enable_shop_the_look": true
      }
    },
    "bundles-upsell": {
      "type": "bundles-upsell",
      "settings": {
        "heading": "COMPLETE THE LOOK",
        "strategy": "manual",
        "max_products": 4,
        "layout": "carousel",
        "show_bundle_discount": true,
        "bundle_discount_text": "Save {{ discount }}% when bundled",
        "enable_frequently_bought_together": true,
        "fbt_algorithm": "shopify-collective"
      },
      "blocks": [
        { "type": "manual_bundle", "settings": { "products": [] } },
        { "type": "frequently_bought_together", "settings": {} },
        { "type": "complete_the_look", "settings": {} },
        { "type": "recently_viewed", "settings": { "max": 4 } }
      ]
    },
    "product-reviews": {
      "type": "product-reviews",
      "settings": {
        "app": "judge-me",
        "show_rating_summary": true,
        "show_review_count": true,
        "show_media_gallery": true,
        "enable_qa": true,
        "default_sort": "newest",
        "show_verified_badge": true,
        "min_reviews_for_summary": 3
      }
    },
    "recently-viewed": {
      "type": "recently-viewed",
      "settings": {
        "heading": "YOU MAY ALSO LIKE",
        "max_products": 8,
        "layout": "grid"
      }
    },
    "newsletter-capture": {
      "type": "newsletter-capture",
      "settings": {
        "heading": "JOIN THE DUALITY",
        "subtext": "Early access to drops, exclusive colorways, and 10% off your first order.",
        "placeholder": "Enter email",
        "button_text": "SUBSCRIBE",
        "show_privacy_link": true,
        "incentive": "10% OFF FIRST ORDER"
      }
    }
  },
  "section_order": [
    "product-hero",
    "product-badges",
    "product-title-meta",
    "product-price",
    "size-confidence",
    "product-variant-selector",
    "product-atc-sticky",
    "product-description",
    "trust-signals",
    "lifestyle-gallery",
    "bundles-upsell",
    "product-reviews",
    "recently-viewed",
    "newsletter-capture"
  ]
}
```

### 3.2 Required Metafields (Product Level)

```json
{
  "metafields": [
    { "namespace": "custom", "key": "materials_care", "type": "rich_text_field", "description": "Fabric composition & care instructions" },
    { "namespace": "custom", "key": "sizing_fit", "type": "rich_text_field", "description": "Detailed fit notes, model specs, shrinkage info" },
    { "namespace": "custom", "key": "shipping_info", "type": "rich_text_field", "description": "Shipping timeline, origin, packaging details" },
    { "namespace": "custom", "key": "lifestyle_images", "type": "list.file_reference", "description": "UGC/lifestyle images for gallery" },
    { "namespace": "custom", "key": "size_chart", "type": "json", "description": "Per-size measurements in cm" },
    { "namespace": "custom", "key": "model_specs", "type": "json", "description": "Model measurements per size worn" },
    { "namespace": "custom", "key": "bundle_products", "type": "list.product_reference", "description": "Manual bundle selections" },
    { "namespace": "custom", "key": "collection_theme", "type": "single_line_text_field", "description": "horns/halos/duality" },
    { "namespace": "custom", "key": "drop_season", "type": "single_line_text_field", "description": "e.g., FW26, SS26, CORE" },
    { "namespace": "custom", "key": "is_reversible", "type": "boolean", "description": "For Duality collection" },
    { "namespace": "custom", "key": "hidden_features", "type": "rich_text_field", "description": "Hidden pockets, thumb holes, etc." }
  ]
}
```

### 3.3 Conversion Optimization Checklist (Per PDP)

- [ ] **Hero**: 4:5 hero image + 3-5 lifestyle shots + 1 video (15-30s loop)
- [ ] **Badges**: NEW (30 days), SALE, BESTSELLER, LIMITED auto-display
- [ ] **Size Confidence**: Size chart + Model specs (height/weight/size) + Fit predictor quiz + Brand comparison
- [ ] **Variant Selector**: Color swatches + Size chips + Inline stock ("Only 3 left in M")
- [ ] **Sticky ATC**: Appears after 300px scroll with Apple/Google/Shop Pay
- [ ] **Description Tabs**: Details | Materials & Care | Sizing & Fit | Shipping
- [ ] **Trust Signals**: Free shipping $100+, 60-day returns, Secure checkout, Sustainability, Community count
- [ ] **Lifestyle Gallery**: UGC masonry + #HornsAndHalos Instagram feed + Shop the Look tagging
- [ ] **Bundles/Upsell**: Manual bundles + Frequently Bought Together + Complete the Look + Recently Viewed
- [ ] **Reviews**: Judge.me with photos, Q&A, verified buyer badges
- [ ] **Newsletter Capture**: 10% off incentive, exit-intent optional

---

## 4. AFFILIATE MARKETING PROGRAM RESEARCH

### 4.1 Recommended Affiliate Networks & Programs

| Program / Network | Category | Commission Rate | Cookie Window | Min Payout | Fit Score (1-10) | Notes |
|-------------------|----------|-----------------|---------------|------------|------------------|-------|
| **ShareASale** | Network | Varies by merchant | 30-90 days | $50 | 9 | 20k+ merchants, strong streetwear/fashion vertical |
| **Impact (Impact.com)** | Network | Varies | 30-60 days | $10 | 9 | Enterprise-grade, direct brand partnerships |
| **AvantLink** | Network | 5-20% | 30-60 days | $25 | 8 | Outdoor/lifestyle focus, good for accessories |
| **Rakuten Advertising** | Network | Varies | 30-90 days | $50 | 7 | Large brands, higher minimums |
| **CJ Affiliate** | Network | Varies | 7-120 days | $50 | 7 | Legacy network, big brand partners |
| **LTK (LikeToKnowIt)** | Creator Platform | 5-20% | Session-based | $25 | 8 | Influencer-focused, strong fashion/beauty |
| **Collective Voice (ShopStyle)** | Creator Platform | 5-15% | 30 days | $25 | 7 | Fashion-focused creator tools |

### 4.2 Direct Brand Affiliate Programs (Streetwear-Adjacent)

| Brand | Category | Commission | Cookie | Fit Score | Why It Fits Horns & Halos |
|-------|----------|------------|--------|-----------|---------------------------|
| **Gorilla Wear** | Gym/Streetwear | 10-15% | 30 days | 9 | Heavy lift aesthetic, duality vibe |
| **Gymshark** | Athleisure | 8-12% | 30 days | 7 | Massive community, but saturated |
| **Alphalete** | Gym/Street | 10% | 30 days | 8 | Strong male demographic overlap |
| **Born Primitive** | Tactical/Street | 10-15% | 30 days | 9 | Veteran-founded, rugged aesthetic |
| **Rhone** | Premium Active | 10% | 30 days | 7 | Higher price point, quality focus |
| **Ten Thousand** | Training Gear | 10% | 30 days | 8 | Minimalist, premium, loyal following |
| **Lululemon** | Premium Active | 5-7% | 30 days | 6 | Brand prestige, lower commission |
| **Outdoor Voices** | Rec Active | 8-10% | 30 days | 7 | Community-driven, inclusive sizing |
| **Vuori** | Performance | 8-10% | 30 days | 7 | West coast aesthetic, growing fast |
| **Tracksmith** | Running/Track | 10% | 30 days | 8 | Premium, niche, high AOV |

### 4.3 Jewelry & Accessories Affiliates (High Margin, Strong Fit)

| Brand | Category | Commission | Cookie | Fit Score | Price Range |
|-------|----------|------------|--------|-----------|-------------|
| **Gldn** | Minimalist Jewelry | 10-15% | 30 days | 9 | $30-200 |
| **Mejuri** | Fine Jewelry | 8-10% | 30 days | 7 | $50-500 |
| **Catbird** | Dainty Jewelry | 10% | 30 days | 8 | $50-300 |
| **Aurate** | Gold Jewelry | 10% | 30 days | 8 | $80-400 |
| **Miansai** | Men's Jewelry | 10-15% | 30 days | 9 | $60-400 |
| **CRAFTD** | Men's Jewelry | 15% | 30 days | 9 | $40-250 |
| **The Last Line** | Fine Jewelry | 10% | 30 days | 7 | $150-1000 |
| **Astrid & Miyu** | Trend Jewelry | 10% | 30 days | 8 | $30-200 |

### 4.4 Footwear Affiliates (Complementary, High AOV)

| Brand | Category | Commission | Cookie | Fit Score | Notes |
|-------|----------|------------|--------|-----------|-------|
| **Converse** | Classics | 5-8% | 7-30 days | 9 | Iconic, unisex, fits both aesthetics |
| **Vans** | Skate/Street | 5-8% | 30 days | 9 | Core streetwear, strong collab history |
| **Dr. Martens** | Boots | 8-10% | 30 days | 9 | Edgy, durable, "Horns" aesthetic |
| **Nike** | Performance/Lifestyle | 3-7% | 7 days | 6 | Low commission, but high conversion |
| **New Balance** | Lifestyle | 5-8% | 30 days | 8 | Dad shoe trend, premium collabs |
| **Hoka** | Performance | 8% | 30 days | 6 | Trending, but less street |
| **Crocs** | Casual | 8% | 30 days | 5 | Collab potential, polarizing |
| **Allbirds** | Sustainable | 8% | 30 days | 6 | Eco-angle, minimalist "Halos" fit |

### 4.5 Home & Art Affiliates (Lifestyle Extension)

| Brand | Category | Commission | Cookie | Fit Score | Price Range |
|-------|----------|------------|--------|-----------|-------------|
| **Society6** | Art Prints/Home | 10% | 30 days | 8 | Artist-driven, customizable |
| **Jungle** | Home Decor | 10% | 30 days | 7 | Curated, design-forward |
| **Coming Soon** | Art/Collectibles | 15% | 30 days | 9 | Limited drops, street art focus |
| **Superplastic** | Art Toys | 10-15% | 30 days | 9 | Janky/Guggimon, street culture |
| **Kidrobot** | Art Toys | 10% | 30 days | 8 | Dunny, street art heritage |
| **Museum of Modern Art Store** | Design | 5-8% | 30 days | 6 | Prestige, design credibility |

### 4.6 Affiliate Implementation Strategy

```json
{
  "affiliate_strategy": {
    "primary_network": "ShareASale",
    "secondary_network": "Impact",
    "creator_platform": "LTK",
    "tier_1_direct_brands": ["Gorilla Wear", "Born Primitive", "CRAFTD", "Miansai", "Dr. Martens", "Vans"],
    "tier_2_direct_brands": ["Ten Thousand", "Tracksmith", "Gldn", "Catbird", "Converse", "New Balance"],
    "commission_structure": {
      "own_products": "0% (direct sales)",
      "affiliate_products": "15-30% commission",
      "bundled_affiliate": "Stacked commission + bundle discount"
    },
    "tracking": {
      "utm_parameters": "source=affiliate&medium=referral&campaign={{brand}}_{{product}}",
      "postback_url": "https://hornshalos.com/affiliate/postback",
      "attribution_window": "30_days"
    },
    "content_strategy": {
      "lookbook_integration": "Tag affiliate products in lifestyle shots",
      "bundle_pages": "Curated 'Complete the Look' with affiliate items",
      "email_flows": "Post-purchase: 'Style your Horns tee with...'",
      "social": "Link in bio via LTK/Collective Voice"
    }
  }
}
```

---

## 5. COMPLEMENTARY BRAND PRODUCTS — WHOLESALE / MARGIN ANALYSIS

### 5.1 Selection Criteria
- **Price Range:** $25–300 retail
- **Margin Target:** 2.2–2.5x wholesale (55–60% gross margin)
- **Brand Alignment:** Horns/Halos duality, streetwear-adjacent, unisex
- **Quality:** Premium materials, ethical production
- **Exclusivity:** Not in every door, limited distribution

### 5.2 Recommended Complementary Products (10)

| # | Brand | Product | Category | Retail | Est. Wholesale | Margin % | MOQ | Fit Notes |
|---|-------|---------|----------|--------|----------------|----------|-----|-----------|
| 1 | **CRAFTD** | Cuban Link Chain (3mm, 20") | Jewelry | $125 | $55 | 56% | 12 pcs | Men's jewelry, "Horns" aesthetic, lifetime warranty |
| 2 | **Gldn** | Custom Initial Necklace | Jewelry | $68 | $30 | 56% | 24 pcs | Personalization, "Halos" minimal, female demo expansion |
| 3 | **Miansai** | Cable Cuff Bracelet | Jewelry | $185 | $80 | 57% | 6 pcs | Premium men's, industrial aesthetic, giftable |
| 4 | **Dr. Martens** | 1460 Pascal Boot | Footwear | $170 | $85 | 50% | 18 pairs | Iconic, "Horns" rebellion, year-round seller |
| 5 | **Vans** | Vault OG Style 36 LX | Footwear | $110 | $52 | 53% | 24 pairs | Premium Vans line, skater heritage, unisex |
| 6 | **Superplastic** | Janky SuperPlastic (Series 1) | Art Toy | $65 | $28 | 57% | 12 pcs | Street art culture, collectible, social content gold |
| 7 | **Coming Soon** | Limited Art Print (18x24") | Home/Art | $85 | $35 | 59% | 10 pcs | Artist collabs, "Duality" theme, framed upsell |
| 8 | **The Last Line** | Evil Eye Protection Necklace | Jewelry | $245 | $110 | 55% | 6 pcs | Symbolic protection, bridges Horns/Halos, high AOV |
| 9 | **Nike** | ACG "Arctic Wolf" Beanie | Headwear | $45 | $20 | 56% | 36 pcs | Technical outdoor, "Halos" utility, co-branded credibility |
| 10 | **Society6** | Artist Throw Blanket (50x60") | Home | $98 | $42 | 57% | 15 pcs | Artist designs, lifestyle extension, gifting |

### 5.3 Wholesale Terms Negotiation Points

```json
{
  "negotiation_framework": {
    "standard_terms": {
      "payment": "Net 30 (target Net 45-60 for new accounts)",
      "minimum_order": "$500-750 opening, $250 reorder",
      "reorder_minimum": "$150",
      "shipping": "FOB their warehouse, free freight at $1500+",
      "returns": "Damaged/defective only, no sale-or-return",
      "exclusivity": "Geographic (zip radius) or channel (no Amazon)"
    },
    "leverage_points": [
      "Multi-brand commitment (10 brands = volume)",
      "DTC only (no Amazon/3rd party marketplace)",
      "Marketing support: email features, lookbook inclusion, social tags",
      "Data sharing: sell-through reports quarterly",
      "Pre-order commitments for seasonal drops",
      "Bundle exclusivity: 'Horns & Halos x Brand' curated sets"
    ],
    "margin_protection": [
      "MAP enforcement required",
      "No unauthorized discounting",
      "Clearance coordination (90-day notice)",
      "Price increase notice: 60 days minimum"
    ]
  }
}
```

### 5.4 Inventory Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| **Dead stock** | Start with 4-6 week supply, reorder on 2-week lead time |
| **Size fragmentation** | Jewelry/accessories: one-size; Footwear: pre-pack runs only |
| **Seasonality** | Boot/beanie orders placed 5 months ahead; Tees/jewelry year-round |
| **Brand dilution** | Curated edit (3-5 SKUs/brand), not full catalog |
| **Cash flow** | Consignment for art toys/prints; Net 60 on established brands |
| **Quality issues** | Inspection at receipt, 2% damage allowance, photo claims within 48h |

### 5.5 Projected Category Contribution (Year 1)

| Category | Units/Month | Avg Retail | Monthly Rev | Gross Margin | Annual Contribution |
|----------|-------------|------------|-------------|--------------|---------------------|
| Jewelry | 85 | $145 | $12,325 | 56% | $82,872 |
| Footwear | 45 | $140 | $6,300 | 51% | $38,556 |
| Art/Collectibles | 35 | $82 | $2,870 | 58% | $19,975 |
| Home | 25 | $98 | $2,450 | 57% | $16,758 |
| Headwear (branded) | 60 | $42 | $2,520 | 56% | $16,934 |
| **TOTAL** | **250** | **$106** | **$26,465** | **55.5%** | **$175,095** |

---

## 6. IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1-2)
- [ ] Create all 8 collections with handles above
- [ ] Set up smart collections (new arrivals, sale, under $50, by type)
- [ ] Configure tag schema in Shopify Admin → Products → Tags
- [ ] Create 10 product metafields (materials_care, sizing_fit, shipping_info, lifestyle_images, size_chart, model_specs, bundle_products, collection_theme, drop_season, is_reversible, hidden_features)
- [ ] Set up main-menu, footer-menu, mobile-menu navigation
- [ ] Configure URL redirects for legacy/SEO

### Phase 2: Product Pages (Week 2-3)
- [ ] Install/configure Dawn 2.0+ or premium theme (Impulse, Prestige, Warehouse)
- [ ] Build product page sections per schema above
- [ ] Create size chart metafield templates per product type
- [ ] Upload model spec photography (3 models per collection: S/M/L)
- [ ] Set up Judge.me reviews app + import any existing reviews
- [ ] Configure Shop Pay, Apple Pay, Google Pay
- [ ] Test sticky ATC on mobile/desktop

### Phase 3: Conversion Features (Week 3-4)
- [ ] Build size confidence modal with fit predictor quiz
- [ ] Implement lifestyle gallery with UGC + Instagram feed (#HornsAndHalos)
- [ ] Configure bundles/upsell: manual bundles + FBT + Complete the Look
- [ ] Add trust signals bar (sticky or below ATC)
- [ ] Set up newsletter capture with 10% incentive (Klaviyo/Shopify Email)
- [ ] Configure abandoned cart flow (email + SMS)
- [ ] Set up post-purchase upsell (ReConvert or similar)

### Phase 4: Affiliate & Complementary (Week 4-6)
- [ ] Apply to ShareASale + Impact networks
- [ ] Apply to 6 Tier 1 direct brand programs
- [ ] Set up affiliate tracking (UTMs, postback, attribution)
- [ ] Negotiate wholesale terms with 10 complementary brands
- [ ] Place opening orders (target $5-7k initial buy)
- [ ] Create "Curated Brands" collection page
- [ ] Build bundle landing pages (Horns & Halos x Brand)
- [ ] Integrate LTK/Collective Voice for creator links

### Phase 5: Launch & Optimize (Week 6-8)
- [ ] QA all user flows: browse → PDP → cart → checkout → post-purchase
- [ ] Load test (Locust/k6) for drop days
- [ ] Configure analytics: GA4 enhanced ecommerce, Meta CAPI, TikTok Pixel
- [ ] Set up heatmaps (Hotjar/Mouseflow) on PDP
- [ ] A/B test: size guide placement, bundle position, badge wording
- [ ] Launch soft (email list only) → public
- [ ] Weekly optimization sprints (review heatmaps, session recordings, conversion data)

---

## 7. TECHNICAL SPECS FOR DEVELOPERS

### 7.1 Theme Customizations Needed
```liquid
<!-- sections/product-hero.liquid -->
<!-- Add: data-product-id, data-collection-theme, data-variant-images -->
<!-- Enable: 360 viewer block, video autoplay on hover -->

<!-- sections/size-confidence.liquid -->
<!-- Requires: product.metafields.custom.size_chart (JSON) -->
<!-- Requires: product.metafields.custom.model_specs (JSON) -->
<!-- JS: Fit predictor quiz (localStorage for return visitors) -->

<!-- sections/bundles-upsell.liquid -->
<!-- Uses: product.metafields.custom.bundle_products (list.product_reference) -->
<!-- Shopify Collective API for FBT -->
```

### 7.2 App Stack Recommendations
| Function | App | Cost | Notes |
|----------|-----|------|-------|
| Reviews | Judge.me | Free-$15/mo | Best value, photo reviews, Q&A |
| Bundles | Bundler / Wide Bundle | $0-29/mo | Volume discounts, mix & match |
| Upsell | ReConvert / AfterSell | $0-49/mo | Post-purchase, thank you page |
| Size Guide | Kiwi Sizing / Sizefox | $0-19/mo | Fit predictor, size recommender |
| UGC/Instagram | Foursixty / Covet.pics | $0-49/mo | Shoppable Instagram feed |
| Affiliate | UpPromote / Refersion | $0-89/mo | Run own affiliate program |
| Email/SMS | Klaviyo | Free-$150/mo | Flows, segmentation, predictive |
| Analytics | Triple Whale / Northbeam | $100-500/mo | Attribution, LTV, creative analytics |
| Heatmaps | Hotjar / Mouseflow | $0-99/mo | Session recordings, funnels |
| Page Speed | NitroPack / TinyIMG | $0-50/mo | Core Web Vitals optimization |

---

## 8. KPI TARGETS (First 90 Days)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Conversion Rate** | 3.5%+ | Shopify Analytics |
| **Mobile Conversion** | 3.0%+ | Segmented by device |
| **AOV (Own Products)** | $85+ | Orders / Revenue |
| **AOV (w/ Affiliate/Bundle)** | $125+ | Orders with upsell |
| **Attach Rate (Bundles)** | 22% | Units per transaction |
| **Size Guide Usage** | 40%+ of PDP sessions | Event tracking |
| **Return Rate** | <12% | Shopify Returns |
| **Email Capture Rate** | 8%+ of sessions | Klaviyo forms |
| **Affiliate Revenue Share** | 15% of total | Affiliate dashboard |
| **Complementary Sell-Through** | 60% in 90 days | Inventory reports |

---

*End of Shopify Setup Checklist — Horns & Halos*