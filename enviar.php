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
// EMAIL 1: NOTIFICAÇÃO PARA A ADVOGADA
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
// EMAIL 2: AUTO-RESPOSTA PARA O CLIENTE
// =============================================
$assunto_cliente = "Recebemos sua mensagem - Dra. Valdenise Santos Advocacia";

$corpo_cliente = "Olá, $nome!\n\n";
$corpo_cliente .= "Obrigada por entrar em contato!\n\n";
$corpo_cliente .= "Recebemos sua mensagem sobre \"$assunto\" e retornaremos em até 24 horas úteis.\n\n";
$corpo_cliente .= "Se preferir um atendimento mais rápido, você também pode nos chamar no WhatsApp:\n";
$corpo_cliente .= "📱 (62) 98257-0200\n\n";
$corpo_cliente .= "─────────────────────────────────────\n";
$corpo_cliente .= "Sua mensagem:\n";
$corpo_cliente .= "─────────────────────────────────────\n";
$corpo_cliente .= "$mensagem\n\n";
$corpo_cliente .= "─────────────────────────────────────\n\n";
$corpo_cliente .= "Atenciosamente,\n\n";
$corpo_cliente .= "Dra. Valdenise Santos da Silva\n";
$corpo_cliente .= "Advogada - OAB/GO 69640\n";
$corpo_cliente .= "contato@valdenisesantos.adv.br\n";
$corpo_cliente .= "www.valdenisesantos.adv.br\n";

// =============================================
// ENVIAR VIA SMTP
// =============================================
try {
    $mailer = new SMTPMailer($smtp_server, $smtp_port, $smtp_user, $smtp_pass);
    
    // Enviar para a advogada
    $enviado1 = $mailer->send($destinatario, $assunto_email, $corpo, $nome, $email);
    
    // Enviar auto-resposta para o cliente
    $mailer2 = new SMTPMailer($smtp_server, $smtp_port, $smtp_user, $smtp_pass);
    $enviado2 = $mailer2->send($email, $assunto_cliente, $corpo_cliente, "Dra. Valdenise Santos", $smtp_user);
    
    if ($enviado1) {
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
