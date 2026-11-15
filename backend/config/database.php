<?php
class Database {
    private $host = "localhost";
    private $db_name = "seuusuario_pracaviva";
    private $username = "seu_usuario";
    private $password = "sua_senha";
    public $conn;

    public function getConnection() {
        $this->host = getenv('DB_HOST') ?: $this->host;
        $this->db_name = getenv('DB_NAME') ?: $this->db_name;
        $this->username = getenv('DB_USER') ?: $this->username;
        $this->password = getenv('DB_PASS') ?: $this->password;

        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4", $this->username, $this->password);
            // Prevenção estrita contra SQL Injection forçando queries preparadas reais
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Erro de BD: " . $exception->getMessage());
            die(json_encode(["status" => "erro", "mensagem" => "Falha de comunicação segura."]));
        }
        return $this->conn;
    }
}
?>
