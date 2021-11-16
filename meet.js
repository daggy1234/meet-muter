// https://github.com/mattsimonis/meet-mute/blob/main/ext/js/meetmute.js
// Thanks to Mattsimonis MeetMute for this code. Slighly modified

if (typeof browser === "undefined") {
    var browser = chrome;
}



const MUTE_BUTTON = '[role="button"][aria-label][data-is-muted]'

const waitUntilElementExists = (DOMSelector, MAX_TIME = 5000) => {
  let timeout = 0

  const waitForContainerElement = (resolve, reject) => {
    const container = document.querySelector(DOMSelector)
    timeout += 100

    if (timeout >= MAX_TIME) reject('Element not found')

    if (!container || container.length === 0) {
      setTimeout(waitForContainerElement.bind(this, resolve, reject), 100)
    } else {
      resolve(container)
    }
  }

  return new Promise((resolve, reject) => {
    waitForContainerElement(resolve, reject);
  })
}

var waitingForMuteButton = false

function waitForMuteButton() {
  if (waitingForMuteButton) {
    return
  }
  waitingForMuteButton = true
  waitUntilElementExists(MUTE_BUTTON)
    .then((el) => {
      waitingForMuteButton = false
      updateMuted()
      watchIsMuted(el)
    })
    .catch((error) => {
      browser.extension.sendMessage({ message: 'disconnected' })
    })
}

var muted = false

function isMuted() {
  let dataIsMuted = document.querySelector(MUTE_BUTTON)
      .getAttribute('data-is-muted')
  return dataIsMuted == 'true'
}


window.onbeforeunload = (event) => {
  browser.extension.sendMessage({ message: 'disconnected' })
}

browser.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    try {
    muted = isMuted()
    if (request && request.command && request.command === 'tab_switch') {
      if(!muted){
       sendKeyboardCommand()
       sendResponse({ message: 'muted', status: true });
      }
      sendResponse({ message: 'already muted', status: true });
    } else  {
      console.log('unknown command');
      sendResponse({ message: 'n/a', status: false });
    }
  } catch(err) {
    sendResponse({ message: err.toString(), status: false });
  }
  })

const keydownEvent = new KeyboardEvent('keydown', {
  "key": "d",
  "code": "KeyD",
  "metaKey": true,
  "charCode": 100,
  "keyCode": 100,
  "which": 100
})

function sendKeyboardCommand() {
  document.dispatchEvent(keydownEvent)
}
