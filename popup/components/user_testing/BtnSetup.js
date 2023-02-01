const btnSetup = document.createElement('button');
btnSetup.className = 'd-inline-block btn btn-sm btn-info me-3';
btnSetup.innerText = 'Siapkan Tugas';
btnSetup.addEventListener('click', async () => {

  // check item task interface
  if (activeTask.interface == 'GOOGLE_DRIVE') {
    // unregister content script
    await chrome.storage.local.set({showQuicknav: false});
  } 
  else if(activeTask.interface == 'QUICKNAV') {
    // trigger re-register content script
    // set task status idle
    await chrome.storage.local.set({showQuicknav: false});
    await chrome.storage.local.set({
      activeTask: {
        itemId: activeTask.itemId,
        status: 'idle',
        interface: 'QUICKNAV',
      },
      showQuicknav: true,
    });
  }

  // navigate to home url
  const tab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: () => {
      window.location.href = 'https://drive.google.com/drive/my-drive';
    },
  });

});