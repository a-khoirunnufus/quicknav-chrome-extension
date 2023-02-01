function getBtnEnd(currentTab, activeTask, taskLog) {
  const btnEnd = document.createElement('button');
  btnEnd.className = 'd-inline-block btn btn-sm btn-success';
  btnEnd.innerText = 'Tugas Selesai';
  btnEnd.addEventListener('click', async () => {

    if(activeTask.interface == 'GOOGLE_DRIVE') {
      taskLog.push({
        action: 'END_TASK',
        object: currentTab.url,
        time: Math.floor(new Date().getTime()/1000.0),
      });
      // send log to background
      await chrome.runtime.sendMessage({
        code: "FINAL_TASK_LOG",
        data: { logs: taskLog, taskItemId: activeTask.itemId },
      });
    }

    else if(activeTask.interface == 'QUICKNAV') {
      await chrome.scripting.executeScript({
        target: {tabId: currentTab.id},
        func: endTaskQuicknav,
        args: [activeTask],
      });
    }

    // set task status idle
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

  return btnEnd;
}

function endTaskQuicknav(activeTask) {
  const iframe = document.querySelector('iframe[id="quicknav"]');
  iframe.setAttribute('src', 'http://localhost:8080/quicknav/navigation/index?folder_id=root&sort_key=name&sort_dir=4&source=extension&log=END_TASK-'+activeTask.itemId);
}

export default getBtnEnd;