(async () => {
  const src = (globalThis.browser ?? chrome).runtime.getURL('iframes/main.js');
  await import(src);
})();
