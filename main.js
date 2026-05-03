(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  var smoother;
  var header = document.getElementById('header');
  var mobileToggle = document.getElementById('mobileMenuToggle');
  var mobileOptions = document.getElementById('mobileOptions');
  var lastScroll = 0;
  var isMobile = false;

  function checkMobile() {
    isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
    return isMobile;
  }

  function initSmoother() {
    if (smoother) smoother.kill();
    checkMobile();
    smoother = ScrollSmoother.create({
      wrapper: '.smooth-wrapper',
      content: '.smooth-content',
      smooth: isMobile ? 0 : 2,
      effects: !isMobile,
      normalizeScroll: !isMobile,
    });
  }

  function updateHeader() {
    var scroll = smoother
      ? smoother.scrollTop()
      : window.scrollY || document.documentElement.scrollTop;

    if (scroll > lastScroll) {
      header.classList.add('hidden');
    } else if (scroll < lastScroll) {
      header.classList.remove('hidden');
    }
    lastScroll = scroll <= 0 ? 0 : scroll;
  }

  gsap.ticker.add(updateHeader);

  if (mobileToggle && mobileOptions) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileOptions.classList.toggle('shown');
    });
  }

  function initTextPin() {
    var container = document.getElementById('galleryContainer');
    var title = document.getElementById('titleWrapper');
    if (!container || !title) return;

    var titleHeight = title.offsetHeight;
    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: function (self) {
        var maxScroll = container.offsetHeight - titleHeight;
        gsap.set(title, { y: self.progress * maxScroll });
      },
    });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      initSmoother();
    }, 300);
  });

  window.addEventListener('beforeunload', function () {
    if (smoother) smoother.kill();
    gsap.ticker.remove(updateHeader);
  });

  function init() {
    initSmoother();
    initTextPin();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
