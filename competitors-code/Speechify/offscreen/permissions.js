document.body.onclick = () => {
  chrome.permissions.request({
    permissions: ['offscreen'],
  });
};
