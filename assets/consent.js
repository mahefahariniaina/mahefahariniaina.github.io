/* ─────────────────────────────────────────────────────────────
   CONSENTEMENT COOKIES — Mahefa Tech
   Google Analytics n'est chargé QUE si l'utilisateur a accepté.
   Aucun traceur, aucun cookie tiers avant le clic sur « Accepter ».
   Choix mémorisé 6 mois dans localStorage (recommandation CNIL).
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var KEY = 'mt-consent';
  var GA_ID = 'G-RZXF0QJC58';
  var MAX_AGE_DAYS = 180; // le consentement est redemandé après 6 mois

  /* ── Stockage ────────────────────────────────────────────── */
  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      var ageDays = (Date.now() - new Date(data.date).getTime()) / 86400000;
      if (isNaN(ageDays) || ageDays > MAX_AGE_DAYS) {
        window.localStorage.removeItem(KEY);
        return null;
      }
      return data.value === 'granted' ? 'granted' : 'denied';
    } catch (e) {
      return null; // navigation privée ou stockage bloqué
    }
  }

  function save(value) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({
        value: value,
        date: new Date().toISOString()
      }));
    } catch (e) {}
  }

  /* ── Analytics ───────────────────────────────────────────── */
  function loadAnalytics() {
    if (window.__mtAnalytics) return;
    window.__mtAnalytics = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* Supprime les cookies de mesure déjà déposés (visiteurs venus avant la mise
     en place du bandeau, ou changement d'avis) : refuser doit avoir un effet réel. */
  function clearAnalyticsCookies() {
    var host = window.location.hostname;
    var domains = ['', host, '.' + host];
    var parts = host.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));

    document.cookie.split(';').forEach(function (chunk) {
      var name = chunk.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  /* ── Bandeau ─────────────────────────────────────────────── */
  function removeBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) el.parentNode.removeChild(el);
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;

    var box = document.createElement('div');
    box.id = 'cookie-banner';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', 'Consentement à la mesure d’audience');
    box.innerHTML =
      '<div class="cb-text">' +
        '<strong>Mesure d’audience</strong>' +
        '<p>J’utilise Google Analytics pour savoir quelles pages vous sont utiles. ' +
        'Aucun traceur n’est déposé sans votre accord, et refuser ne change rien à votre navigation. ' +
        '<a href="/politique-confidentialite/">En savoir plus</a></p>' +
      '</div>' +
      '<div class="cb-actions">' +
        '<button type="button" class="cb-btn" data-choice="denied">Refuser</button>' +
        '<button type="button" class="cb-btn" data-choice="granted">Accepter</button>' +
      '</div>';

    document.body.appendChild(box);

    box.addEventListener('click', function (e) {
      var btn = e.target.closest('.cb-btn');
      if (!btn) return;
      var choice = btn.getAttribute('data-choice');
      save(choice);
      removeBanner();
      if (choice === 'granted') loadAnalytics();
      else clearAnalyticsCookies();
    });

    requestAnimationFrame(function () { box.classList.add('cb-visible'); });
  }

  /* ── Point d'entrée ──────────────────────────────────────── */
  function init() {
    var state = read();
    if (state === 'granted') loadAnalytics();
    else if (state === null) showBanner();
    else clearAnalyticsCookies(); // 'denied' : rien n'est chargé, et on purge les résidus
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Permet de revenir sur son choix (lien « Cookies » du pied de page
     et bouton sur la politique de confidentialité) — exigence RGPD :
     retirer son consentement doit être aussi simple que le donner. */
  window.mtOpenConsent = function () {
    try { window.localStorage.removeItem(KEY); } catch (e) {}
    removeBanner();
    showBanner();
  };
})();
