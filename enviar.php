<?php
// Configurações
$destinatario = "contato@valdenisesantos.adv.br";
$assunto_prefixo = "[Site] ";

// Verificar se é POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: contato.html");
    exit;
}

// Coletar dados
$nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$telefone = filter_input(INPUT_POST, 'telefone', FILTER_SANITIZE_STRING);
$assunto = filter_input(INPUT_POST, 'assunto', FILTER_SANITIZE_STRING);
$mensagem = filter_input(INPUT_POST, 'mensagem', FILTER_SANITIZE_STRING);

// Validar campos obrigatórios
if (empty($nome) || empty($email) || empty($assunto) || empty($mensagem)) {
    header("Location: contato.html?erro=campos");
    exit;
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: contato.html?erro=email");
    exit;
}

// Montar o email
$corpo = "Nova mensagem recebida pelo site:\n\n";
$corpo .= "Nome: $nome\n";
$corpo .= "E-mail: $email\n";
$corpo .= "Telefone: $telefone\n";
$corpo .= "Assunto: $assunto\n\n";
$corpo .= "Mensagem:\n$mensagem\n";

// Headers
$headers = "From: $nome <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Enviar
$enviado = mail($destinatario, $assunto_prefixo . $assunto, $corpo, $headers);

if ($enviado) {
    header("Location: contato.html?sucesso=1");
} else {
    header("Location: contato.html?erro=envio");
}
exit;
?>
