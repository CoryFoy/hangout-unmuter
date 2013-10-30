/*
* Copyright (c) 2011 Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not
* use this file except in compliance with the License. You may obtain a copy of
* the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/
var serverPath = '//hangout-unmuter.appspot.com/';

// The functions triggered by the buttons on the Hangout App
function countButtonClick() {
  // Note that if you click the button several times in succession,
  // if the state update hasn't gone through, it will submit the same
  // delta again.  The hangout data state only remembers the most-recent
  // update.
  console.log('Button clicked.');
  var value = 0;
  var count = gapi.hangout.data.getState()['count'];
  if (count) {
    value = parseInt(count);
  }

  console.log('New count is ' + value);
  // Send update to shared state.
  // NOTE:  Only ever send strings as values in the key-value pairs
  gapi.hangout.data.submitDelta({'count': '' + (value + 1)});
}

var forbiddenCharacters = /[^a-zA-Z!0-9_\- ]/;
function setText(element, text) {
  element.innerHTML = typeof text === 'string' ?
      text.replace(forbiddenCharacters, '') :
      '';
}

function updateStateUi(state) {
  var countElement = document.getElementById('count');
  var stateCount = state['count'];
  if (!stateCount) {
    setText(countElement, 'Probably 0');
  } else {
    setText(countElement, stateCount.toString());
  }
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadAvatars(participants) {
  console.log("Loading avatarts. They're tasty");
  console.log(participants);
  for(var i = 0; i < participants.length; i++) {
    var p = participants[i];
    addAvatar(p.person.image.url, p.person.displayName);
  }
}

function addAvatar(url, name) {
  console.log("Adding avatar for " + name + " with url + " + url);
  var avatarsBlock = document.getElementById('avatars');
  console.log(avatarsBlock);
  var li = document.createElement('li');
  var html = "<img alt='" + name + "' class='" + getRandomColor() + "' height='64' src='" + url + "' width='64' /><div class='name'>" + name + "</div>";
  li.setAttribute('class', 'avatar');
  li.innerHTML = html;
  avatarsBlock.appendChild(li);
}

$(function() {
  $('.avatar').on('click', function(e) {
    console.log('avatar clicked');
    return $(this).toggleClass('off');
  });
});

// A function to be run at app initialization time which registers our callbacks
function init() {
  console.log('Init app.');

  var apiReady = function(eventObj) {
    if (eventObj.isApiReady) {
      console.log('API is ready');


      var participants = gapi.hangout.getParticipants();
      loadAvatars(participants);

      gapi.hangout.av.onMicrophoneMute.add(function(eventObj) {
        var statusBlock = document.getElementById('status-block')
        var forceUnmute = document.getElementById('force-unmute')
        if(eventObj.isMicrophoneMute) {
          if(forceUnmute.checked) {
            gapi.hangout.av.setMicrophoneMute(false);
            setText(statusBlock, 'Automatically Unmuted!');
          } else {
            setText(statusBlock, '**MUTED**');
          }
        } else {
          setText(statusBlock, '');
        }
      });

      gapi.hangout.onApiReady.remove(apiReady);
    }
  };

  // This application is pretty simple, but use this special api ready state
  // event if you would like to any more complex app setup.
  gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);
