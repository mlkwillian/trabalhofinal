const WIFI_SSID = "WIFI_IOT";
const MQTT_BROKER = "10.84.6.133";

// ===== PINOS =====
const LED_VERDE = 25;
const LED_VERMELHO = 26;
const DHT_PIN = 32;

// ===== LIMITES =====
const tempMin = 15;
const tempMax = 25;

// ===== CONFIG PINOS =====
pinMode(LED_VERDE, "output");
pinMode(LED_VERMELHO, "output");

// ===== LIBS =====
let wifi = require("Wifi");
let mqtt = require("MQTT").create(MQTT_BROKER, { client_id: "termoguard_js" });
let DHT11 = require("dht11.js").connect(DHT_PIN);

// ===== WIFI =====
wifi.connect(WIFI_SSID);
wifi.setHostname("ESP32-Termoguard");

wifi.on("connected", function () {
  console.log("✅ WiFi conectado");
  mqtt.connect();
});

wifi.on("disconnected", function () {
  console.log("❌ WiFi desconectado... reconectando");
  wifi.connect(WIFI_SSID);
});

// ===== MQTT =====
mqtt.on("connected", function () {
  console.log("✅ MQTT conectado");
  mqtt.subscribe("termoguard/led"); // controle remoto opcional
});

mqtt.on("disconnected", function () {
  console.log("❌ MQTT desconectado... reconectando");
  mqtt.connect();
});

// ===== CONTROLE REMOTO (opcional) =====
mqtt.on("message", function (topic, message) {
  if (topic == "termoguard/led") {
    if (message == "verde") {
      digitalWrite(LED_VERDE, 1);
      digitalWrite(LED_VERMELHO, 0);
    } else if (message == "vermelho") {
      digitalWrite(LED_VERDE, 0);
      digitalWrite(LED_VERMELHO, 1);
    }
  }
});

// ===== LOOP SENSOR =====
setInterval(function () {
  let temperatura = DHT11.readTemperature();
  let umidade = DHT11.readHumidity();

  if (!temperatura || !umidade) {
    console.log("❌ Erro leitura DHT");
    return;
  }

  console.log("==========");
  console.log("🌡️ Temp:", temperatura);
  console.log("💧 Umidade:", umidade);

  // ===== LÓGICA DOS LEDS =====
  let ledStatus;

  if (temperatura >= tempMin && temperatura <= tempMax) {
    digitalWrite(LED_VERDE, 1);
    digitalWrite(LED_VERMELHO, 0);
    ledStatus = "VERDE";
  } else {
    digitalWrite(LED_VERDE, 0);
    digitalWrite(LED_VERMELHO, 1);
    ledStatus = "VERMELHO";
  }

  // ===== ENVIO MQTT =====
  let payload = JSON.stringify({
    temperatura: temperatura,
    umidade: umidade,
    led: ledStatus
  });

  mqtt.publish("termoguard/dados", payload);
  console.log("📡 Enviado:", payload);

}, 2000);
