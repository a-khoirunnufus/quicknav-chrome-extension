import {
    bodyQuicknav as body,
    spinner
  } from '../../elements.js';
import { resetStackView } from '../../utils.js';
import getHtml from '../../templates/quicknav/quicknav.js';

const eventType = 'QN/OPEN_QUICKNAV';
const event = new Event(eventType);

const eventHandler = async (e) => {

  console.log('event:', eventType);
  chrome.storage.local.set({lastPopupEvent: {type: eventType, detail: e.detail}});

  resetStackView();

  body.classList.add('show');
  body.innerHTML = '';
  body.append(spinner);

  const { showQuicknav, activeTask } = await chrome.storage.local.get(['showQuicknav', 'activeTask']);

  const content = document.createElement('div');
  content.className = 'd-flex flex-column h-100';

  // notificatin element
  const divNotif = document.createElement('div');
  divNotif.className = 'notification bg-warning w-100 p-2 text-left';
  divNotif.innerText = 'Silahkan refresh halaman ini untuk melihat perubahan.';

  // status text element
  const pStatusText = document.createElement('p');
  pStatusText.className = 'fs-5 fw-bold my-3 text-center';
  if (showQuicknav) {
    pStatusText.innerText = 'Quicknav diaktifkan';
  } else {
    pStatusText.innerText = 'Quicknav dimatikan';
  }

  const divButtonWrapper = document.createElement('div');
  divButtonWrapper.className = 'toggle-qn-container show d-flex justify-content-center';

  // button show element
  const btnShow = document.createElement('button');
  btnShow.className = 'btn btn-sm btn-primary fw-bold';
  btnShow.innerText = 'Aktifkan';
  btnShow.addEventListener('click', () => {
    chrome.storage.local.set({showQuicknav: true});
    pStatusText.innerText = 'Quicknav diaktifkan';
    divNotif.classList.add('show');
  });

  // button hide element
  const btnHide = document.createElement('button');
  btnHide.className = 'btn btn-sm btn-secondary fw-bold';
  btnHide.innerText = 'Matikan';
  btnHide.addEventListener('click', () => {
    chrome.storage.local.set({showQuicknav: false});
    pStatusText.innerText = 'Quicknav dimatikan';
    divNotif.classList.add('show');
  });

  if(activeTask.itemId == null || activeTask.status != 'running') {
    if (showQuicknav) {
      divButtonWrapper.append(btnHide);
    } else {
      divButtonWrapper.append(btnShow);
    }
  }

  content.append(divNotif);
  content.append(pStatusText);
  content.append(divButtonWrapper);

  body.innerHTML = '';
  body.append(content);

}

export { eventType, event, eventHandler }