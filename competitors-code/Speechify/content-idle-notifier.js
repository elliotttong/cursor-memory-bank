globalThis.idleDidFire = true;
window.postMessage({ event: 'idle' });
