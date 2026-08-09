# ElectroDonut Shop

A product catalogue that runs on GitHub Pages for free. It doesn't take
payments — each product shows a row of buttons that send the customer to
wherever you actually sell it (your own store, Amazon, Tindie, WhatsApp…).

**No build step. No server. No installing anything.** Double-click
`index.html` and it opens. Edit a file, refresh the browser, done.

---

## Where everything is

```
index.html          the shop front page       ← double-click this
product.html        the product detail page
404.html
data/
  site.js           branding, ALL images, colours, every piece of text
  channels.js       where you sell — the one place a link ever changes
  products.js       your products
assets/
  images/           logo · favicon · hero · social preview · placeholder
  products/         one folder per product, named after its id
  css/ js/          stylesheet and the code that draws the pages
```

You only ever edit the three files in `data/`.

---

## How buy-links work

A buy button's URL is built from two halves:

```
channels.js   base:   "https://www.amazon.com/dp/"
products.js   links:   amazon: "B0EXAMPLE1"
                              ↓
              https://www.amazon.com/dp/B0EXAMPLE1
```

That split is the whole point. If your store moves to a new domain, or a
marketplace changes its URL format, you edit **one line** in `channels.js`
and every product on the site follows.

Two extras:

- If a value in `products.js` starts with `http`, it's used exactly as written
  and `base` is ignored. Use it for one-off links that don't fit the pattern.
- A product that doesn't list a channel simply doesn't show that button. No
  placeholder, no dead link.

---

## Adding a product

1. Open `data/products.js`, copy one `{ … }` block including its trailing comma.
2. Change the values.
3. Put photos in `assets/products/<your-product-id>/` and list the filenames
   under `images`.
4. Save, refresh the browser.

The `id` becomes the page address: `id: "esp32-cloner-pro"` is reachable at
`product.html?id=esp32-cloner-pro`. **Don't change an id once you've shared
the link** — it will break.

Descriptions go between backticks so they can span lines, and understand a
little Markdown: `## heading`, `- bullet`, `**bold**`, `` `code` ``, and a
blank line to start a new paragraph.

### The one editing rule

These are JavaScript files, so **keep the quotes and keep the commas between
entries**. If the page comes up blank after an edit, that's almost always a
missing comma or quote. Press `F12` in the browser and read the red line in
the Console — it names the file and line number.

---

## Changing the look

All of it lives in `data/site.js`:

- **Logo, favicon, hero, social preview, placeholder** — drop a new file into
  `assets/images/` and change the filename in `images`. `.svg`, `.png`,
  `.jpg` and `.webp` all work.
- **Colours** — change `theme.accent` and `theme.accent2`. The whole site
  re-themes from those two values, in both light and dark mode.
- **All the text** — every word on the site is under `text:`, plus the hero,
  section headings, about block, footer and nav. **Set any string to `""` and
  that element disappears.**

The images shipped here are placeholders drawn as SVG. Swap them for real
photos when you have them.

Two exceptions that can't come from `site.js`:

- **Social link previews.** The crawlers that generate them don't run
  JavaScript, so the `og:` tags are written by hand near the top of
  `index.html`. Edit those four lines once. Most networks also won't render an
  SVG preview — export a **1200×630 PNG** as `assets/images/og-image.png` and
  point the tag at it.
- **The `<title>` you see before the page loads.** It's set in each HTML file
  and then replaced by JavaScript.

---

## Turning things on and off

Three blocks in `data/site.js` control what appears. Every switch is
`true` or `false`.

**`card:`** — the product tiles in the grid: `showBadge`, `showPrice`,
`showStock`, `showChannelDots`, `showCta`.

**`product:`** — the product page: `showBreadcrumb`, `showGallery`,
`showPrice`, `showStock`, `showBuyIntro`, `showChannelNotes`, `showSpecs`,
`showDescription`, `showRelated` (with `relatedCount`), `showStickyBuy`,
`showPrices`.

**`footer:`** — `showChannels` brings back the "Where to buy" column.

Anything not covered by a switch is controlled by emptying its text, or by
leaving the field out of a product. A product with no `specs` shows no specs
table; one with no `description` shows no description; `highlights: []` hides
the trust strip; `about: null` hides the about section.

### The category buttons — All / Tools / Boards / Kits

They aren't a fixed list. By default they're built from the `category` of each
product in `products.js`:

```js
filters: {
  show: true,
  allLabel: "All",
  categories: "auto"
}
```

- **Add one** — give a product a new `category`, e.g. `category: "Cables"`.
  The button appears by itself.
- **Put one product in several categories** — use a list instead of a single
  name: `category: ["Tools", "Products"]`. It then shows under every one of
  those filters, and counts as related to products in any of them.
- **Remove one** — remove or rename that category on every product using it.
- **Control the order, or show only some** — replace `"auto"` with a list:
  `categories: ["Boards", "Tools"]`. Products in other categories still show
  under **All**.
- **Remove the "All" button** — set `allLabel: ""`. The first category is then
  selected on load.
- **Hide the filter bar entirely** — `show: false`.

---

## Why prices can't update themselves

Short answer: **no, not on a site like this.** Three separate reasons, and all
three would have to be solved:

1. **No server.** The page is just files. There's nothing running that could
   go and look a price up.
2. **The browser blocks it.** Even with JavaScript, a page on your domain
   can't read a page on `amazon.com` — that's the same-origin policy, and it
   isn't something you can switch off.
3. **The shops don't allow it.** Scraping prices is against Amazon's and
   AliExpress's terms of service, and their page structure changes constantly,
   so anything built on it breaks without warning.

What you get instead is a **manual price per shop**, which covers the actual
goal — showing that your own store is cheapest:

```js
// in products.js, alongside links:
prices: {
  mystore: "$49",
  amazon:  "$54",
  tindie:  "$52"
}
```

Switch them on with `product.showPrices: true` in `site.js`. Off by default,
because a wrong price is worse than none.

If live prices ever really matter, the honest routes are an official
affiliate API (Amazon's Product Advertising API — requires an approved
affiliate account) or a scheduled job on a real server that writes the numbers
into `products.js`. Both are a big step up in complexity from a folder of
files. Ask me if you want to go there.

---

## Putting it online

No Actions, no workflow, no build. Just push the files.

1. Create a repository on GitHub and push this folder to it.
2. **Settings → Pages → Build and deployment → Source → Deploy from a branch**
3. Pick branch `main`, folder `/ (root)`. Save.

It's live at `https://<username>.github.io/<repo-name>/` within a minute.
Every later change goes live as soon as you push it.

`.nojekyll` in the root tells GitHub to publish the files exactly as they
are — leave it there.

### Custom domain

Create a file called `CNAME` in the root containing just your domain, then set
it under **Settings → Pages → Custom domain**.

---

## Working offline

Everything is relative and every page is a real `.html` file, so the site runs
identically from a `file://` address, a USB stick, or a zipped folder you
email to someone. No web server anywhere.

One small difference off a server: some browsers block `localStorage` on
`file://`, so the dark/light choice may not carry from page to page. It still
toggles, and it works normally once hosted.

---

## The trade-off worth knowing

The pages are assembled in the browser, which is what removes the build step.
The cost is that **the site needs JavaScript** — with it switched off, a
visitor sees a short message instead of the catalogue. Google does run
JavaScript when it indexes, so the products will still be found, but it's less
certain than plain HTML would be.

For a catalogue that funnels people out to marketplaces, that's a fair trade.
If search ranking ever becomes the priority, the fix is to generate real HTML
files for each product — say the word and I'll set that up.
