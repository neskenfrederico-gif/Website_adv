<?php
/**
 * Simple SMTP Mailer Class
 * Para envio de emails via SMTP sem dependências externas
 */
class SMTPMailer {
    private $server;
    private $port;
    private $username;
    private $password;
    private $socket;
    private $timeout = 30;
    
    public function __construct($server, $port, $username, $password) {
        $this->server = $server;
        $this->port = $port;
        $this->username = $username;
        $this->password = $password;
    }
    
    public function send($to, $subject, $body, $from_name = '', $reply_to = '') {
        // Conectar via SSL
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);
        
        $this->socket = stream_socket_client(
            "ssl://{$this->server}:{$this->port}",
            $errno, $errstr, $this->timeout,
            STREAM_CLIENT_CONNECT, $context
        );
        
        if (!$this->socket) {
            return false;
        }
        
        // Ler resposta inicial
        $this->getResponse();
        
        // EHLO
        $this->sendCommand("EHLO " . gethostname());
        
        // AUTH LOGIN
        $this->sendCommand("AUTH LOGIN");
        $this->sendCommand(base64_encode($this->username));
        $this->sendCommand(base64_encode($this->password));
        
        // MAIL FROM
        $this->sendCommand("MAIL FROM: <{$this->username}>");
        
        // RCPT TO
        $this->sendCommand("RCPT TO: <{$to}>");
        
        // DATA
        $this->sendCommand("DATA");
        
        // Headers
        $from_name = $from_name ?: $this->username;
        $reply_to = $reply_to ?: $this->username;
        
        $headers = "From: {$from_name} <{$this->username}>\r\n";
        $headers .= "Reply-To: {$reply_to}\r\n";
        $headers .= "To: {$to}\r\n";
        $headers .= "Subject: {$subject}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "Date: " . date('r') . "\r\n";
        $headers .= "\r\n";
        
        // Corpo + finalização
        $this->sendCommand($headers . $body . "\r\n.");
        
        // QUIT
        $this->sendCommand("QUIT");
        
        fclose($this->socket);
        return true;
    }
    
    private function sendCommand($command) {
        fwrite($this->socket, $command . "\r\n");
        return $this->getResponse();
    }
    
    private function getResponse() {
        $response = '';
        while ($line = fgets($this->socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
        return $response;
    }
}
?>
