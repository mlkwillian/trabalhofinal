USE termoguard;

-- =========================
-- USUÁRIOS
-- =========================

INSERT INTO usuarios (nome, email, senha, tipo_usuario)
VALUES 
(
'Administrador',
'admin@termoguard.com',
'$2b$10$oha9AXSWes78cyCtdgOHRe5.VVXT4VZIYQnIn71u.nytsXxFyszNO',
'gestor'
),
(
'Tecnico Manutenção',
'manutencao@termoguard.com',
'$2b$10$oha9AXSWes78cyCtdgOHRe5.VVXT4VZIYQnIn71u.nytsXxFyszNO',
'manutencao'
);

-- =========================
-- SALAS
-- =========================

INSERT INTO salas (nome_sala, temperatura_min, temperatura_max)
VALUES
('Almoxarifado Principal', 15, 25),
('Laboratório Químico', 18, 24);

-- =========================
-- SENSORES
-- =========================

INSERT INTO sensores (id_sala, nome_sensor)
VALUES
(1, 'ESP32 Sensor Almoxarifado'),
(2, 'ESP32 Sensor Laboratorio');

-- =========================
-- LEITURAS (CORRIGIDO)
-- =========================

INSERT INTO leituras (id_sensor, temperatura, umidade)
VALUES
(1, 22.5, 60),
(1, 23.1, 58),
(1, 26.8, 55), -- fora do limite (vai gerar incidente se tiver trigger)
(2, 21.2, 50),
(2, 19.8, 52);

-- =========================
-- INCIDENTE EXEMPLO
-- =========================

INSERT INTO incidentes (id_sala, status)
VALUES (1, 'aberto');