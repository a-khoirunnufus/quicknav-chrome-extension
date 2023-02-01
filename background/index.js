import setup from './setup.js';

// TODO: before reload extension, clear all data

// when extension first installed / reloaded
chrome.runtime.onInstalled.addListener(() => {
  // set starting storage data
  chrome.storage.local.set({
    'lastPopupEvent': {
      'type': null,
      'detail': null,
    },
    'showQuicknav': null,
    'activeTask': {
      'itemId': null,
      'status': null,
      'interface': null,
    },
    'taskLog': [],
  });

  /* DEBUGGER */
  const extensionId = "bimmbnifpklehmnbcnkfkgmanckjceea"
  chrome.tabs.create({
    active: false,
    url: `chrome-extension://${extensionId}/debugger/index.html`,
  });
});

setup();

const gdScriptObj = {
  id: 'gdcomponent-hide',
  js: [ 
    'content_scripts/googledrive/filelist_hide.js',
    'content_scripts/googledrive/searchbar_hide.js' 
  ],
  matches: [ 'https://drive.google.com/*' ],
  runAt: 'document_end',
};

const qnScriptObj = {
  id: 'quicknav-main',
  css: [ 'content_scripts/quicknav/main.css' ],
  js: [ 'content_scripts/quicknav/main.js' ],
  matches: [ 'https://drive.google.com/*' ],
  runAt: 'document_end',
};

const gdInterfaceTestingScriptObj = {
  id: 'gd-interface-testing-script',
  js: [ 
    'content_scripts/googledrive/searchbar_hide.js', 
    'content_scripts/googledrive/suggested_hide.js',
  ],
  matches: [ 'https://drive.google.com/*' ],
  runAt: 'document_end',
};

// storage change event
chrome.storage.onChanged.addListener(function (changes, namespace) {
  
  // logging
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`
      ,`Old value was "${oldValue}", new value is "${newValue}".`
    );
  }

  if (changes.showQuicknav) {
    if (changes.showQuicknav.newValue === true) {
      // check is content script exists
      // if exist, dont register
      // if dont exist, register
      chrome.scripting.getRegisteredContentScripts(
        { ids: ['quicknav-main', 'gdcomponent-hide'] },
        async (scripts) => {
          const ids = scripts.map((item) => item.id);
          if(!ids.includes('quicknav-main')) {
            await chrome.scripting.registerContentScripts([qnScriptObj]);
          }
          if(!ids.includes('gdcomponent-hide')) {
            await chrome.scripting.registerContentScripts([gdScriptObj]);
          }
        }
      );
    } else if(changes.showQuicknav.newValue === false) {
      // check is content script exists
      // if exist, unregister
      // if dont exist, do nothing
      chrome.scripting.getRegisteredContentScripts(
        { ids: ['quicknav-main', 'gdcomponent-hide'] },
        (scripts) => {
          const ids = scripts.map((item) => item.id);
          if(ids.length > 0) {
            chrome.scripting.unregisterContentScripts({
              ids: ids,
            })
          }
        }
      );
    }
  }

  if (changes.activeTask) {
    activeTaskChangeEventHandler(changes.activeTask.newValue);
  }
  
})

async function activeTaskChangeEventHandler(newValue) {
  if (newValue.status === 'idle') {
    await chrome.action.setBadgeText({text: 't'})
    await chrome.action.setBadgeBackgroundColor({color: '#8a93a2'});
  } else if (newValue.status === 'running') {
    await chrome.action.setBadgeText({text: 't'})
    await chrome.action.setBadgeBackgroundColor({color: '#198754'});
  } else {
    await chrome.action.setBadgeText({text: ''})
    await chrome.action.setBadgeBackgroundColor({color: '#8a93a2'});
  }
}

// LISTEN MESSAGE
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if(request.code === 'FINAL_TASK_LOG') {
      handleRequestFinalTaskLog(request, sender, sendResponse);
    }
    if(request.code === 'SETUP_GD_INTERFACE_TESTING_SCRIPT') {
      handleRequestSetupTestingScript(request, sender, sendResponse);
    }

    return true;
  }
);

// messaging functions begin

async function handleRequestFinalTaskLog(request, sender, sendResponse) {
  console.log('final task log', request.data);

  const logs = request.data.logs;
  const taskItemId = request.data.taskItemId;
  
  // send log to server as json
  const accessToken = await getAccessToken();
  let res = await fetch(
    'http://localhost:8080/api/item/submit-log?task_item_id='+taskItemId
      +'&logs='+JSON.stringify(logs),
    {
      method: 'GET',
      headers: { 'Authorization': 'Basic ' + btoa(`${accessToken}:password`) },
    },
  );
  res = await res.json();
  console.log('submit log result', res);
  sendResponse({success: true});
}

async function handleRequestSetupTestingScript(request, sender, sendResponse) {
  const scripts = await chrome.scripting.getRegisteredContentScripts(
    { ids: ['gd-interface-testing-script'] },
  );
  if(scripts.length == 0) {
    await chrome.scripting.registerContentScripts([gdInterfaceTestingScriptObj]);
  }
  sendResponse({success: true});
}

// messaging functions end

function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.cookies.get(
      { name: 'access_token', url: 'http://localhost:8080' },
      (cookie) => {
        resolve(cookie.value);
      }
    );
  });
}

// DETECT URL CHANGES START
chrome.tabs.onUpdated.addListener(
  async (tabId, changeInfo, tab) => {
    
    const {activeTask} = await chrome.storage.local.get(['activeTask']);

    if (activeTask.itemId && activeTask.interface == 'GOOGLE_DRIVE' && activeTask.status == 'running') {

      if (tabId == tab.id && changeInfo.url) {
        let {taskLog} = await chrome.storage.local.get(['taskLog']);

        taskLog.push({
          action: 'NAVIGATE',
          object: changeInfo.url,
          time: Math.floor(new Date().getTime()/1000.0),
        });

        chrome.storage.local.set({ taskLog: taskLog });
      }

    }
  }
)
// DETECT URL CHANGES END


// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if(request.type == 'BACKGROUND_LOG') {
//       const time = request.time;
//       const from = sender.tab ? `content_script(${sender.tab.url})` : 'extension';
//       const message = request.message;
//       console.log('LOG:', `[${time}]`, from, message);
//     }
//   }
// );
/* LOGGING END */