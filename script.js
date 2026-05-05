// ── Beams canvas animation (Hero) ──
(function () {
  const canvas = document.getElementById('beams-canvas');
  const ctx    = canvas.getContext('2d');
  const N = 8;

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeBeam(i) {
    const hw  = canvas.width * .5;
    const col = i % 2;
    const sw  = hw / 2;
    return {
      x:       col * sw + sw / 2 + rand(-sw * .4, sw * .4),
      y:       rand(canvas.height * .1, canvas.height * 1.1),
      w:       rand(40, 110),
      len:     canvas.height * 2.8,
      angle:   rand(-40, -20),
      speed:   rand(0.25, 0.7),
      opacity: rand(0.06, 0.15),
      hue:     rand(218, 248),
      pulse:   rand(0, Math.PI * 2),
      pSpeed:  rand(0.01, 0.022),
    };
  }

  let beams = [];
  function init() { beams = Array.from({ length: N }, (_, i) => makeBeam(i)); }

  function draw(b) {
    const op = b.opacity * (0.8 + 0.2 * Math.sin(b.pulse));
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle * Math.PI / 180);
    const g = ctx.createLinearGradient(0, 0, 0, b.len);
    g.addColorStop(0,   `hsla(${b.hue},80%,65%,0)`);
    g.addColorStop(.2,  `hsla(${b.hue},80%,65%,${op})`);
    g.addColorStop(.72, `hsla(${b.hue},80%,65%,${op * .4})`);
    g.addColorStop(1,   `hsla(${b.hue},80%,65%,0)`);
    ctx.fillStyle = g;
    ctx.filter    = 'blur(40px)';
    ctx.fillRect(-b.w / 2, 0, b.w, b.len);
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    beams.forEach((b, i) => {
      b.y     -= b.speed;
      b.pulse += b.pSpeed;
      if (b.y + b.len < 0) {
        const hw  = canvas.width * .5;
        const col = i % 2;
        const sw  = hw / 2;
        b.x       = col * sw + sw / 2 + rand(-sw * .4, sw * .4);
        b.y       = canvas.height + rand(0, canvas.height * .2);
        b.w       = rand(40, 110);
        b.opacity = rand(0.04, 0.11);
      }
      draw(b);
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); tick();
})();

// ── Beams canvas animation (Context section) ──
(function () {
  const canvas = document.getElementById('context-beams');
  const ctx    = canvas.getContext('2d');
  const N = 6;

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function makeBeam(i) {
    const col = i % 2;
    const sw  = canvas.width / 2;
    return {
      x:       col * sw + sw / 2 + rand(-sw * .4, sw * .4),
      y:       rand(canvas.height * .1, canvas.height * 1.1),
      w:       rand(60, 140),
      len:     canvas.height * 2.8,
      angle:   rand(-40, -20),
      speed:   rand(0.2, 0.55),
      opacity: rand(0.08, 0.23),
      hue:     rand(218, 248),
      pulse:   rand(0, Math.PI * 2),
      pSpeed:  rand(0.01, 0.022),
    };
  }

  let beams = [];
  function init() { beams = Array.from({ length: N }, (_, i) => makeBeam(i)); }

  function draw(b) {
    const op = b.opacity * (0.8 + 0.2 * Math.sin(b.pulse));
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle * Math.PI / 180);
    const g = ctx.createLinearGradient(0, 0, 0, b.len);
    g.addColorStop(0,   `hsla(${b.hue},80%,65%,0)`);
    g.addColorStop(.2,  `hsla(${b.hue},80%,65%,${op})`);
    g.addColorStop(.72, `hsla(${b.hue},80%,65%,${op * .4})`);
    g.addColorStop(1,   `hsla(${b.hue},80%,65%,0)`);
    ctx.fillStyle = g;
    ctx.filter    = 'blur(40px)';
    ctx.fillRect(-b.w / 2, 0, b.w, b.len);
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    beams.forEach((b, i) => {
      b.y     -= b.speed;
      b.pulse += b.pSpeed;
      if (b.y + b.len < 0) {
        const sw  = canvas.width / 2;
        const col = i % 2;
        b.x       = col * sw + sw / 2 + rand(-sw * .4, sw * .4);
        b.y       = canvas.height + rand(0, canvas.height * .2);
        b.w       = rand(40, 100);
        b.opacity = rand(0.03, 0.09);
      }
      draw(b);
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); tick();
})();

// ── Scroll fade-in ──
(function () {
  const els = document.querySelectorAll(
    '.number-card, .city-card, .context-main, .form-intro, .form-wrap, .about-content, .about-image'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transition = 'opacity .7s ease, transform .7s ease';
        e.target.style.opacity    = '1';
        e.target.style.transform  = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(22px)';
    io.observe(el);
  });
})();

// ── UTM capture + hidden fields ──
(function(){
  const HIDDEN_FIELDS = [
    "cf_click_id","cf_click_id_source","cf_source","cf_medium",
    "cf_campaign_name","cf_campaign_id","cf_adgroup_name","cf_adgroup_id",
    "cf_ad_name","cf_ad_id","cf_placement","cf_platform","cf_user_agent"
  ];

  const UTM_MAP = {
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
      input.closest('.elementor-field-group') ||
      input.closest('.rdstation-form__field') ||
      input.closest('.bricks-form__field') ||
      input.closest('.form-group') ||
      input.closest('p, div');
    if (wrapper) wrapper.style.display = 'none';
  }

  function hideAll(root) {
    HIDDEN_FIELDS.forEach(function(n) { hideFieldByName(n, root); });
  }

  function applyAll(root) {
    fillFields(root);
    hideAll(root);
  }

  function init() {
    saveToStorage();
    applyAll();

    var mo = new MutationObserver(function(muts) {
      muts.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (!(node instanceof HTMLElement)) return;
          if (
            node.matches('form, .elementor-form, .rdstation-form, .elementor-popup-modal') ||
            node.querySelector('form, .elementor-form, .rdstation-form, input[name]')
          ) {
            applyAll(node);
          }
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
