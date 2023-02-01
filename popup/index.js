import { headerUserTestingActiveTask } from './elements.js';

import { eventType as qoqnType, event as qoqnEvent, eventHandler as qoqnHandler } from './events/quicknav/open_quicknav.js';

import { eventType as utotlType, eventHandler as utotlHandler } 
  from './events/user_testing/task_viewer/open_task_list.js';
import { eventType as utotilType, eventHandler as utotilHandler } 
  from './events/user_testing/task_viewer/open_task_item_list.js';
import { eventType as utotidType, eventHandler as utotidHandler } 
  from './events/user_testing/task_viewer/open_task_item_detail.js';
import {eventType as uaoatType, eventHandler as uaoatHandler } 
  from './events/user_testing/active_task/open_active_task.js';

import headerClickEventRegister from './events/stack_header_click.js';

document.addEventListener('DOMContentLoaded', function() {

  document.addEventListener(qoqnType, qoqnHandler);     // OPEN QUICKNAV
  
  document.addEventListener(uaoatType, uaoatHandler);   // OPEN ACTIVE TASK
  
  document.addEventListener(utotlType, utotlHandler);   // OPEN TASK LIST
  document.addEventListener(utotilType, utotilHandler); // OPEN TASK ITEM LIST
  document.addEventListener(utotidType, utotidHandler); // OPEN TASK ITEM DETAIL
    
  // stack header toggle click event registering
  headerClickEventRegister();

  // header active task notification
  chrome.storage.local.get(['activeTask'], ({activeTask}) => {
    if(activeTask.itemId && activeTask.status && activeTask.status == 'running') {
      headerUserTestingActiveTask.innerHTML = '<p class="ps-3 m-0">Tugas Aktif <span class="ms-3 badge text-bg-success">berlangsung</span></p>';
    }
  });

  // automatically open last viewed page
  chrome.storage.local.get(['lastPopupEvent'], ({lastPopupEvent}) => {
    if(lastPopupEvent.type == null) {
      document.dispatchEvent(qoqnEvent);
    } else {
      document.dispatchEvent(
        new CustomEvent(lastPopupEvent.type, {
          detail: lastPopupEvent.detail
        })
      );
    }
  });

});