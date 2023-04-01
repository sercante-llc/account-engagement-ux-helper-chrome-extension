// Extension code that runs on top level pages. Separate Javascript is used for handling iframes (Page Layout Editor)

var hasPardotReplaced=true; // makes sure that the iFrame code doesn't run at the top level layer

function replaceLightningTabText(node, replacementText) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.includes("Account Engagement")) {
            node.textContent = node.textContent.replace(/Account Engagement/g, replacementText);
        } 
        else if(!node.textContent.includes(replacementText)) {
            node.textContent = replacementText +' ' + node.textContent;
        }
    } 
    else {
        for (let child of node.childNodes) {
            replaceLightningTabText(child, replacementText);
        }
    }
}

function replaceFieldName(node, replacementText) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.includes("Account Engagement")) {
            node.textContent = node.textContent.replace(/Account Engagement/g, replacementText);
        }
    } 
    else {
        for (let child of node.childNodes) {
            replaceFieldName(child, replacementText);
        }
    }
}
  
function applyReplacements(replacementText) {
    const targetTabs = document.querySelectorAll('.slds-context-bar .navItem a[href*="/pardot/"');
    targetTabs.forEach((tab) => {
        replaceLightningTabText(tab, replacementText);
    });

    const targetFields = document.querySelectorAll('.slds-form .slds-form-element__label');
    targetFields.forEach((field)  => {
        replaceFieldName(field, replacementText);
    });

    const targetFieldsInPageLayoutEditor = document.querySelectorAll('#fieldTrough .item');
    targetFieldsInPageLayoutEditor.forEach((field)  => {
        replaceFieldName(field, replacementText);
    });
}

chrome.storage.local.get('replacementText', (data) => {
    const replacementText = data.replacementText || 'Pardot';
    applyReplacements(replacementText);

    // Listen for any DOM updates
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    applyReplacements(replacementText);
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});