const headerQuicknav = document.querySelector('#quicknav');
const bodyQuicknav = headerQuicknav.nextElementSibling;

const headerUserTesting = document.querySelector('#user-testing');
const bodyUserTesting = headerUserTesting.nextElementSibling;

const headerUserTestingActiveTask = document.querySelector('#active-task');
const bodyUserTestingActiveTask = headerUserTestingActiveTask.nextElementSibling;

const headerUserTestingTaskViewer = document.querySelector('#task-viewer');
const bodyUserTestingTaskViewer = headerUserTestingTaskViewer.nextElementSibling;

const spinner = document.createElement('div');
spinner.className = 'spinner-border';
spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';

export {
  headerQuicknav,
  bodyQuicknav,
  headerUserTesting,
  bodyUserTesting,
  headerUserTestingActiveTask,
  bodyUserTestingActiveTask,
  headerUserTestingTaskViewer,
  bodyUserTestingTaskViewer,
  spinner,
};