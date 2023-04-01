// sets the default replacement text once the Extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ replacementText: 'Pardot' });
});