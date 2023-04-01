function replaceText(node, replacementText) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.includes("Account Engagement")) {
        node.textContent = node.textContent.replace(/Account Engagement/g, replacementText);
      } 
      else if(!node.textContent.includes(replacementText)) {
        node.textContent = replacementText +' ' + node.textContent;
      }
    } else {
      for (let child of node.childNodes) {
        replaceText(child, replacementText);
      }
    }
  }
  
  function applyReplacement(replacementText) {
    const targetTabs = document.querySelectorAll('.slds-context-bar .navItem a[href*="/pardot/"');
    targetTabs.forEach((tab) => {
      replaceText(tab, replacementText);
    });
  }
  
  chrome.storage.sync.get('replacementText', (data) => {
    const replacementText = data.replacementText || 'Pardot';
    applyReplacement(replacementText);
  
    // Listen for any DOM updates
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            applyReplacement(replacementText);
          });
        }
      });
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });