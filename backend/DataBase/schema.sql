-- Criação do banco
CREATE DATABASE IF NOT EXISTS termoguard;
USE termoguard;

-- =========================
-- TABELA: USUÁRIOS
-- =========================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('gestor','manutencao','qualidade') NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABELA: SALAS
-- =========================
CREATE TABLE salas (
    id_sala INT AUTO_INCREMENT PRIMARY KEY,
    nome_sala VARCHAR(100) NOT NULL,
    temperatura_min DECIMAL(5,2) NOT NULL,
    temperatura_max DECIMAL(5,2) NOT NULL
);

-- =========================
-- TABELA: SENSORES
-- =========================
CREATE TABLE sensores (
    id_sensor INT AUTO_INCREMENT PRIMARY KEY,
    id_sala INT NOT NULL,
    nome_sensor VARCHAR(100),

    FOREIGN KEY (id_sala) 
    REFERENCES salas(id_sala) 
    ON DELETE CASCADE
);

-- =========================
-- TABELA: LEITURAS
-- =========================
CREATE TABLE leituras (
    id_leitura INT AUTO_INCREMENT PRIMARY KEY,
    id_sensor INT NOT NULL,
    temperatura DECIMAL(5,2) NOT NULL,
    umidade DECIMAL(5,2),
    data_leitura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_sensor) 
    REFERENCES sensores(id_sensor) 
    ON DELETE CASCADE
);

-- =========================
-- TABELA: INCIDENTES
-- =========================
CREATE TABLE incidentes (
    id_incidente INT AUTO_INCREMENT PRIMARY KEY,
    id_sala INT NOT NULL,
    id_leitura INT,
    status ENUM('aberto','resolvido') DEFAULT 'aberto',
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao TIMESTAMP NULL,
    observacao TEXT,
    id_usuario INT,
    id_usuario_resolucao INT,

    FOREIGN KEY (id_sala) 
    REFERENCES salas(id_sala) 
    ON DELETE CASCADE,

    FOREIGN KEY (id_leitura) 
    REFERENCES leituras(id_leitura),

    FOREIGN KEY (id_usuario) 
    REFERENCES usuarios(id_usuario),

    FOREIGN KEY (id_usuario_resolucao) 
    REFERENCES usuarios(id_usuario)
);

-- =========================
-- ÍNDICES (PERFORMANCE)
-- =========================
CREATE INDEX idx_leituras_sensor ON leituras(id_sensor);
CREATE INDEX idx_sensores_sala ON sensores(id_sala);
CREATE INDEX idx_incidentes_sala ON incidentes(id_sala);
CREATE INDEX idx_leituras_data ON leituras(data_leitura);

-- =========================
-- QUERY PRINCIPAL (DASHBOARD)
-- =========================
SELECT 
    l.data_leitura AS createdAt,
    sa.nome_sala AS environment,
    l.temperatura AS temperature,
    sa.temperatura_min AS min,
    sa.temperatura_max AS max,

    CASE
        WHEN l.temperatura < sa.temperatura_min THEN 'crítico'
        WHEN l.temperatura > sa.temperatura_max THEN 'crítico'
        WHEN l.temperatura BETWEEN sa.temperatura_min AND sa.temperatura_max THEN 'conforme'
        ELSE 'atenção'
    END AS status

FROM leituras l
JOIN sensores se ON l.id_sensor = se.id_sensor
JOIN salas sa ON se.id_sala = sa.id_sala;