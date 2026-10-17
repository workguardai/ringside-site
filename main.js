(function () {
  var cfg = window.RINGSIDE_CONFIG || {};
  var isSet = function (v) { return typeof v === 'string' && v.trim() !== '' && v.trim().charAt(0) !== '['; };

  /* ---------- Languages (English in the HTML, others in i18n.js) ---------- */
  var I18N = window.RINGSIDE_I18N || {};
  var LANGS = ['en', 'es', 'da', 'sq', 'fi'];
  var EN = {
    '_title': document.title,
    '_desc': document.querySelector('meta[name="description"]').content,
    '_wa': "Hi, I'd like a free review from Ringside.",
    '_subject': 'Ringside free review',
    '_fName': 'Name', '_fBusiness': 'Business / website', '_fContact': 'Contact'
  };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  nodes.forEach(function (n) { n.dataset.en = n.innerHTML; });
  var select = document.querySelector('[data-lang-select]');
  var lang = 'en';
  function t(key) { return (lang !== 'en' && I18N[lang] && I18N[lang][key]) || EN[key]; }

  function setLang(next) {
    lang = LANGS.indexOf(next) > -1 ? next : 'en';
    document.documentElement.lang = lang;
    var dict = I18N[lang] || {};
    nodes.forEach(function (n) {
      var key = n.getAttribute('data-i18n');
      n.innerHTML = lang !== 'en' && dict[key] ? dict[key] : n.dataset.en;
    });
    document.title = t('_title');
    document.querySelector('meta[name="description"]').content = t('_desc');
    select.value = lang;
    store.set('ringside-lang', lang);
    refreshLinks();
  }

  /* ---------- Contact links ---------- */
  var waBase = isSet(cfg.whatsappNumber) ? 'https://wa.me/' + cfg.whatsappNumber.replace(/\D/g, '') : null;
  var mailTo = isSet(cfg.email) ? cfg.email : '';
  function waLink() { return waBase ? waBase + '?text=' + encodeURIComponent(t('_wa')) : '#contact'; }
  function refreshLinks() {
    document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
      a.href = waLink();
      if (!waBase) { a.removeAttribute('target'); a.setAttribute('aria-disabled', 'true'); a.title = '[WHATSAPP NUMBER] not set yet'; }
    });
    var review = isSet(cfg.reviewLink) ? cfg.reviewLink : (waBase ? waLink() : '#contact');
    document.querySelectorAll('[data-review-link]').forEach(function (a) {
      a.href = review;
      if (/^https?:/.test(review)) { a.target = '_blank'; a.rel = 'noopener'; }
    });
    document.querySelectorAll('[data-email-link]').forEach(function (a) {
      a.href = mailTo ? 'mailto:' + mailTo + '?subject=' + encodeURIComponent(t('_subject')) : '#contact-form';
    });
  }

  var urlLang = new URLSearchParams(location.search).get('lang');
  var browser = (navigator.language || '').slice(0, 2).toLowerCase();
  setLang(urlLang || store.get('ringside-lang') || (LANGS.indexOf(browser) > -1 ? browser : 'en'));
  select.addEventListener('change', function () { setLang(select.value); });

  /* ---------- Contact form: mailto (no backend) ---------- */
  var form = document.getElementById('contact-form');
  var err = form.querySelector('.form-error');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var name = (d.get('name') || '').trim(), contact = (d.get('contact') || '').trim(), msg = (d.get('message') || '').trim();
    if (!name || !contact || !msg) { err.hidden = false; return; }
    err.hidden = true;
    var body = [
      t('_fName') + ': ' + name,
      t('_fBusiness') + ': ' + (d.get('business') || '').trim(),
      t('_fContact') + ': ' + contact,
      '',
      msg
    ].join('\n');
    var subject = t('_subject') + ': ' + name;
    var to = mailTo;
    track('generate_lead', { method: 'mailto_form' });
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  /* ---------- Analytics: GA4 only after consent (consent mode v2, basic) ---------- */
  var banner = document.querySelector('.cookie-banner');
  var gaOn = isSet(cfg.ga4Id);
  var loaded = false;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function loadGA() {
    if (loaded || !gaOn) return;
    loaded = true;
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4Id);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', cfg.ga4Id);
  }
  function track(name, params) { if (loaded) gtag('event', name, params || {}); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.hasAttribute('data-whatsapp')) track('contact_whatsapp');
    else if (a.hasAttribute('data-review-link')) track('cta_review_click');
    else if (a.hasAttribute('data-email-link')) track('contact_email');
  });

  function setConsent(value) {
    store.set('ringside-consent', value);
    banner.hidden = true;
    if (value === 'granted') loadGA();
    else if (loaded) gtag('consent', 'update', { analytics_storage: 'denied' });
  }
  var consent = store.get('ringside-consent');
  if (gaOn) {
    if (consent === 'granted') loadGA();
    else if (!consent) banner.hidden = false;
  }
  banner.querySelectorAll('[data-consent]').forEach(function (b) {
    b.addEventListener('click', function () { setConsent(b.getAttribute('data-consent')); });
  });
  document.querySelector('[data-cookie-settings]').addEventListener('click', function () { banner.hidden = false; });
  if (new URLSearchParams(location.search).get('cookies') === '1') banner.hidden = false;

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
