import {
    bodyQuicknav,
    bodyUserTesting,
    bodyUserTestingActiveTask,
    bodyUserTestingTaskViewer,
  } from './elements.js';

function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.cookies.get(
      { name: 'access_token', url: 'http://localhost:8080' },
      (cookie) => {
        resolve(cookie.value);
      }
    );
  });
}

function resetStackView() {
  bodyQuicknav.classList.remove('show');
  bodyUserTesting.classList.remove('show');
  bodyUserTestingActiveTask.classList.remove('show');
  bodyUserTestingTaskViewer.classList.remove('show');
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
}

export {
  getAccessToken,
  resetStackView,
  getCurrentTab,
  parseURL,
}