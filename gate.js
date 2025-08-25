(function () {
  // Google checker (yours)
  var API = 'https://script.google.com/macros/s/AKfycbyl5s0gYso8Yz3Q3-RbpK_z--GR12PwGuVYP01sIXIDCXjB17PrGFRDx7DfuUT1lSXc/exec';

  // Open viewer even if the old gate compares against a fixed ACCESS_CODE
  function unlockDirect() {
    try { if (typeof window.hideGate === 'function') window.hideGate(); } catch (e) {}
    try { if (typeof window.initPDFCanvas === 'function') window.initPDFCanvas(); } catch (e) {}
    try { if (typeof window.openBook === 'function') window.openBook(); } catch (e) {}
  }

  function unlockWithCode(code) {
    // Preferred: use your existing gate if it succeeds
    try {
      if (typeof window.tryUnlock === 'function' && window.tryUnlock(String(code))) return;
    } catch (e) {}
    // Fallback: bypass and open
    unlockDirect();
  }

  function proceed(token) {
    fetch(API + '?token=' + encodeURIComponent(token))
      .then(r => r.json())
      .then(d => {
        if (!d || !d.ok) return;

        // Fill the UI for consistency
        try {
          var input = document.getElementById('code_input') ||
                      document.querySelector('input[placeholder="Access code"]');
          if (input) {
            input.value = String(d.code || '');
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
          var btn = document.getElementById('unlock_btn') ||
                    Array.from(document.querySelectorAll('button, input[type="submit"], [role="button"]'))
                      .find(el => (el.textContent || el.value || '').trim().toLowerCase() === 'unlock');
          if (btn) setTimeout(() => btn.click(), 120);
        } catch (e) {}

        // Actually open
        unlockWithCode(d.code);
      })
      .catch(() => {});
  }

  function getToken() {
    var t = new URLSearchParams(location.search).get('token');
    if (t) return t;
    try { return new URLSearchParams(new URL(document.referrer).search).get('token'); } catch (e) {}
  }

  // Run when ready
  window.addEventListener('load', function () {
    var t = getToken();
    if (t) proceed(t);
  });

  // Also accept token pushed from host page
  window.addEventListener('message', function (ev) {
    if (ev.data && ev.data.type === 'GBA_TOKEN' && ev.data.token) proceed(ev.data.token);
  });
})();
