'use strict';

let mute = document.getElementById('mute');
let muteIcon = document.getElementById('mute-icon');
let muted = false;

mute.onclick = function (element) {
  chrome.extension.sendMessage({ action: "mute" });
  muted = !muted;
  if (muted)
    muteIcon.innerHTML = "volume_off";
  else
    muteIcon.innerHTML = "volume_up";
};
