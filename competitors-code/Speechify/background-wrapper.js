(async () => {
  const src = (globalThis.browser ?? chrome).runtime.getURL('background/main.js');
  await import(src);
})();
