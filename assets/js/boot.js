/* Runs in <head>, before anything is painted, so the page never flashes the
   wrong colours. Reads data/site.js — which has already loaded by this point. */

(function () {
  'use strict';

  var site = window.SITE || {};
  var theme = site.theme || {};
  var root = document.documentElement;

  // Brand colours from data/site.js.
  if (theme.accent)  root.style.setProperty('--accent', theme.accent);
  if (theme.accent2) root.style.setProperty('--accent-2', theme.accent2);

  // Light or dark: whatever the visitor last chose, else the site default.
  var saved = null;
  try { saved = localStorage.getItem('ed-mode'); } catch (e) {}
  root.dataset.mode = saved || theme.defaultMode || 'dark';

  // Favicon, so it too comes from data/site.js.
  if (site.images && site.images.favicon) {
    var icon = document.createElement('link');
    icon.rel = 'icon';
    icon.href = site.images.favicon;
    document.head.appendChild(icon);
  }
})();
