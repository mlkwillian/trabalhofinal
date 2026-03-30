export const generateHistory = (base, variance, points = 24) => { Array.from({ length: points }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    temp: +(base + (Math.random() - 0.5) * variance * 2).toFixed(1),
  }))}  

export const initialEnvs = [   { id: "1", name: "Câmara Fria A", icon: "snowflake", temp: -18.2, minTemp: -22, maxTemp: -15, humidity: 68, status: "ok",    online: true,  history: generateHistory(-18, 2) },
  { id: "2", name: "Câmara Fria B", icon: "snowflake", temp: -14.1, minTemp: -22, maxTemp: -15, humidity: 71, status: "alert", online: true,  history: generateHistory(-14, 3) },
  { id: "3", name: "Sala de Vacinas",icon: "droplets", temp:   4.8, minTemp:   2, maxTemp:   8, humidity: 55, status: "ok",    online: true,  history: generateHistory(5, 1.5) },
  { id: "4", name: "Estufa 01",     icon: "flame",    temp:  37.4, minTemp:  35, maxTemp:  40, humidity: 42, status: "ok",    online: false, history: generateHistory(37, 2) },
 ]
export const initialAlerts = [   { id: "a1", envId: "2", envName: "Câmara Fria B", type: "high",    message: "Temperatura acima do limite máximo", temp: -14.1, time: "14:32", verified: false, verifiedBy: null },
  { id: "a2", envId: "1", envName: "Câmara Fria A", type: "sensor",  message: "Sensor de umidade sem resposta",     temp: -18.2, time: "13:15", verified: true,  verifiedBy: "Operador" },
  { id: "a3", envId: "4", envName: "Estufa 01",     type: "offline", message: "Dispositivo offline",               temp: null,  time: "11:00", verified: false, verifiedBy: null },
 ]