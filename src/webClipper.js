/* global chrome */
function getSelectedText(){
    let selection = window.getSelection();
    if (selection != null) {
        return selection.toString()
    } else {
        return undefined
    }
}

// returns chrome.tabs.Tab[] with always only one Tab
function getTabX() {
    if (chrome.tabs == undefined) { throw("not in an extension") }
    return chrome.tabs.query({ active: true, lastFocusedWindow: true })
}

// returns [selectedText, tab]
async function getSelection() {
    return await getTabX().then( async tabs => {
        if (tabs == undefined) { throw("no tab") }
        let tab = tabs[0]
        return await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: getSelectedText
        }).then(results => {
            if (results[0] == undefined) { throw("no selected text") }
            let selectedText = results[0].result
            return [selectedText, tab]
        }).catch(e => console.log("no selected text", e))
    }).catch(e => console.log("no tab", e))
}


export {getSelection}
