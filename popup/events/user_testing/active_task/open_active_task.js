import { 
    bodyUserTesting,
    bodyUserTestingActiveTask as body, 
    spinner, 
  } from "../../../elements.js";
import { getAccessToken, resetStackView, getCurrentTab } from "../../../utils.js";
import getHtml from "../../../templates/user_testing/active_task/active_task.js";
import divHintInfo from "../../../templates/user_testing/active_task/hint_information.js";
// import divSetupInfo from "../../../templates/user_testing/active_task/setup_information.js";
import divSelectFileInfo from "../../../templates/user_testing/active_task/select_file_info.js";
import getBtnBegin from "../../../components/user_testing/BtnBegin.js";
import getBtnCancel from "../../../components/user_testing/BtnCancel.js";
import getBtnEnd from "../../../components/user_testing/BtnEnd.js";

const eventType = 'UT/ACTIVE_TASK/OPEN_ACTIVE_TASK';
const eventCreator = (options) => {
  return new CustomEvent(eventType, options)
}

const eventHandler = async (e) => {
  console.log('event:', eventType);
  chrome.storage.local.set({lastPopupEvent: {type: eventType, detail: e.detail}});

  resetStackView();

  bodyUserTesting.classList.add('show');
  body.classList.add('show');
  body.innerHTML = '';
  body.append(spinner);

  const {activeTask, showQuicknav} = await chrome.storage.local.get(['activeTask']);
  const currentTab = await getCurrentTab();

  if(activeTask.interface == 'QUICKNAV' && activeTask.status == 'idle' && showQuicknav === true) {
    await chrome.scripting.executeScript({
      target: {tabId: currentTab.id},
      func: resetQuicknav,
    });
  }

  if(activeTask.itemId === null) {
    body.innerHTML = '<div class="p-3">Tidak ada tugas yang aktif, silahkan pilih tugas yang belum selesai dikerjakan.</div>';
    return;
  }

  const accessToken = await getAccessToken();
  let res = await fetch('http://localhost:8080/api/item/detail?item_id='+activeTask.itemId, {
    headers: { 'Authorization': 'Basic ' + btoa(`${accessToken}:password`) },
  });
  res = await res.json();

  // content html
  const content = document.createElement('div');
  content.className = 'p-3';
  content.innerHTML = getHtml(
    res.taskItem.code,
    res.taskItem.status,
    (activeTask.status == 'idle') 
      ? 'Tidak dijalankan' : 'Sedang dijalankan',
    res.taskItem.file_name,
  );

  // button show hint
  const btnShowHint = document.createElement('button');
  btnShowHint.className = 'd-inline-block btn btn-sm btn-warning me-3';
  btnShowHint.innerText = 'Tampilkan Petunjuk';
  btnShowHint.addEventListener('click', () => {
    alert(`Petunjuk lokasi file :\n${res.taskItem.path_to_file}`);
  });

  // run task button
  const btnBegin = await getBtnBegin(currentTab, activeTask, res.taskItem.status);

  // end task button
  let {taskLog} = await chrome.storage.local.get(['taskLog']);
  const btnEnd = getBtnEnd(currentTab, activeTask, taskLog);

  // cancel task button
  const btnCancel = getBtnCancel(currentTab, activeTask);

  if (activeTask.status == 'idle') {
    if(res.taskItem.hint_visible === 1) {
      content.append(divHintInfo);
      content.append(btnShowHint);
    }
    content.append(btnBegin);
  } else if (activeTask.status == 'running') {
    content.append(divSelectFileInfo);
    content.append(btnCancel);
    content.append(btnEnd);
  }

  body.innerHTML = '';
  body.append(content);  
}

function resetQuicknav() {
  const iframe = document.querySelector('iframe[id="quicknav"]');
  iframe.setAttribute('src', 'http://localhost:8080/quicknav/navigation/index?folder_id=root&sort_key=name&sort_dir=4&source=extension');
}

export {eventType, eventCreator, eventHandler};