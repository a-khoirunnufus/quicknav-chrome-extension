document.addEventListener('DOMContentLoaded', () => {
  updateStorageDataView();
  updateScriptDataView();
});

// listen storage changed event
chrome.storage.onChanged.addListener(function (changes, namespace) {
  updateStorageDataView();
  updateScriptDataView();
});

document.getElementById('empty-storage-btn').addEventListener('click', () => {
  chrome.storage.local.clear();
})

// update data display on popup
function updateStorageDataView() {
  chrome.storage.local.get(null, function(result) {
    document.getElementById("storage-data").innerText = JSON.stringify(result);
  });
}

function updateScriptDataView() {
  chrome.scripting.getRegisteredContentScripts((scripts) => {
    document.getElementById('script-count').innerText = scripts.length;

    let tempHtml = "";
    for (let script of scripts) {
      tempHtml += JSON.stringify(script.js) + "<br>";
    }
    document.getElementById('script-data').innerHTML = tempHtml;
  });
}