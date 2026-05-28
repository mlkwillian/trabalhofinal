const WIFI_SSID = "POCO X7 Pro";
const MQTT_BROKER = "broker.emqx.io";

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

// ===== LCD =====
I2C1.setup();
let lcd = require("HD44780").connectI2C(I2C1);

// ===== WIFI =====
wifi.connect(WIFI_SSID);
wifi.setHostname("ESP32-Termoguard");

wifi.on("connected", function () {
  console.log("✅ WiFi conectado");

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("WiFi Conectado");

  mqtt.connect();
});

wifi.on("disconnected", function () {
  console.log("❌ WiFi desconectado... reconectando");

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("WiFi OFF");

  wifi.connect(WIFI_SSID);
});

// ===== MQTT =====
mqtt.on("connected", function () {
  console.log("✅ MQTT conectado");

  lcd.setCursor(0,1);
  lcd.print("MQTT ON       ");

  mqtt.subscribe("termoguard/led");
});

mqtt.on("disconnected", function () {
  console.log("❌ MQTT desconectado... reconectando");

  lcd.setCursor(0,1);
  lcd.print("MQTT OFF      ");

  mqtt.connect();
});

// ===== CONTROLE REMOTO =====
mqtt.on("message", function (topic, message) {

  if (topic == "termoguard/led") {

    if (message == "verde") {
      digitalWrite(LED_VERDE, 1);
      digitalWrite(LED_VERMELHO, 0);
    }

    else if (message == "vermelho") {
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

    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Erro Sensor");

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

    ledStatus = "OK";

  } else {

    digitalWrite(LED_VERDE, 0);
    digitalWrite(LED_VERMELHO, 1);

    ledStatus = "ALERTA";
  }

  // ===== LCD =====
  lcd.clear();

  lcd.setCursor(0,0);
  lcd.print("T:" + temperatura + "C U:" + umidade + "%");

  lcd.setCursor(0,1); 
  lcd.print("Status:" + ledStatus);

  // ===== ENVIO MQTT =====
  let payload = JSON.stringify({
    temperatura: temperatura,
    umidade: umidade,
    led: ledStatus
  });

  mqtt.publish("termoguard/dados", payload);

  console.log("📡 Enviado:", payload);

}, 2000);