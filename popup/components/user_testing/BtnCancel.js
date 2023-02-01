function getBtnCancel(currentTab, activeTask) {
  const btnCancel = document.createElement('button');
  btnCancel.className = 'd-inline-block btn btn-sm btn-secondary me-3';
  btnCancel.innerText = 'Batalkan Tugas';
  btnCancel.addEventListener('click', async () => {

    if(activeTask.interface == 'QUICKNAV') {
      await chrome.scripting.executeScript({
        target: {tabId: currentTab.id},
        func: cancelTaskQuicknav,
        args: [activeTask],
      });
    }

    await chrome.storage.local.set({
      activeTask: {
        itemId: activeTask.itemId,
        status: 'idle',
        interface: activeTask.interface,
      },
      taskLog: [],
    });

    return window.close();

  });

  return btnCancel;
}

function cancelTaskQuicknav(activeTask) {
  const iframe = document.querySelector('iframe[id="quicknav"]');
  iframe.setAttribute('src', 'http://localhost:8080/quicknav/navigation/index?folder_id=root&sort_key=name&sort_dir=4&source=extension&log=CANCEL_TASK-'+activeTask.itemId);
}

export default getBtnCancel;