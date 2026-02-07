<?php
// =============================================
// CONFIGURAÇÕES SMTP - HOSTINGER
// =============================================
require_once 'smtp.php';

$smtp_server = "smtp.hostinger.com";
$smtp_port = 465;
$smtp_user = "contato@valdenisesantos.adv.br";
$smtp_pass = "Kee3304ml@2050";

$destinatario = "contato@valdenisesantos.adv.br";
$assunto_prefixo = "[Site] Nova mensagem: ";

// =============================================
// VERIFICAR MÉTODO
// =============================================
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: contato.html");
    exit;
}

// =============================================
// COLETAR E SANITIZAR DADOS
// =============================================
$nome = isset($_POST['nome']) ? trim(strip_tags($_POST['nome'])) : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$telefone = isset($_POST['telefone']) ? trim(strip_tags($_POST['telefone'])) : '';
$assunto = isset($_POST['assunto']) ? trim(strip_tags($_POST['assunto'])) : '';
$mensagem = isset($_POST['mensagem']) ? trim(strip_tags($_POST['mensagem'])) : '';

// =============================================
// VALIDAÇÕES
// =============================================
if (empty($nome) || empty($email) || empty($assunto) || empty($mensagem)) {
    header("Location: contato.html?erro=campos");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: contato.html?erro=email");
    exit;
}

// =============================================
// MONTAR EMAIL
// =============================================
$assunto_email = $assunto_prefixo . $assunto;

$corpo = "═══════════════════════════════════════\n";
$corpo .= "   NOVA MENSAGEM DO SITE\n";
$corpo .= "═══════════════════════════════════════\n\n";
$corpo .= "DADOS DO CONTATO:\n";
$corpo .= "─────────────────────────────────────\n";
$corpo .= "Nome:      $nome\n";
$corpo .= "E-mail:    $email\n";
$corpo .= "Telefone:  $telefone\n";
$corpo .= "Assunto:   $assunto\n\n";
$corpo .= "MENSAGEM:\n";
$corpo .= "─────────────────────────────────────\n";
$corpo .= "$mensagem\n\n";
$corpo .= "═══════════════════════════════════════\n";
$corpo .= "Enviado em: " . date('d/m/Y H:i:s') . "\n";
$corpo .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// =============================================
// ENVIAR VIA SMTP
// =============================================
try {
    $mailer = new SMTPMailer($smtp_server, $smtp_port, $smtp_user, $smtp_pass);
    $enviado = $mailer->send($destinatario, $assunto_email, $corpo, $nome, $email);
    
    if ($enviado) {
        header("Location: obrigado.html");
    } else {
        header("Location: contato.html?erro=envio");
    }
} catch (Exception $e) {
    error_log("Erro SMTP: " . $e->getMessage());
    header("Location: contato.html?erro=envio");
}
exit;
?>
