// Java OOP Hub — course page interactivity
// Progress state is kept in memory only (resets on reload) so this works
// safely both in a browser preview and once hosted on GitHub Pages.

(function () {
  const total = document.querySelectorAll('[data-sheet]').length;
  const done = new Set();

  const progressFill = document.getElementById('progressFill');
  const progressCount = document.getElementById('progressCount');

  function updateProgress() {
    const pct = total ? (done.size / total) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressCount) progressCount.textContent = done.size;
  }

  document.querySelectorAll('[data-sheet-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-sheet-btn');
      const sheet = document.querySelector(`[data-sheet="${id}"]`);
      const navCheck = document.querySelector(`[data-check="${id}"]`);

      if (done.has(id)) {
        done.delete(id);
        btn.textContent = 'MARK DONE';
        btn.classList.remove('is-done');
        sheet && sheet.classList.remove('done');
        navCheck && navCheck.classList.remove('done');
      } else {
        done.add(id);
        btn.textContent = '✓ DONE';
        btn.classList.add('is-done');
        sheet && sheet.classList.add('done');
        navCheck && navCheck.classList.add('done');
      }
      updateProgress();
    });
  });

  updateProgress();

  // Highlight the active topic in the sidebar as the user scrolls
  const navLinks = document.querySelectorAll('.nav-link');
  const sheets = document.querySelectorAll('.sheet');

  if ('IntersectionObserver' in window && sheets.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('data-target') === id);
            });
          }
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );
    sheets.forEach((sheet) => navObserver.observe(sheet));

    // Reveal each sheet with a soft fade/slide as it scrolls into view
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    sheets.forEach((sheet) => revealObserver.observe(sheet));
  } else {
    // No IntersectionObserver support — just show everything
    sheets.forEach((sheet) => sheet.classList.add('in-view'));
  }

  // Back-to-top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 600);
    });
  }
})();
