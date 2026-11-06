/* Applies saved theme before first paint (no flash). Default = dark. */
(function () {
  var t = 'dark';
  try { t = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch (e) {}
  document.documentElement.setAttribute('data-theme', t);
})();
