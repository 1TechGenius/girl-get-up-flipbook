document.addEventListener('DOMContentLoaded', function () {
  const flipbook = new St.PageFlip(document.getElementById('flipbook-container'), {
    width: 600,
    height: 800,
    size: 'stretch',
    minWidth: 315,
    maxWidth: 1000,
    minHeight: 400,
    maxHeight: 1536,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: false
  });

  flipbook.loadFromPDF('./pdf/Girl-Get-Up-Flipbook.pdf');
});
