/**
 * Language switcher for the top-right nav.
 * Default language is English (no URL prefix); Traditional Chinese lives
 * under the /zh-TW prefix. Clicking the button jumps to the counterpart
 * page in the other language, falling back to that language's home page
 * when no translation exists (e.g. English-only IELTS posts).
 */
(function () {
  'use strict';

  var ZH_PREFIX = '/zh-TW';

  function currentLang() {
    var p = location.pathname;
    return p === ZH_PREFIX || p.indexOf(ZH_PREFIX + '/') === 0 ? 'zh-TW' : 'en';
  }

  function homePath(lang) {
    return lang === 'zh-TW' ? ZH_PREFIX + '/' : '/';
  }

  // The same page's URL in the target language.
  function targetPath(lang) {
    var path = location.pathname;
    if (lang === 'zh-TW') {
      return path === '/' ? ZH_PREFIX + '/' : ZH_PREFIX + path;
    }
    return path.replace(/^\/zh-TW/, '') || '/';
  }

  function exists(url) {
    return fetch(url, { method: 'HEAD' })
      .then(function (res) { return res.ok; })
      .catch(function () { return false; });
  }

  function switchTo(lang) {
    var candidate = targetPath(lang);
    var home = homePath(lang);
    if (candidate === home) {
      location.href = home;
      return;
    }
    exists(candidate).then(function (ok) {
      location.href = ok ? candidate : home;
    });
  }

  // The button advertises the language you can switch TO: its flag + label.
  // English -> United Kingdom flag, Traditional Chinese -> Taiwan flag.
  function targetMeta() {
    return currentLang() === 'zh-TW'
      ? { lang: 'en', flag: 'gb', text: 'EN' }
      : { lang: 'zh-TW', flag: 'tw', text: '中文' };
  }

  function build() {
    var menus = document.getElementById('menus');
    if (!menus || document.getElementById('lang-switch')) return;

    var meta = targetMeta();
    var a = document.createElement('a');
    a.id = 'lang-switch';
    a.className = 'site-page lang-switch-btn';
    a.href = 'javascript:void(0);';
    a.setAttribute('aria-label', 'Switch language');
    a.title = currentLang() === 'zh-TW' ? 'Switch to English' : '切換為繁體中文';
    a.innerHTML = '<span class="fi fi-' + meta.flag + '"></span>' +
      '<span class="lang-switch-text">' + meta.text + '</span>';
    a.addEventListener('click', function () {
      switchTo(meta.lang);
    });

    var toggle = document.getElementById('toggle-menu');
    if (toggle) menus.insertBefore(a, toggle);
    else menus.appendChild(a);
  }

  document.addEventListener('DOMContentLoaded', build);
  // Butterfly navigates with pjax; the nav is re-rendered each time.
  document.addEventListener('pjax:complete', build);
})();
