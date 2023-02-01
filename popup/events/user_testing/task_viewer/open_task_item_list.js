import { 
    bodyUserTesting,
    bodyUserTestingTaskViewer as body, 
    spinner, 
  } from "../../../elements.js";
import { getAccessToken, resetStackView } from "../../../utils.js";
import { eventCreator as openTaskListEventCreator } from "./open_task_list.js";
import { eventCreator as openTaskItemDetailEventCreator } from "./open_task_item_detail.js";

const eventType = 'UT/TASK_VIEWER/OPEN_TASK_ITEM_LIST';
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

  const accessToken = await getAccessToken();
  let res = await fetch('http://localhost:8080/api/item/index?task_id='+e.detail.taskId, {
    headers: { 'Authorization': 'Basic ' + btoa(`${accessToken}:password`) }
  });
  res = await res.json();

  // back button
  const btnBack = document.createElement('a');
  btnBack.setAttribute('href', '#');
  btnBack.className = 'py-2 ps-3 mb-3 d-inline-block';
  btnBack.innerText = 'Kembali';
  btnBack.addEventListener('click', () => {
    document.dispatchEvent(openTaskListEventCreator({}));
  })

  // construct list html
  const list = document.createElement('ul');
  list.className = 'list-group list-group-flush';

  for (const item of res.taskItems) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex flex-row justify-content-between align-items-center';
    listItem.classList.add('list-group-item');

    const itemCode = document.createElement('span');
    itemCode.innerHTML = `<span>${item.code}</span>`;
    
    const itemStatus = document.createElement('span');
    if(item.status == 'NOT_COMPLETE') {
      itemStatus.innerHTML = '<span class="badge bg-secondary">belum selesai</span>'; 
    } else if(item.status == 'PENDING') {
      itemStatus.innerHTML = '<span class="badge bg-warning">pending</span>';
    } else if(item.status == 'COMPLETED') {
      itemStatus.innerHTML = '<span class="badge bg-success">selesai</span>';
    }

    const btn = document.createElement('button');
    btn.innerText = 'Buka';
    btn.className = 'btn btn-primary btn-sm';
    btn.addEventListener('click', () => {
      document.dispatchEvent(openTaskItemDetailEventCreator({
        detail: {
          taskId: e.detail.taskId,
          itemId: item.id
        }
      }))
    });

    listItem.append(itemCode);
    listItem.append(itemStatus);
    listItem.append(btn);
    list.append(listItem);
  }

  body.innerHTML = '';
  body.append(btnBack);
  body.append(list);
}

export {eventType, eventCreator, eventHandler};