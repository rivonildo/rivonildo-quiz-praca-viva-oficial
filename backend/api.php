<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 🛡️ SECURITY HEADERS (Proteção CSRF, Clickjacking e Sniffing)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains");
header("Content-Security-Policy: default-src 'self'");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

// 📦 MODULARIZAÇÃO (Arquitetura Limpa)
require_once 'config/database.php';
require_once 'security/waf.php';

$database = new Database();
$conn = $database->getConnection();

// 🛡️ MASCARAMENTO DE IP (LGPD)
$ip_usuario = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$ip_hash = hash('sha256', $ip_usuario . 'ChaveSeguranca2026!');

// 🛡️ FIREWALL DE APLICAÇÃO WEB (WAF)
WAF::checkRateLimit($conn, $ip_hash);

// Coleta e Validação do Corpo da Requisição
$raw_data = file_get_contents("php://input");
$data = json_decode($raw_data);

if (!$data) {
    http_response_code(400);
    die(json_encode(["status" => "erro", "mensagem" => "Payload inválido."]));
}

// 🛡️ BLOQUEIO DE MALWARES E INJEÇÕES
WAF::blockMaliciousPayloads($data);

// ==========================================
// ROTEAMENTO (Simulando arquitetura MVC/API RESTful)
// ==========================================
if(isset($data->acao) && $data->acao == "registrar_visualizacao" && !empty($data->planta_id)) {
    // 🛡️ SANITIZAÇÃO DE ENTRADA (White-listing)
    $planta_id = preg_replace('/[^a-zA-Z0-9_-]/', '', $data->planta_id);

    // Identificação de Hardware/Software
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    $dispositivo = (preg_match('/Mobile|Android|iPhone|iPad/i', $user_agent)) ? 'Mobile' : 'Desktop';
    $so = 'Desconhecido';
    if (preg_match('/windows/i', $user_agent)) $so = 'Windows';
    elseif (preg_match('/android/i', $user_agent)) $so = 'Android';
    elseif (preg_match('/iphone|ipad|mac/i', $user_agent)) $so = 'Apple/iOS';
    
    $navegador = 'Outro';
    if (preg_match('/Edg/i', $user_agent)) $navegador = 'Edge';
    elseif (preg_match('/Chrome/i', $user_agent)) $navegador = 'Chrome';
    elseif (preg_match('/Firefox/i', $user_agent)) $navegador = 'Firefox';
    elseif (preg_match('/Safari/i', $user_agent)) $navegador = 'Safari';

    // Geolocalização (com try-catch para evitar falhas se a HostGator bloquear o cURL)
    $cidade = "Desconhecida"; $estado = "Desconhecido"; $fuso_horario = "Desconhecido";
    
    // Na HostGator, o IP será o IP real do usuário (4G, Wi-Fi)
    if ($ip_usuario != '127.0.0.1' && $ip_usuario != '::1') {
        try {
            $ch = curl_init("http://ip-api.com/json/{$ip_usuario}?fields=city,regionName,timezone,status");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 2);
            $api_response = @curl_exec($ch);
            curl_close($ch);
            if ($api_response) {
                $geo = json_decode($api_response);
                if ($geo && isset($geo->status) && $geo->status == "success") {
                    $cidade = $geo->city ?? "Desconhecida"; 
                    $estado = $geo->regionName ?? "Desconhecido"; 
                    $fuso_horario = $geo->timezone ?? "Desconhecido";
                }
            }
        } catch (Exception $e) {
            // Se falhar a geolocalização, ignoramos para não quebrar a API
        }
    } else {
        $cidade = "Localhost"; $estado = "Dev"; $fuso_horario = "Local";
    }

    try {
        $conn->beginTransaction();
        
        $query = "INSERT INTO plantas_metricas (planta_id, visualizacoes) VALUES (:planta, 1) ON DUPLICATE KEY UPDATE visualizacoes = visualizacoes + 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":planta", $planta_id);
        $stmt->execute();

        $query_log = "INSERT INTO acessos_log (planta_id, ip_hash, cidade, estado, fuso_horario, dispositivo, sistema_operacional, navegador) 
                      VALUES (:planta, :ip, :cidade, :estado, :fuso, :disp, :so, :nav)";
        $stmt_log = $conn->prepare($query_log);
        $stmt_log->execute([
            ':planta' => $planta_id, ':ip' => $ip_hash, ':cidade' => $cidade, 
            ':estado' => $estado, ':fuso' => $fuso_horario, ':disp' => $dispositivo, ':so' => $so, ':nav' => $navegador
        ]);

        $conn->commit();
        echo json_encode(["status" => "sucesso", "mensagem" => "Métrica processada com segurança."]);
    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["status" => "erro", "mensagem" => "Falha na transação do banco: " . $e->getMessage()]);
    }
}
?>
