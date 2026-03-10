USE termoguard;


-- inserir usuario admin

INSERT INTO usuarios (nome, email, senha, tipo_usuario)
VALUES (
'Administrador',
'admin@termoguard.com',
'$2b$10$XJzvVhJvX2sP5k2kF3KJ7O0FZ9sZ2OQ2n9jH3cQ1e8wXjX9G5K9mS',
'gestor'
);


-- inserir usuario manutencao

INSERT INTO usuarios (nome, email, senha, tipo_usuario)
VALUES (
'Tecnico Manutenção',
'manutencao@termoguard.com',
'$2b$10$XJzvVhJvX2sP5k2kF3KJ7O0FZ9sZ2OQ2n9jH3cQ1e8wXjX9G5K9mS',
'manutencao'
);


-- inserir sala

INSERT INTO salas (nome_sala, temperatura_min, temperatura_max)
VALUES
('Almoxarifado Principal', 15, 25),
('Laboratório Químico', 18, 24);


-- inserir sensores

INSERT INTO sensores (id_sala, nome_sensor)
VALUES
(1, 'ESP32 Sensor Almoxarifado'),
(2, 'ESP32 Sensor Laboratorio');


-- inserir leituras exemplo

INSERT INTO leituras (sensor_id, temperatura, umidade)
VALUES
(1, 22.5, 60),
(1, 23.1, 58),
(1, 26.8, 55), 
(2, 21.2, 50),
(2, 19.8, 52);


-- incidente exemplo

INSERT INTO incidentes (id_sala, status)
VALUES (1, 'aberto');