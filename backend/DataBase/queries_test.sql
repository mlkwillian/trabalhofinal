USE termoguard;


-- ver usuarios

SELECT * FROM usuarios;


-- ver salas

SELECT * FROM salas;


-- ver sensores

SELECT * FROM sensores;


-- ver leituras

SELECT * FROM leituras;


-- ver incidentes

SELECT * FROM incidentes;


-- ultimas leituras

SELECT *
FROM leituras
ORDER BY data_leitura DESC
LIMIT 10;


-- leituras com nome da sala

SELECT
l.id_leitura,
l.temperatura,
l.umidade,
l.data_leitura,
s.nome_sala
FROM leituras l
JOIN sensores se ON l.sensor_id = se.id_sensor
JOIN salas s ON se.id_sala = s.id_sala
ORDER BY l.data_leitura DESC;


-- incidentes com nome da sala

SELECT
i.id_incidente,
s.nome_sala,
i.status,
i.data_inicio,
i.data_resolucao
FROM incidentes i
JOIN salas s ON i.id_sala = s.id_sala;


-- verificar temperatura fora do padrão

SELECT
l.temperatura,
s.temperatura_min,
s.temperatura_max
FROM leituras l
JOIN sensores se ON l.sensor_id = se.id_sensor
JOIN salas s ON se.id_sala = s.id_sala
WHERE l.temperatura < s.temperatura_min
OR l.temperatura > s.temperatura_max;