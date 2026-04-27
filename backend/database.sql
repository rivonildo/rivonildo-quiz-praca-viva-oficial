CREATE TABLE IF NOT EXISTS plantas_metricas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planta_id VARCHAR(50) NOT NULL UNIQUE,
    visualizacoes INT DEFAULT 1,
    ultima_visualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS acessos_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planta_id VARCHAR(50) NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(100),
    fuso_horario VARCHAR(100),
    dispositivo VARCHAR(50),
    navegador VARCHAR(50),
    sistema_operacional VARCHAR(50),
    data_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rate_limit_log (
    ip_address VARCHAR(64) PRIMARY KEY,
    requisicoes INT DEFAULT 1,
    ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
