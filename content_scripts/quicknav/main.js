main();

async function main() {
  console.log('quicknav main running');
  const qnParentElement = document.querySelector('div[class=g3Fmkb]');

  // create quicknav element
  const qnElm = document.createElement('div');
  qnElm.id = 'qn-root';

  let url = "http://localhost:8080/quicknav/navigation/index?folder_id=root&sort_key=name&sort_dir=4";
  
  const { activeTask } = await chrome.storage.local.get(['activeTask']);
  if (
    activeTask.itemId !== null 
    && activeTask.status == 'idle' 
    && activeTask.interface == 'QUICKNAV'
  ) {
    url += '&source=static&log=NAVIGATE-'+activeTask.itemId;
  }

  // create iframe element
  const iframe = document.createElement('iframe');
  iframe.id = 'quicknav';
  iframe.src = url;

  // add newly created element to dom
  qnElm.append(iframe);
  qnParentElement.prepend(qnElm);
}