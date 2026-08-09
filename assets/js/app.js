/* ============================================================================
   ElectroDonut Shop

   Builds the pages in the browser from the three files in data/.
   No build step, no server — every page is plain HTML that runs off disk.

   You shouldn't need to edit this file to run the shop. Edit data/*.js:
   every string, image, colour and on/off switch comes from data/site.js.
   ========================================================================== */

(function () {
  'use strict';

  var SITE = window.SITE || {};
  var CHANNELS = window.CHANNELS || [];
  var PRODUCTS = window.PRODUCTS || [];

  var TEXT = SITE.text || {};
  var CARD = SITE.card || {};
  var PAGE_OPTS = SITE.product || {};

  // Which colour each stock state uses. The words themselves come from
  // site.js -> text.stock so they can be reworded or translated.
  var STOCK_TONE = {
    in_stock: 'ok', low_stock: 'warn', sold_out: 'bad', preorder: 'info'
  };

  var page = (document.getElementById('main') || {}).dataset;
  page = page ? page.page : '';

  /* ---------------------------------------------------------- helpers --- */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* A string from site.js -> text. Returns "" when it's been blanked out,
     which is how a caller knows to leave that element out entirely. */
  function t(key) {
    var value = TEXT[key];
    return value == null ? '' : String(value);
  }

  /* True unless the setting is explicitly false, so a missing switch in an
     older site.js keeps the section visible rather than silently dropping it. */
  function on(options, key) {
    return options[key] !== false;
  }

  function inline(text) {
    return esc(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  }

  /* A deliberately small subset of Markdown: ## headings, - bullets,
     **bold**, `code`, [links](url), and blank-line-separated paragraphs. */
  function markdown(source) {
    var out = [], para = [], list = [];

    function flushPara() {
      if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; }
    }
    function flushList() {
      if (!list.length) return;
      out.push('<ul>' + list.map(function (item) {
        return '<li>' + inline(item) + '</li>';
      }).join('') + '</ul>');
      list = [];
    }

    String(source || '').replace(/\r/g, '').split('\n').forEach(function (raw) {
      var line = raw.trim();
      if (!line) { flushPara(); flushList(); return; }

      var heading = /^(#{2,3})\s+(.*)$/.exec(line);
      if (heading) {
        flushPara(); flushList();
        var level = heading[1].length;
        out.push('<h' + level + '>' + inline(heading[2]) + '</h' + level + '>');
        return;
      }

      var bullet = /^[-*]\s+(.*)$/.exec(line);
      if (bullet) { flushPara(); list.push(bullet[1]); return; }

      flushList();
      para.push(line);
    });

    flushPara();
    flushList();
    return out.join('');
  }

  function imageFor(product, index) {
    var images = product.images || [];
    if (!images.length) return (SITE.images || {}).placeholder || '';
    return 'assets/products/' + product.id + '/' + images[index || 0];
  }

  /* `category` accepts either one name or a list:
       category: "Tools"
       category: ["Tools", "Products"]
     Always returns an array so the rest of the code doesn't care which. */
  function categoriesOf(product) {
    var value = product.category;
    if (Array.isArray(value)) {
      return value.filter(function (name) { return !!name; });
    }
    return value ? [value] : [];
  }

  /* Stored on each card as "|Tools|Products|" so a filter can test for one
     name without "Tool" accidentally matching "Tools". */
  function categoryAttr(product) {
    var names = categoriesOf(product);
    return names.length ? '|' + names.join('|') + '|' : '';
  }

  function sharesCategory(a, b) {
    var mine = categoriesOf(b);
    return categoriesOf(a).some(function (name) {
      return mine.indexOf(name) !== -1;
    });
  }

  /* No `stock` line on a product means no label at all — same as every other
     optional field. Write stock: "in_stock" when you do want the green pill. */
  function stockLabel(product) {
    var key = product.stock;
    if (!key) return ['', 'ok'];
    return [(TEXT.stock || {})[key] || '', STOCK_TONE[key] || 'ok'];
  }

  /* Turn `links: {amazon: "B0XYZ"}` into full buy buttons using channels.js.
     A value starting with http(s) is used as-is and `base` is ignored. */
  function buttonsFor(product) {
    var buttons = [];

    CHANNELS.forEach(function (channel) {
      var value = (product.links || {})[channel.id];
      if (value == null || value === '') return;
      value = String(value);
      var url = /^(https?:\/\/|mailto:)/.test(value)
        ? value
        : (channel.base || '') + value;
      buttons.push({
        name: channel.name || channel.id,
        url: url,
        color: channel.color || '#888888',
        note: channel.note || '',
        price: (product.prices || {})[channel.id] || '',
        primary: !!channel.primary
      });
    });

    // Warn about a typo'd channel name rather than silently dropping it.
    Object.keys(product.links || {}).forEach(function (key) {
      var known = CHANNELS.some(function (c) { return c.id === key; });
      if (!known) {
        console.warn('[shop] product "' + product.id + '" links to unknown ' +
                     'channel "' + key + '" — add it to data/channels.js.');
      }
    });

    return buttons.sort(function (a, b) { return (b.primary ? 1 : 0) - (a.primary ? 1 : 0); });
  }

  function productHref(product) {
    return 'product.html?id=' + encodeURIComponent(product.id);
  }

  /* Links like "#products" have to jump back to the homepage from any other
     page, so prefix them everywhere except the homepage itself. */
  function navHref(href) {
    if (href.charAt(0) === '#' && page !== 'home') return 'index.html' + href;
    return href;
  }

  /* ------------------------------------------------------------ chrome --- */

  function renderHeader() {
    var host = document.querySelector('[data-header]');
    if (!host) return;
    var images = SITE.images || {};
    var brand = SITE.brand || {};

    host.innerHTML =
      '<div class="wrap header-inner">' +
        '<a class="brand" href="index.html" aria-label="' + esc(brand.name) + ' home">' +
          '<img src="' + esc(images.logo) + '" alt="" width="36" height="36">' +
          '<span>' + esc(brand.name) + '</span>' +
        '</a>' +
        '<nav class="nav" aria-label="Main">' +
          (SITE.nav || []).map(function (item) {
            return '<a href="' + esc(navHref(item.href)) + '">' + esc(item.text) + '</a>';
          }).join('') +
        '</nav>' +
        '<button class="mode-toggle" type="button" data-mode-toggle ' +
                'aria-label="Switch colour mode" title="Switch colour mode">' +
          '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true">' +
            '<circle cx="12" cy="12" r="4.5"/>' +
            '<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8' +
                    'M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>' +
          '</svg>' +
          '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>' +
          '</svg>' +
        '</button>' +
      '</div>';

    host.querySelector('[data-mode-toggle]').addEventListener('click', function () {
      var root = document.documentElement;
      var next = root.dataset.mode === 'dark' ? 'light' : 'dark';
      root.dataset.mode = next;
      try { localStorage.setItem('ed-mode', next); } catch (e) {}
    });
  }

  function renderFooter() {
    var host = document.querySelector('[data-footer]');
    if (!host) return;
    var brand = SITE.brand || {};
    var footer = SITE.footer || {};
    var images = SITE.images || {};

    host.innerHTML =
      '<div class="wrap footer-grid">' +
        '<div>' +
          '<a class="brand" href="index.html">' +
            '<img src="' + esc(images.logo) + '" alt="" width="32" height="32">' +
            '<span>' + esc(brand.name) + '</span>' +
          '</a>' +
          '<p class="muted">' + esc(brand.tagline) + '</p>' +
        '</div>' +
        '<div>' +
          (footer.contactTitle ? '<h3>' + esc(footer.contactTitle) + '</h3>' : '') +
          (footer.email
            ? '<p><a href="mailto:' + esc(footer.email) + '">' + esc(footer.email) + '</a></p>'
            : '') +
          '<ul class="plain">' +
            (footer.links || []).map(function (link) {
              return '<li><a href="' + esc(link.href) + '" target="_blank" ' +
                     'rel="noopener noreferrer">' + esc(link.text) + '</a></li>';
            }).join('') +
          '</ul>' +
        '</div>' +
        (footer.showChannels === true
          ? '<div>' +
              (footer.channelsTitle ? '<h3>' + esc(footer.channelsTitle) + '</h3>' : '') +
              '<ul class="plain">' +
                CHANNELS.map(function (channel) {
                  return '<li><span class="dot" style="background:' + esc(channel.color) +
                         '"></span>' + esc(channel.name) + '</li>';
                }).join('') +
              '</ul>' +
            '</div>'
          : '') +
      '</div>' +
      '<div class="wrap footer-bottom">' +
        (footer.note ? '<p class="muted small">' + esc(footer.note) + '</p>' : '') +
        (footer.copyright ? '<p class="muted small">&copy; ' + esc(footer.copyright) + '</p>' : '') +
      '</div>';
  }

  /* -------------------------------------------------------------- card --- */

  function cardHTML(product) {
    var stock = stockLabel(product);
    var buttons = buttonsFor(product);
    var search = [product.id, product.title, product.blurb]
      .concat(categoriesOf(product)).concat(product.tags || [])
      .join(' ').toLowerCase();

    var showFoot = on(CARD, 'showPrice') || on(CARD, 'showStock');

    return '' +
      '<article class="card" data-category="' + esc(categoryAttr(product)) + '" ' +
               'data-search="' + esc(search) + '">' +
        '<a class="card-media" href="' + productHref(product) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + esc(imageFor(product, 0)) + '" alt="" loading="lazy" width="400" height="300">' +
          (on(CARD, 'showBadge') && product.badge
            ? '<span class="badge">' + esc(product.badge) + '</span>' : '') +
          (on(CARD, 'showBadge') && product.was && t('saleBadge')
            ? '<span class="badge badge-sale">' + esc(t('saleBadge')) + '</span>' : '') +
        '</a>' +
        '<div class="card-body">' +
          '<h3><a href="' + productHref(product) + '">' + esc(product.title) + '</a></h3>' +
          (product.blurb ? '<p class="muted small">' + esc(product.blurb) + '</p>' : '') +
          (showFoot
            ? '<div class="card-foot">' +
                (on(CARD, 'showPrice')
                  ? '<p class="price">' + esc(product.price) +
                      (product.was ? ' <s class="muted">' + esc(product.was) + '</s>' : '') +
                    '</p>'
                  : '<span></span>') +
                (on(CARD, 'showStock') && stock[0]
                  ? '<span class="stock stock-' + stock[1] + '">' + esc(stock[0]) + '</span>'
                  : '') +
              '</div>'
            : '') +
          (on(CARD, 'showChannelDots') && buttons.length
            ? '<p class="channel-row">' +
                buttons.map(function (b) {
                  return '<span class="dot" style="background:' + esc(b.color) +
                         '" title="' + esc(b.name) + '"></span>';
                }).join('') +
                (t('waysToBuy')
                  ? '<span class="muted small">' + buttons.length + ' ' +
                    esc(t('waysToBuy')) + '</span>'
                  : '') +
              '</p>'
            : '') +
          (on(CARD, 'showCta') && t('cardCta')
            ? '<a class="btn btn-primary btn-block" href="' + productHref(product) + '">' +
              esc(t('cardCta')) + '</a>'
            : '') +
        '</div>' +
      '</article>';
  }

  /* ---------------------------------------------------------- homepage --- */

  function categoryList() {
    var filters = SITE.filters || {};
    if (filters.show === false) return [];

    if (Array.isArray(filters.categories)) return filters.categories.slice();

    // "auto" — collect them from the products, first-seen order. A product
    // listing several categories contributes each of them.
    var found = [];
    PRODUCTS.forEach(function (product) {
      categoriesOf(product).forEach(function (name) {
        if (found.indexOf(name) === -1) found.push(name);
      });
    });
    return found;
  }

  function renderHome() {
    var main = document.getElementById('main');
    var hero = SITE.hero || {};
    var sections = SITE.sections || {};
    var images = SITE.images || {};
    var brand = SITE.brand || {};
    var filters = SITE.filters || {};

    document.title = brand.name + ' — ' + brand.tagline;

    var categories = categoryList();

    main.innerHTML =
      '<section class="hero"><div class="wrap hero-inner">' +
        '<div class="hero-copy">' +
          (hero.eyebrow ? '<p class="eyebrow">' + esc(hero.eyebrow) + '</p>' : '') +
          '<h1>' + esc(hero.title) + '</h1>' +
          (hero.subtitle ? '<p class="lead">' + esc(hero.subtitle) + '</p>' : '') +
          '<div class="hero-actions">' +
            (hero.ctaText
              ? '<a class="btn btn-primary" href="' + esc(hero.ctaHref) + '">' +
                esc(hero.ctaText) + '</a>'
              : '') +
            (hero.secondaryText
              ? '<a class="btn btn-ghost" href="' + esc(hero.secondaryHref) + '">' +
                esc(hero.secondaryText) + '</a>'
              : '') +
          '</div>' +
        '</div>' +
        '<div class="hero-art" aria-hidden="true">' +
          '<img src="' + esc(images.hero) + '" alt="" width="520" height="440">' +
        '</div>' +
      '</div></section>' +

      ((SITE.highlights || []).length
        ? '<section class="wrap"><ul class="highlights">' +
            SITE.highlights.map(function (item) {
              return '<li><span class="hl-icon" aria-hidden="true"></span><div>' +
                     '<strong>' + esc(item.title) + '</strong>' +
                     '<span class="muted small">' + esc(item.text) + '</span>' +
                     '</div></li>';
            }).join('') +
          '</ul></section>'
        : '') +

      '<section class="wrap section" id="products">' +
        '<header class="section-head">' +
          (sections.productsTitle ? '<h2>' + esc(sections.productsTitle) + '</h2>' : '') +
          (sections.productsSubtitle
            ? '<p class="muted">' + esc(sections.productsSubtitle) + '</p>' : '') +
        '</header>' +
        '<div class="toolbar">' +
          (t('searchPlaceholder')
            ? '<div class="search">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                  '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
                '<input type="search" id="q" placeholder="' + esc(t('searchPlaceholder')) + '" ' +
                       'aria-label="Search products" autocomplete="off">' +
              '</div>'
            : '<span></span>') +
          (categories.length
            ? '<div class="chips" role="group" aria-label="Filter by category">' +
                (filters.allLabel
                  ? '<button class="chip is-active" data-filter="all" aria-pressed="true">' +
                    esc(filters.allLabel) + '</button>'
                  : '') +
                categories.map(function (cat, index) {
                  var active = !filters.allLabel && index === 0;
                  return '<button class="chip' + (active ? ' is-active' : '') + '" ' +
                         'data-filter="' + esc(cat) + '" ' +
                         'aria-pressed="' + active + '">' + esc(cat) + '</button>';
                }).join('') +
              '</div>'
            : '') +
        '</div>' +
        '<div class="grid" id="grid">' + PRODUCTS.map(cardHTML).join('') + '</div>' +
        '<p class="empty" id="empty" hidden>' + esc(t('noResults')) + '</p>' +
      '</section>' +

      (SITE.about
        ? '<section class="wrap section" id="about"><div class="about">' +
            '<h2>' + esc(SITE.about.title) + '</h2>' +
            '<p class="lead">' + esc(SITE.about.text) + '</p>' +
          '</div></section>'
        : '');

    bindFilters();
  }

  function bindFilters() {
    var grid = document.getElementById('grid');
    if (!grid) return;

    var input = document.getElementById('q');
    var empty = document.getElementById('empty');
    var chips = [].slice.call(document.querySelectorAll('.chip'));
    var cards = [].slice.call(grid.querySelectorAll('.card'));
    var active = chips.filter(function (c) { return c.classList.contains('is-active'); })[0];
    var category = active ? active.dataset.filter : 'all';

    function apply() {
      var term = ((input && input.value) || '').trim().toLowerCase();
      var shown = 0;

      cards.forEach(function (card) {
        var visible =
          (category === 'all' ||
           (card.dataset.category || '').indexOf('|' + category + '|') !== -1) &&
          (!term || card.dataset.search.indexOf(term) !== -1);
        card.hidden = !visible;
        if (visible) shown++;
      });

      if (empty) empty.hidden = shown !== 0;
    }

    if (input) input.addEventListener('input', apply);

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (other) {
          other.classList.toggle('is-active', other === chip);
          other.setAttribute('aria-pressed', String(other === chip));
        });
        category = chip.dataset.filter;
        apply();
      });
    });

    apply();
  }

  /* ----------------------------------------------------- product page --- */

  function renderProduct() {
    var main = document.getElementById('main');
    var id = new URLSearchParams(location.search).get('id');
    var product = PRODUCTS.filter(function (p) { return p.id === id; })[0];
    var brand = SITE.brand || {};

    if (!product) {
      document.title = (t('notFoundTitle') || 'Not found') + ' — ' + brand.name;
      main.innerHTML =
        '<section class="wrap section notfound">' +
          (t('notFoundEyebrow') ? '<p class="eyebrow">' + esc(t('notFoundEyebrow')) + '</p>' : '') +
          '<h1>' + esc(t('notFoundTitle')) + '</h1>' +
          (t('notFoundText') ? '<p class="lead">' + esc(t('notFoundText')) + '</p>' : '') +
          (t('notFoundCta')
            ? '<p><a class="btn btn-primary" href="index.html">' +
              esc(t('notFoundCta')) + '</a></p>'
            : '') +
        '</section>';
      return;
    }

    document.title = product.title + ' — ' + brand.name;
    var descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.setAttribute('content', product.blurb || '');

    var stock = stockLabel(product);
    var buttons = buttonsFor(product);
    var images = product.images || [];
    var showPrices = PAGE_OPTS.showPrices === true;
    var cats = categoriesOf(product);

    var related = [];
    if (on(PAGE_OPTS, 'showRelated')) {
      // Anything sharing at least one category counts as related.
      related = PRODUCTS.filter(function (p) {
        return p.id !== product.id && sharesCategory(p, product);
      });
      if (!related.length) {
        related = PRODUCTS.filter(function (p) { return p.id !== product.id; });
      }
      var count = PAGE_OPTS.relatedCount;
      related = related.slice(0, typeof count === 'number' ? count : 3);
    }

    main.innerHTML =
      (on(PAGE_OPTS, 'showBreadcrumb')
        ? '<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb">' +
            (t('breadcrumbHome')
              ? '<a href="index.html">' + esc(t('breadcrumbHome')) + '</a>' +
                '<span aria-hidden="true">/</span>'
              : '') +
            (cats.length
              ? '<a href="index.html#products">' + esc(cats[0]) + '</a>' +
                '<span aria-hidden="true">/</span>'
              : '') +
            '<span aria-current="page">' + esc(product.title) + '</span>' +
          '</nav></div>'
        : '') +

      '<section class="wrap product' +
        (on(PAGE_OPTS, 'showGallery') ? '' : ' product-nogallery') + '">' +

        (on(PAGE_OPTS, 'showGallery')
          ? '<div class="gallery">' +
              '<div class="gallery-main">' +
                '<img id="mainImage" src="' + esc(imageFor(product, 0)) + '" ' +
                     'alt="' + esc(product.title) + '" width="600" height="480">' +
              '</div>' +
              (images.length > 1
                ? '<div class="thumbs" role="group" aria-label="Product images">' +
                    images.map(function (file, index) {
                      var src = 'assets/products/' + product.id + '/' + file;
                      return '<button class="thumb' + (index === 0 ? ' is-active' : '') + '" ' +
                                     'data-full="' + esc(src) + '" ' +
                                     'aria-label="Show image ' + (index + 1) + '" ' +
                                     'aria-pressed="' + (index === 0) + '">' +
                               '<img src="' + esc(src) + '" alt="" width="80" height="64" loading="lazy">' +
                             '</button>';
                    }).join('') +
                  '</div>'
                : '') +
            '</div>'
          : '') +

        '<div class="buy">' +
          '<div class="buy-head">' +
            (cats.length
              ? '<p class="eyebrow">' + esc(cats.join(' · ')) + '</p>' : '') +
            '<h1>' + esc(product.title) + '</h1>' +
            (product.blurb ? '<p class="lead">' + esc(product.blurb) + '</p>' : '') +
            (on(PAGE_OPTS, 'showPrice') || on(PAGE_OPTS, 'showStock')
              ? '<p class="price price-lg">' +
                  (on(PAGE_OPTS, 'showPrice')
                    ? esc(product.price) +
                      (product.was ? ' <s class="muted">' + esc(product.was) + '</s>' : '')
                    : '') +
                  (on(PAGE_OPTS, 'showStock') && stock[0]
                    ? '<span class="stock stock-' + stock[1] + '">' + esc(stock[0]) + '</span>'
                    : '') +
                '</p>'
              : '') +
          '</div>' +

          '<div class="buy-box">' +
            (buttons.length
              ? (t('buyTitle') ? '<h2 class="buy-title">' + esc(t('buyTitle')) + '</h2>' : '') +
                (on(PAGE_OPTS, 'showBuyIntro') && t('buyIntro')
                  ? '<p class="muted small">' + esc(t('buyIntro')) + '</p>' : '') +
                '<ul class="buy-list">' +
                  buttons.map(function (b) {
                    return '<li><a class="buy-btn' + (b.primary ? ' is-primary' : '') + '" ' +
                           'href="' + esc(b.url) + '" target="_blank" rel="noopener noreferrer" ' +
                           'style="--ch:' + esc(b.color) + '">' +
                             '<span class="buy-btn-main">' +
                               '<span class="buy-btn-name">' + esc(b.name) + '</span>' +
                               (on(PAGE_OPTS, 'showChannelNotes') && b.note
                                 ? '<span class="buy-btn-note">' + esc(b.note) + '</span>' : '') +
                             '</span>' +
                             (showPrices && b.price
                               ? '<span class="buy-btn-price">' + esc(b.price) + '</span>' : '') +
                             '<svg class="buy-btn-arrow" viewBox="0 0 24 24" aria-hidden="true">' +
                               '<path d="M7 17 17 7M9 7h8v8"/></svg>' +
                             '<span class="sr-only">(opens in a new tab)</span>' +
                           '</a></li>';
                  }).join('') +
                '</ul>'
              : (t('noLinks') ? '<p class="muted">' + esc(t('noLinks')) + '</p>' : '')) +
          '</div>' +

          (on(PAGE_OPTS, 'showSpecs') && product.specs
            ? '<div class="specs">' +
                (t('specsTitle') ? '<h2>' + esc(t('specsTitle')) + '</h2>' : '') +
                '<dl>' +
                  Object.keys(product.specs).map(function (key) {
                    return '<div><dt>' + esc(key) + '</dt><dd>' +
                           esc(product.specs[key]) + '</dd></div>';
                  }).join('') +
                '</dl>' +
              '</div>'
            : '') +
        '</div>' +
      '</section>' +

      (on(PAGE_OPTS, 'showDescription') && product.description
        ? '<section class="wrap section"><div class="prose">' +
            markdown(product.description) + '</div></section>'
        : '') +

      (related.length
        ? '<section class="wrap section">' +
            (t('relatedTitle')
              ? '<header class="section-head"><h2>' + esc(t('relatedTitle')) + '</h2></header>'
              : '') +
            '<div class="grid">' + related.map(cardHTML).join('') + '</div>' +
          '</section>'
        : '') +

      (on(PAGE_OPTS, 'showStickyBuy') && buttons.length && t('stickyBuyCta')
        ? '<div class="sticky-buy" data-sticky-buy>' +
            '<div><strong>' + esc(product.title) + '</strong>' +
            (on(PAGE_OPTS, 'showPrice')
              ? '<span class="muted small">' + esc(product.price) + '</span>' : '') +
            '</div>' +
            '<a class="btn btn-primary" href="#" data-scroll-to-buy>' +
              esc(t('stickyBuyCta')) + '</a>' +
          '</div>'
        : '');

    bindGallery();
    bindStickyBuy();
  }

  function bindGallery() {
    var main = document.getElementById('mainImage');
    var thumbs = [].slice.call(document.querySelectorAll('.thumb'));
    if (!main || !thumbs.length) return;

    function show(thumb) {
      main.src = thumb.dataset.full;
      thumbs.forEach(function (other) {
        other.classList.toggle('is-active', other === thumb);
        other.setAttribute('aria-pressed', String(other === thumb));
      });
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () { show(thumb); });
      thumb.addEventListener('keydown', function (event) {
        var step = event.key === 'ArrowRight' ? 1
                 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        event.preventDefault();
        var next = thumbs[(index + step + thumbs.length) % thumbs.length];
        next.focus();
        show(next);
      });
    });
  }

  function bindStickyBuy() {
    var bar = document.querySelector('[data-sticky-buy]');
    var box = document.querySelector('.buy-box');
    if (!bar || !box || !('IntersectionObserver' in window)) return;

    new IntersectionObserver(function (entries) {
      // Only show the bar once the real buy buttons have scrolled away.
      bar.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(box);

    var jump = bar.querySelector('[data-scroll-to-buy]');
    if (jump) {
      jump.addEventListener('click', function (event) {
        event.preventDefault();
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  /* -------------------------------------------------------------- boot --- */

  renderHeader();
  renderFooter();
  if (page === 'home') renderHome();
  if (page === 'product') renderProduct();
})();
