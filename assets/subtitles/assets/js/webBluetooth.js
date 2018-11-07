var bluetoothDevice;
var characteristic;

//chibi:bit BLE UUID
var LED_SERVICE_UUID = 'e95dd91d-251d-470a-a062-fa1922dfa9a8';
var LED_TEXT_CHARACTERISTIC_UUID = 'e95d93ee-251d-470a-a062-fa1922dfa9a8';


//ボタンイベントリスナー
document.querySelector("#connect").addEventListener("click", connect);
document.querySelector("#disconnect").addEventListener("click", disconnect);
document.querySelector("#send").addEventListener("click", sendMessage);


//chibi:bitに接続する
function connect() {
  alert('connect');
  let options = {};


  //options.acceptAllDevices = true;

  options.filters = [{
      services: [LED_SERVICE_UUID]
    }, // <- 重要
    {
      name: "BBC micro:bit [vaget]"
    }
  ];

  navigator.bluetooth.requestDevice(options)
    .then(device => {
      bluetoothDevice = device;
      console.log("device", device);
      return device.gatt.connect();
    })
    .then(server => {
      console.log("server", server)
      return server.getPrimaryService(LED_SERVICE_UUID);
    })
    .then(service => {
      console.log("service", service)
      return service.getCharacteristic(LED_TEXT_CHARACTERISTIC_UUID)
    })
    .then(chara => {
      console.log("characteristic", chara)
      alert("BLE接続が完了しました。");
      characteristic = chara;
    })
    .catch(error => {
      console.log(error);
    });
}

//LEDに表示するメッセージを送信
function sendMessage() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return;
  var text = document.querySelector("#message").value;
  var arrayBuffe = new TextEncoder().encode(text);
  characteristic.writeValue(arrayBuffe);
}


//BEL切断処理
function disconnect() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return;
  bluetoothDevice.gatt.disconnect();
  alert("BLE接続を切断しました。")
}
