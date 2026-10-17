(function () {
  var LANGS = ['en', 'es', 'da', 'sq', 'fi'];
  var BACK = { en: '← Back to Ringside', es: '← Volver a Ringside', da: '← Tilbage til Ringside', sq: '← Kthehu te Ringside', fi: '← Takaisin Ringsideen' };
  var LABEL = { en: 'Language', es: 'Idioma', da: 'Sprog', sq: 'Gjuha', fi: 'Kieli' };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var select = document.querySelector('[data-lang-select]');
  var blocks = document.querySelectorAll('[data-lang-block]');
  function setLang(next) {
    var lang = LANGS.indexOf(next) > -1 ? next : 'en';
    document.documentElement.lang = lang;
    blocks.forEach(function (b) {
      var on = b.getAttribute('data-lang-block') === lang;
      b.hidden = !on;
      if (on) document.title = b.getAttribute('data-title');
    });
    select.value = lang;
    select.previousElementSibling.textContent = LABEL[lang];
    var back = document.querySelector('[data-back]');
    back.textContent = BACK[lang];
    back.href = '/?lang=' + lang;
    store.set('ringside-lang', lang);
  }
  var urlLang = new URLSearchParams(location.search).get('lang');
  var browser = (navigator.language || '').slice(0, 2).toLowerCase();
  setLang(urlLang || store.get('ringside-lang') || (LANGS.indexOf(browser) > -1 ? browser : 'en'));
  select.addEventListener('change', function () { setLang(select.value); });
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
