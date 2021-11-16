
if (typeof browser === "undefined") {
    var browser = chrome;
}


let prevtabid = null;

browser.tabs.onActivated.addListener((activeInfo) => {
  if(prevtabid){
    browser.tabs.get(prevtabid, async (tab) => {
      if(tab && tab.url && tab.url.startsWith('https://meet.google.com/')){
          browser.tabs.sendMessage(tab.id, { command: 'tab_switch' }, (response) => {
            console.log(response);
          })
      } 
    });
     prevtabid = activeInfo.tabId;
  } else {
    prevtabid = activeInfo.tabId;
  }
});
