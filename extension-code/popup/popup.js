// This script could potentially interact with the background script
// to get status or trigger actions, but is minimal for MVP.
console.log("Popup script loaded.");

document.addEventListener('DOMContentLoaded', () => {
  // Example: Get status from background (requires message handling in background.js)
  // chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
  //   const statusElement = document.querySelector('p:nth-of-type(2)');
  //   if (statusElement && response) {
  //     statusElement.textContent = `Status: ${response.status || 'Idle'}`;
  //   }
  // });
}); 