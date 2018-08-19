'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'itch.io' }
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

var itchTabIds = [];
var audioElement = document.createElement('audio');
audioElement.setAttribute("preload", "auto");
audioElement.loop = true;
audioElement.autobuffer = true;

var source1 = document.createElement('source');
source1.type = 'audio/mpeg';
source1.src = chrome.runtime.getURL("/musics/wii_shop_channel.mp3");
audioElement.appendChild(source1);

function play() {
  if (audioElement.paused)
    audioElement.load();
  audioElement.play();
}

function stop() {
  audioElement.pause();
}

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action == "mute") {
      audioElement.muted = !audioElement.muted;
    }
  });

function isItchTab(url) {
  return (url.match(/^(http|https):\/\/(.*\.)*itch\.io\/(.*)$/));
}

chrome.tabs.onCreated.addListener(function (tab) {
  if (isItchTab(tab.url)) {
    itchTabIds.push(tab.id);
    if (itchTabIds.length > 0)
      play();
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (isItchTab(tab.url)) {
    if (itchTabIds.indexOf(tabId) == -1)
      itchTabIds.push(tabId);
    play();
  }
  else if (itchTabIds.indexOf(tabId) != -1) {
    itchTabIds.splice(itchTabIds.indexOf(tabId), 1);
    if (itchTabIds.length == 0)
      stop();
  }
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  if (itchTabIds.indexOf(tabId) != -1) {
    itchTabIds.splice(itchTabIds.indexOf(tabId), 1);
    if (itchTabIds.length == 0) {
      stop();
    }
  }
});
