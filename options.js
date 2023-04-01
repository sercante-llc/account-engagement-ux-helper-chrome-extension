document.addEventListener('DOMContentLoaded', () => {
    const replacementTextInput = document.getElementById('replacementText');
    const saveButton = document.getElementById('saveButton');
  
    // Load the saved replacement text
    chrome.storage.local.get('replacementText', (data) => {
      replacementTextInput.value = data.replacementText || 'Pardot';
    });
  
    // Save the replacement text
    saveButton.addEventListener('click', () => {
      chrome.storage.local.set({ replacementText: replacementTextInput.value }, () => {
        alert('Replacement text saved to ' + replacementTextInput.value);
      });
    });
  });
  