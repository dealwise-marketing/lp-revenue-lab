// ── Scroll fade-in ──
(function () {
  var els = document.querySelectorAll(
    '.number-card, .city-card, .context-main, .form-intro, .form-wrap, .about-content, .about-image'
  );
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.style.transition = 'opacity .7s ease, transform .7s ease';
        e.target.style.opacity    = '1';
        e.target.style.transform  = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(function(el) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(22px)';
    io.observe(el);
  });
})();

// ── UTM capture + hidden fields ──
(function(){
  var HIDDEN_FIELDS = [
    "cf_click_id","cf_click_id_source","cf_source","cf_medium",
    "cf_campaign_name","cf_campaign_id","cf_adgroup_name","cf_adgroup_id",
    "cf_ad_name","cf_ad_id","cf_placement","cf_platform","cf_user_agent"
  ];

  var UTM_MAP = {
    'utm_source':   'cf_source',
    'utm_medium':   'cf_medium',
    'utm_campaign': 'cf_campaign_name',
    'campaign_id':  'cf_campaign_id',
    'adgroup_name': 'cf_adgroup_name',
    'adgroup_id':   'cf_adgroup_id',
    'ad_name':      'cf_ad_name',
    'ad_id':        'cf_ad_id',
    'placement':    'cf_placement',
    'platform':     'cf_platform',
  };

  function getUrlParam(name) {
    var r = new RegExp('[?&]' + name.replace(/[[\]]/g,'\\$&') + '=([^&#]*)').exec(location.search);
    return r ? decodeURIComponent(r[1].replace(/\+/g,' ')) : '';
  }

  function saveToStorage() {
    Object.keys(UTM_MAP).forEach(function(param) {
      var val = getUrlParam(param);
      if (val) localStorage.setItem(param, val);
    });
    var fbclid = getUrlParam('fbclid');
    var gclid  = getUrlParam('gclid');
    if (fbclid) {
      localStorage.setItem('click_id', fbclid);
      localStorage.setItem('click_id_source', 'meta');
    } else if (gclid) {
      localStorage.setItem('click_id', gclid);
      localStorage.setItem('click_id_source', 'google');
    } else if (!localStorage.getItem('click_id')) {
      localStorage.setItem('click_id_source', 'organico');
    }
    localStorage.setItem('user_agent', navigator.userAgent);
  }

  function fillFields(root) {
    root = root || document;
    Object.keys(UTM_MAP).forEach(function(param) {
      var val = localStorage.getItem(param);
      if (!val) return;
      root.querySelectorAll('input[name="' + UTM_MAP[param] + '"]').forEach(function(el) {
        el.value = val;
      });
    });
    [
      ['click_id',        'cf_click_id'],
      ['click_id_source', 'cf_click_id_source'],
      ['user_agent',      'cf_user_agent'],
    ].forEach(function(pair) {
      var val = localStorage.getItem(pair[0]);
      if (!val) return;
      root.querySelectorAll('input[name="' + pair[1] + '"]').forEach(function(el) {
        el.value = val;
      });
    });
  }

  function hideFieldByName(name, root) {
    root = root || document;
    var input = root.querySelector('input[name="' + name + '"]');
    if (!input) return;
    try { input.type = 'hidden'; } catch(e) {
      input.style.cssText += ';position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none';
    }
    if (input.id) {
      var lbl = root.querySelector('label[for="' + CSS.escape(input.id) + '"]');
      if (lbl) lbl.style.display = 'none';
    }
    var p = input.parentElement;
    if (p && p.tagName === 'LABEL') p.style.display = 'none';
    var wrapper =
      input.closest('.rdstation-form__field') ||
      input.closest('.bricks-form__field') ||
      input.closest('.form-group') ||
      input.closest('p, div');
    if (wrapper) wrapper.style.display = 'none';
  }

  function hideAll(root) {
    HIDDEN_FIELDS.forEach(function(n) { hideFieldByName(n, root); });
  }

  function applyAll(root) { fillFields(root); hideAll(root); }

  function init() {
    saveToStorage();
    applyAll();
    var mo = new MutationObserver(function(muts) {
      muts.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (!(node instanceof HTMLElement)) return;
          if (
            node.matches('form, .rdstation-form') ||
            node.querySelector('form, .rdstation-form, input[name]')
          ) { applyAll(node); }
        });
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setInterval(function() { applyAll(); }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
