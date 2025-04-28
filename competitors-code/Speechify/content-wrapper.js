(async () => {
  const src = (globalThis.browser ?? chrome).runtime.getURL('content/main.js');
  await import(src);
})();
