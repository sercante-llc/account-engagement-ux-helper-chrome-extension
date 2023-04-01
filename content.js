var hasPardotReplaced=true;
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
                    // if(node.nodeName==='IFRAME') {
                    //     console.log(node);
                    //     node.addEventListener("load", function() {
                    //         myTroughData = node.contentWindow.troughData; //ew, I'm using a "my" attribute
                    //         console.log('I think I got it?');
                    //         console.log(myTroughData[0]);
                    //     });
                    // }
                    // else
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