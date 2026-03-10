
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
    FOREIGN KEY (id_sala) REFERENCES salas(id_sala)
);


CREATE TABLE leituras (
    id_leitura INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id INT NOT NULL,
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

    FOREIGN KEY (id_sala) REFERENCES salas(id_sala),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);