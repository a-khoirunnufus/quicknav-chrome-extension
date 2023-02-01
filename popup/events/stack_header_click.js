import {
    headerQuicknav,
    bodyQuicknav,
    headerUserTesting,
    bodyUserTesting,
    headerUserTestingActiveTask,
    headerUserTestingTaskViewer,
  } from '../elements.js';
import { resetStackView } from '../utils.js';
import { eventCreator as uaoatEventCreator } from './user_testing/active_task/open_active_task.js';
import { eventCreator as utotlEventCreator } from './user_testing/task_viewer/open_task_list.js';
import { event as openQuicknavEvent } from './quicknav/open_quicknav.js';

export default function headerClickEventRegister() {
  
  headerQuicknav.addEventListener('click', () => {
    document.dispatchEvent(openQuicknavEvent);
  })

  headerUserTesting.addEventListener('click', () => {
    resetStackView();
    bodyUserTesting.classList.add('show');
  })

  headerUserTestingActiveTask.addEventListener('click', () => {
    document.dispatchEvent(uaoatEventCreator({}));
  })
  
  headerUserTestingTaskViewer.addEventListener('click', () => {
    document.dispatchEvent(utotlEventCreator({}));
  });
}