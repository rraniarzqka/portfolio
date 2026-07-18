/* Rania Rizqika — portfolio interactions */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sticky nav border ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- scroll reveals ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- metric count-up ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 800;
    var start = null;

    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    /* rAF can be throttled in background tabs — guarantee the final value */
    setTimeout(function () {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
    }, duration + 150);
  }
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- case-study chart draw ---------- */
  var charts = document.querySelectorAll('.chart-line[data-draw]');
  if (charts.length) {
    charts.forEach(function (path) {
      var len = path.getTotalLength();
      if (reduceMotion) return;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var chio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var path = entry.target;
            path.style.transition = 'stroke-dashoffset 900ms ease-out';
            path.style.strokeDashoffset = '0';
            chio.unobserve(path);
          }
        });
      }, { threshold: 0.4 });
      charts.forEach(function (p) { chio.observe(p); });
    }
  }

  /* ---------- results carousel (auto-slide) ---------- */
  var carousel = document.getElementById('metricsCarousel');
  if (carousel) {
    var track = document.getElementById('carTrack');
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById('carDots');
    var prevBtn = document.getElementById('carPrev');
    var nextBtn = document.getElementById('carNext');
    var current = 0;
    var timer = null;
    var INTERVAL = 5000;

    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'car-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dots.forEach(function (d, j) {
        d.classList.toggle('active', j === current);
        d.setAttribute('aria-selected', j === current ? 'true' : 'false');
      });
      slides.forEach(function (s, j) {
        var active = j === current;
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
        Array.prototype.forEach.call(s.querySelectorAll('a'), function (a) {
          if (active) { a.removeAttribute('tabindex'); } else { a.setAttribute('tabindex', '-1'); }
        });
      });
    }

    function start() {
      if (reduceMotion || timer) return;
      timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
    }
    function stop() {
      clearInterval(timer);
      timer = null;
    }
    function restart() {
      stop();
      start();
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); restart(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); restart(); });

    /* pause while the visitor is reading or tabbing through */
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    /* swipe on touch devices */
    var touchX = null;
    track.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) {
        goTo(dx < 0 ? current + 1 : current - 1);
        restart();
      }
      touchX = null;
    }, { passive: true });

    /* don't advance while the tab is hidden */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    goTo(0);
    start();
  }

  /* ---------- contact form → mailto ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      var subject = encodeURIComponent('Intro call — ' + name);
      var body = encodeURIComponent(
        'Name: ' + name + '\nEmail: ' + email + '\n\nWhat I\'m trying to grow:\n' + message
      );
      window.location.href = 'mailto:raniarizqika@gmail.com?subject=' + subject + '&body=' + body;
    });
  }
})();
