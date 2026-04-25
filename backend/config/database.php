<?php
class Database {
    private $host = "localhost"; // Na HostGator geralmente é localhost
    private $db_name = "seuusuario_pracaviva"; // Mude isso se o nome exato for diferente
    private $username = ";IG8;I$HA$g]"; // Mude isso
    private $password = ";IG8;I$HA$g]"; // Mude isso
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
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
