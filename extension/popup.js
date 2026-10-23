document.getElementById('btn-fill').addEventListener('click', async () => {
  const statusEl = document.getElementById('status-msg');
  statusEl.innerText = 'Filling form fields...';
  statusEl.style.color = '#34D399';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      statusEl.innerText = 'No active tab detected.';
      statusEl.style.color = '#F87171';
      return;
    }

    // First try sending message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'run_autofill' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        // If content script was not already loaded, inject it dynamically
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }, () => {
          if (chrome.runtime.lastError) {
            statusEl.innerText = 'Cannot run on this page (' + chrome.runtime.lastError.message + ')';
            statusEl.style.color = '#F87171';
          } else {
            statusEl.innerText = 'Auto-filled successfully!';
            statusEl.style.color = '#34D399';
            setTimeout(() => window.close(), 1500);
          }
        });
      } else {
        statusEl.innerText = 'Populated ' + response.count + ' fields successfully!';
        statusEl.style.color = '#34D399';
        setTimeout(() => window.close(), 1500);
      }
    });
  } catch (err) {
    statusEl.innerText = 'Error: ' + err.message;
    statusEl.style.color = '#F87171';
  }
});
