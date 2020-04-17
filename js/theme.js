/* globals chrome */

(function themee() {
  const theme = document.createElement(`link`);
  theme.rel = `stylesheet`;
  document.head.prepend(theme);

  chrome.storage.local.get([`options`], keys => {
    theme.href = `/bootstrap-4.4/css/sb-admin-2.min.css`;

    chrome.storage.onChanged.addListener(changes => {
      if (changes.options) {
        theme.href = `/bootstrap-4.4/css/sb-admin-2.min.css`;
      }
    });
  });
})();
