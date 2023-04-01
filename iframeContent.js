if(!window.hasPardotReplaced) {
    function hijackTroughData() {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        file_path = chrome.runtime.getURL('iframeInject.js');
        script.setAttribute('src', file_path);
        
        // console.log('writing script eleemnt to page');
        (document.head||document.documentElement).appendChild(script);
        // console.log('removing script element from page');
        script.parentNode.removeChild(script);
        setTimeout(startReplacements, 500);
    }

    function replaceTroughFieldName(node, replacementText, troughData) {
        var fieldId = node.id;
        var troughDataForField = troughData.find(x => x.id === fieldId);
        
        var span = node.querySelector('span');
        if( span.textContent.includes('Account Engagemen...') &&
                troughDataForField.label.includes('Account Engagement')) {
            // console.log(troughDataForField);
            var newLabel = troughDataForField.label.replace(/Account Engagement/g, replacementText);
            if(newLabel.length>20) newLabel = newLabel.substring(0,17) + '...';
            span.textContent = newLabel;
        }
    }

    function replaceLayoutFieldName(node, replacementText) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.includes("Account Engagement")) {
                node.textContent = node.textContent.replace(/Account Engagement/g, replacementText);
            }
        } 
        else {
            for (let child of node.childNodes) {
                replaceLayoutFieldName(child, replacementText);
            }
        }
    }
    
    function applyReplacements(replacementText, troughData) {
        const draggableFieldNames = document.querySelectorAll('#troughPanel .troughItems .item');
        draggableFieldNames.forEach((tab) => {
            replaceTroughFieldName(tab, replacementText, troughData);
        });

        const fieldsInLayout = document.querySelectorAll('.pbBody .itemLabel span.labelText');
        fieldsInLayout.forEach((field) => {
            replaceLayoutFieldName(field, replacementText);
        });
    }

    function startReplacements() {
        // console.log('about to get troughData from local storage');
        var localStorageString = localStorage.getItem("hijackedTroughData");
        var ourLocalStorageObject= JSON.parse(localStorageString);
        // console.log('ourLocalStorageObject has');
        troughData = JSON.parse(ourLocalStorageObject.troughData);

        chrome.storage.local.get('replacementText', (data) => {
            const replacementText = data.replacementText || 'Pardot';
            applyReplacements(replacementText, troughData);

            // Listen for any DOM updates
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            applyReplacements(replacementText, troughData);
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }
    setTimeout(hijackTroughData, 500);
    // callback();
}