<?php
class WAF {
    public static function blockMaliciousPayloads($data) {
        $json_string = json_encode($data);
        // Padrões comuns de Malware, XSS e Injeção
        $patterns = [
            '/<script\b[^>]*>(.*?)<\/script>/is', // XSS
            '/UNION\s+SELECT/i',                  // SQLi
            '/base64_decode\(/i',                 // Malware Obfuscation
            '/eval\(/i',                          // Code Injection
            '/onload=/i',                         // Event XSS
            '/javascript:/i'                      // URL XSS
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $json_string)) {
                http_response_code(403); // Forbidden
                die(json_encode(["status" => "alerta", "mensagem" => "WAF: Payload malicioso detectado e bloqueado."]));
            }
        }
    }

    public static function checkRateLimit($conn, $ip_hash) {
        // Lógica de proteção contra DoS e Brute Force
        $stmt = $conn->prepare("SELECT requisicoes, ultimo_acesso FROM rate_limit_log WHERE ip_address = :ip");
        $stmt->bindParam(":ip", $ip_hash);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $segundos_passados = time() - strtotime($row['ultimo_acesso']);
            // Proteção DoS: Máximo de 20 requisições por minuto
            if ($segundos_passados < 60 && $row['requisicoes'] > 20) {
                http_response_code(429);
                die(json_encode(["status" => "alerta", "mensagem" => "Proteção DoS: Limite de taxa excedido."]));
            }
            
            if ($segundos_passados >= 60) {
                $stmt = $conn->prepare("UPDATE rate_limit_log SET requisicoes = 1 WHERE ip_address = :ip");
            } else {
                $stmt = $conn->prepare("UPDATE rate_limit_log SET requisicoes = requisicoes + 1 WHERE ip_address = :ip");
            }
            $stmt->bindParam(":ip", $ip_hash);
            $stmt->execute();
        } else {
            $stmt = $conn->prepare("INSERT INTO rate_limit_log (ip_address, requisicoes) VALUES (:ip, 1)");
            $stmt->bindParam(":ip", $ip_hash);
            $stmt->execute();
        }
    }
}
?>
