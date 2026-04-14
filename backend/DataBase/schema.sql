
CREATE DATABASE IF NOT EXISTS termoguard;

USE termoguard;


CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('gestor','manutencao','qualidade') NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE salas (
    id_sala INT AUTO_INCREMENT PRIMARY KEY,
    nome_sala VARCHAR(100) NOT NULL,
    temperatura_min DECIMAL(5,2) NOT NULL,
    temperatura_max DECIMAL(5,2) NOT NULL
);


CREATE TABLE sensores (
    id_sensor INT AUTO_INCREMENT PRIMARY KEY,
    id_sala INT NOT NULL,
    nome_sensor VARCHAR(100),
    FOREIGN KEY (id_sala) REFERENCES salas(id_sala) ON DELETE CASCADE
);


CREATE TABLE leituras (
    id_leitura INT AUTO_INCREMENT PRIMARY KEY,
    id_sensor INT NOT NULL,
    temperatura DECIMAL(5,2) NOT NULL,
    umidade DECIMAL(5,2),
    data_leitura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES sensores(id_sensor)
);


CREATE TABLE incidentes (
    id_incidente INT AUTO_INCREMENT PRIMARY KEY,
    id_sala INT NOT NULL,
    status ENUM('aberto','resolvido') DEFAULT 'aberto',
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao TIMESTAMP NULL,
    observacao TEXT,
    id_usuario INT,
    id_usuario_resolucao INT,

    FOREIGN KEY (id_sala) REFERENCES salas(id_sala) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

ALTER TABLE incidentes ADD id_leitura INT;
ALTER TABLE incidentes ADD FOREIGN KEY (id_leitura) REFERENCES leituras(id_leitura);

CREATE INDEX idx_sensor_id ON leituras(sensor_id);
CREATE INDEX idx_sala_id ON sensores(id_sala);

ALTER TABLE usuarios ADD ativo BOOLEAN DEFAULT TRUE;


SELECT 
  l.data_hora as createdAt,
  s.nome_sala as environment,
  l.temperatura as temperature,
  s.temperatura_min as min,
  s.temperatura_max as max,
  CASE
    WHEN l.temperatura < s.temperatura_min THEN 'crítico'
    WHEN l.temperatura > s.temperatura_max THEN 'crítico'
    WHEN l.temperatura BETWEEN s.temperatura_min AND s.temperatura_max THEN 'conforme'
    ELSE 'atenção'
  END as status
FROM leituras 1