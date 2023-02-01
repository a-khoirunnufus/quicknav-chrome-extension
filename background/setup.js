/* DISABLE PAGE ACTION ON OTHER PAGES */
function setup() {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
      let rule = {
        conditions: [
          // new chrome.declarativeContent.PageStateMatcher({
          //   pageUrl: {urlMatches: 'http://localhost:8080/*'},
          // }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {urlMatches: 'https://drive.google.com/*'},
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      };
  
      let rules = [rule];
      chrome.declarativeContent.onPageChanged.addRules(rules);
    });
    console.log('action disabled');
  });
}

export default setup;