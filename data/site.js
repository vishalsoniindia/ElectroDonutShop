/* ============================================================================
   SITE SETTINGS — branding, images, colours, and every word on the site.
   Everything about how the site LOOKS or READS lives in this file.

   Editing rules: keep the quotes, keep the commas between entries.
   Save the file, refresh the browser. That's the whole workflow.

   ANY text set to ""  hides that element.
   ANY toggle set to false  hides that section.
   ========================================================================== */

window.SITE = {

  brand: {
    name: "ElectroDonut",
    tagline: "Sweet hardware for makers.",
    // Full public address of the site, once you have one. Leave "" until then.
    url: ""
  },

  // --------------------------------------------------------------------
  //  IMAGES — drop a new file into assets/images/ and change the name
  //  here. Nothing else needs touching. .svg .png .jpg .webp all work.
  // --------------------------------------------------------------------
  images: {
    logo:        "assets/images/logo.svg",        // header + footer mark
    favicon:     "assets/images/favicon.svg",     // browser tab icon
    hero:        "assets/images/hero.svg",        // big homepage image
    ogImage:     "assets/images/og-image.svg",    // preview when shared
    placeholder: "assets/images/placeholder.svg"  // when a product has no photo
  },

  // --------------------------------------------------------------------
  //  COLOURS — change these two and the whole site re-themes.
  // --------------------------------------------------------------------
  theme: {
    accent:      "#FF3D7F",  // buttons, links, highlights
    accent2:     "#22D3EE",  // glows, secondary accents
    defaultMode: "dark"      // "dark" or "light" — visitors can still toggle
  },

  // --------------------------------------------------------------------
  //  HOMEPAGE HERO
  // --------------------------------------------------------------------
  hero: {
    eyebrow: "Hand-built in small batches",
    title: "Hardware that doesn't fight back.",
    subtitle: "Tools, boards and kits for people who'd rather be building " +
              "than debugging their toolchain. Buy from whichever shop you " +
              "already trust.",
    ctaText: "Browse the shop",
    ctaHref: "#products",
    secondaryText: "How we work",   // set to "" to remove the second button
    secondaryHref: "#about"
  },

  sections: {
    productsTitle: "Everything we make",
    productsSubtitle: "Pick a product, then pick where you'd like to buy it."
  },

  // --------------------------------------------------------------------
  //  TRUST STRIP under the hero.
  //  Add or delete entries freely. Set to [] to hide the whole strip.
  // --------------------------------------------------------------------
  highlights: [
    {
      title: "Ships worldwide",
      text: "Via whichever marketplace is closest to you."
    }
  ],

  // --------------------------------------------------------------------
  //  CATEGORY FILTER BUTTONS on the homepage.
  //
  //  categories: "auto"  builds the list from the `category` of each
  //  product, in the order they first appear in products.js.
  //
  //  To control the order yourself, or to show only some of them, replace
  //  it with a list:      categories: ["Tools", "Boards"]
  //
  //  Set show: false to hide the filter buttons entirely.
  // --------------------------------------------------------------------
  filters: {
    show: true,
    allLabel: "All",
    categories: "auto"
  },

  // --------------------------------------------------------------------
  //  HEADER NAV — add or delete entries freely.
  // --------------------------------------------------------------------
  nav: [
    { text: "Products", href: "#products" },
    { text: "About",    href: "#about" },
    { text: "Contact",  href: "#contact" }
  ],

  // --------------------------------------------------------------------
  //  ABOUT BLOCK on the homepage. Set to null to hide the section.
  // --------------------------------------------------------------------
  about: {
    title: "Who's behind this",
    text: "ElectroDonut is a one-person workshop. Every board is assembled, " +
          "flashed and tested by hand before it goes in a box. Small batches, " +
          "checked twice, and shipped only when they're right."
  },

  // --------------------------------------------------------------------
  //  FOOTER
  // --------------------------------------------------------------------
  footer: {
    contactTitle: "Get in touch",
    email: "robotheproject@gmail.com",
    // The list of sales channels used to be repeated down here. Set this
    // to true to bring that column back.
    showChannels: false,
    channelsTitle: "Where to buy",
    note: "Prices shown are guides — the shop you click through to is the " +
          "source of truth.",
    links: [
      { text: "GitHub",    href: "https://github.com/vishalsoniindia" },
      { text: "YouTube",   href: "https://www.youtube.com/vishalsoniindia" },
      { text: "Instagram", href: "https://www.instagram.com/electrodonut" }
    ],
    copyright: "ElectroDonut"
  },

  // --------------------------------------------------------------------
  //  PRODUCT CARDS in the grid. Turn any part off.
  // --------------------------------------------------------------------
  card: {
    showBadge: true,        // "New" / "Best seller" / "Sale"
    showPrice: true,
    showStock: false,        // "In stock" / "Only a few left"
    showChannelDots: true,  // the little coloured dots + "3 ways to buy"
    showCta: true           // the "View buying options" button
  },

  // --------------------------------------------------------------------
  //  PRODUCT PAGE. Turn any section off.
  // --------------------------------------------------------------------
  product: {
    showBreadcrumb: true,
    showGallery: true,
    showPrice: true,
    showStock: false,
    showBuyIntro: true,     // the explaining line above the buy buttons
    showChannelNotes: true, // "Fast Prime delivery" under each button
    showSpecs: true,
    showDescription: true,
    showRelated: true,
    relatedCount: 3,
    showStickyBuy: true,    // the bar that follows you on phones

    // Show a per-shop price on each buy button. The prices come from the
    // `prices` block of each product in products.js — they are typed by
    // you, not fetched. See the README for why live prices aren't possible
    // on a site with no server.
    showPrices: false
  },

  // --------------------------------------------------------------------
  //  EVERY OTHER WORD ON THE SITE.
  //  Set any of these to "" to hide that piece of text.
  // --------------------------------------------------------------------
  text: {
    // homepage
    searchPlaceholder: "Search products…",
    noResults: "Nothing matched that. Try a different search.",
    cardCta: "View buying options",
    waysToBuy: "ways to buy",          // reads as "3 ways to buy"

    // product page
    breadcrumbHome: "Shop",
    buyTitle: "Buying options",
    buyIntro: "",
    noLinks: "No buying options are listed for this product yet.",
    specsTitle: "Specifications",
    relatedTitle: "You might also like",
    stickyBuyCta: "Buy",

    // when someone opens a product that doesn't exist
    notFoundEyebrow: "Not found",
    notFoundTitle: "We don't have that one.",
    notFoundText: "The product you asked for isn't in the catalogue. " +
                  "It may have been renamed or discontinued.",
    notFoundCta: "See everything we make",

    // stock labels — the keys are the `stock` values used in products.js
    stock: {
      in_stock:  "In stock",
      low_stock: "Only a few left",
      sold_out:  "Sold out",
      preorder:  "Pre-order"
    },

    saleBadge: "Sale"
  }

};
