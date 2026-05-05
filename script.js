// ── Detecta mobile para desativar canvas (principal causa do TBT) ──
var IS_MOBILE = window.innerWidth <= 768;

// ── Beams canvas animation (Hero) — desktop only ──
(function () {
  if (IS_MOBILE) return; // não roda canvas no mobile

  var canvas = document.getElementById('beams-canvas');
  var ctx    = canvas.getContext('2d');
  var N      = 8;
  var running = true;
  var rafId   = null;
  var W = 0, H = 0;

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function resize() {
    // lê dimensões sem forçar reflow — usa clientWidth
    W = document.documentElement.clientWidth;
    H = document.documentElement.clientHeight;
    canvas.width  = W;
    canvas.height = H;
  }

  function makeBeam(i) {
    var hw  = W * .5;
    var col = i % 2;
    var sw  = hw / 2;
    return {
      x:       col * sw + sw / 2 + rand(-sw * .4, sw * .4),
      y:       rand(H * .1, H * 1.1),
      w:       rand(40, 110),
      len:     H * 2.8,
      angle:   rand(-40, -20),
      speed:   rand(0.25, 0.7),
      opacity: rand(0.06, 0.15),
      hue:     rand(218, 248),
      pulse:   rand(0, Math.PI * 2),
      pSpeed:  rand(0.01, 0.022),
    };
  }

  var beams = [];
  function init() {
    resize();
    beams = Array.from({ length: N }, function(_, i) { return makeBeam(i); });
  }

  function draw(b) {
    var op = b.opacity * (0.8 + 0.2 * Math.sin(b.pulse));
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle * Math.PI / 180);
    var g = ctx.createLinearGradient(0, 0, 0, b.len);
    g.addColorStop(0,   'hsla(' + b.hue + ',80%,65%,0)');
    g.addColorStop(.2,  'hsla(' + b.hue + ',80%,65%,' + op + ')');
    g.addColorStop(.72, 'hsla(' + b.hue + ',80%,65%,' + (op * .4) + ')');
    g.addColorStop(1,   'hsla(' + b.hue + ',80%,65%,0)');
    ctx.fillStyle = g;
    ctx.filter    = 'blur(40px)';
    ctx.fillRect(-b.w / 2, 0, b.w, b.len);
    ctx.restore();
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    beams.forEach(function(b, i) {
      b.y     -= b.speed;
      b.pulse += b.pSpeed;
      if (b.y + b.len < 0) {
        var hw  = W * .5;
        var col = i % 2;
        var sw  = hw / 2;
        b.x       = col * sw + sw / 2 + rand(-sw * .4, sw * .4);
        b.y       = H + rand(0, H * .2);
        b.w       = rand(40, 110);
        b.opacity = rand(0.04, 0.11);
      }
      draw(b);
    });
    rafId = requestAnimationFrame(tick);
  }

  // Pausa quando hero sai da viewport
  var heroObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      running = e.isIntersecting;
      if (running && !rafId) { rafId = requestAnimationFrame(tick); }
      if (!running && rafId) { cancelAnimationFrame(rafId); rafId = null; }
    });
  }, { threshold: 0 });
  heroObs.observe(document.getElementById('hero'));

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() { init(); }, 200);
  });

  init();
  rafId = requestAnimationFrame(tick);
})();

// ── Beams canvas animation (Context) — desktop only ──
(function () {
  if (IS_MOBILE) return; // não roda canvas no mobile

  var canvas  = document.getElementById('context-beams');
  var ctx     = canvas.getContext('2d');
  var N       = 6;
  var running = false;
  var rafId   = null;
  var W = 0, H = 0;

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
  }

  function makeBeam(i) {
    var col = i % 2;
    var sw  = W / 2;
    return {
      x:       col * sw + sw / 2 + rand(-sw * .4, sw * .4),
      y:       rand(H * .1, H * 1.1),
      w:       rand(60, 140),
      len:     H * 2.8,
      angle:   rand(-40, -20),
      speed:   rand(0.2, 0.55),
      opacity: rand(0.08, 0.23),
      hue:     rand(218, 248),
      pulse:   rand(0, Math.PI * 2),
      pSpeed:  rand(0.01, 0.022),
    };
  }

  var beams = [];
  function init() {
    resize();
    beams = Array.from({ length: N }, function(_, i) { return makeBeam(i); });
  }

  function draw(b) {
    var op = b.opacity * (0.8 + 0.2 * Math.sin(b.pulse));
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle * Math.PI / 180);
    var g = ctx.createLinearGradient(0, 0, 0, b.len);
    g.addColorStop(0,   'hsla(' + b.hue + ',80%,65%,0)');
    g.addColorStop(.2,  'hsla(' + b.hue + ',80%,65%,' + op + ')');
    g.addColorStop(.72, 'hsla(' + b.hue + ',80%,65%,' + (op * .4) + ')');
    g.addColorStop(1,   'hsla(' + b.hue + ',80%,65%,0)');
    ctx.fillStyle = g;
    ctx.filter    = 'blur(40px)';
    ctx.fillRect(-b.w / 2, 0, b.w, b.len);
    ctx.restore();
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    beams.forEach(function(b, i) {
      b.y     -= b.speed;
      b.pulse += b.pSpeed;
      if (b.y + b.len < 0) {
        var col = i % 2;
        var sw  = W / 2;
        b.x       = col * sw + sw / 2 + rand(-sw * .4, sw * .4);
        b.y       = H + rand(0, H * .2);
        b.w       = rand(40, 100);
        b.opacity = rand(0.03, 0.09);
      }
      draw(b);
    });
    rafId = requestAnimationFrame(tick);
  }

  var ctxObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !running) {
        running = true;
        if (beams.length === 0) init();
        rafId = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && running) {
        running = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    });
  }, { threshold: 0 });
  ctxObs.observe(document.getElementById('context'));

  init();
})();

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
