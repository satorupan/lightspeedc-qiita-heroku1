var myJson = {
  'data': []
};
var myType;
var myText;
var myCount = 0;

var scroll = new SmoothScroll();
var anchor;

var streamer = function (cat, text) {
  myCount = myJson.data.length;
  switch (cat) {
    case "DIV":
      myJson.data[myCount] = {
        'title': cat,
        'text': "start"
      }
      console.log('start')
      break;
    case "DT":
      myJson.data[myCount] = {
        'title': myType,
        'text': myText
      }
      myType = text.wholeText;
      postMessage(myText)
      console.log("title:" + text.wholeText);
      break;
    case "DD":
      myText = text.wholeText

      myJson.data[myCount - 1] = {
        'title': myType,
        'text': myText
      }

      realMessage2(myText)
      console.log(cat + ":" + text.wholeText);
      break;
  }
  mustacher(myJson);
}

function postMessage(myChat) {

  io.socket.post('/postMessage', {
    message: myChat
  });
}

function mustacher(tJson) {

  var template = "  {{#data}}<dt>{{title}}</dt><dd>{{ text }}!</dd> {{/data}}<dd id='lastMessage'></dd>";
  Mustache.parse(template); // optional, speeds up future uses
  var rendered = Mustache.render(template, tJson);
  document.querySelector('#target').innerHTML = rendered;
  anchor = document.querySelector('#lastMessage');
  scroll.animateScroll(anchor);
}


var observer = new MutationObserver(function (MutationRecords, MutationObserver) {
  streamer(MutationRecords[0].target.parentNode.tagName, MutationRecords[0].target)
});
observer.observe(document.querySelector('.tab-panels--tab-content div'), {
  characterData: true,
  childList: true,
  subtree: true
});


/*
CAMERA
*/


const medias = {
    audio: false,
    video: {
      //facingMode: "user"
      facingMode: {
        exact: 'environment'
      },
    }
  },
  video = document.getElementById("video");

navigator.getUserMedia(medias, successCallback, errorCallback);

function successCallback(stream) {
  video.srcObject = stream;
};

function errorCallback(err) {
  //alert(err);
};