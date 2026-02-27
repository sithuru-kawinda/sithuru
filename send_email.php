<?php
// send_email.php
header('Content-Type: application/json');

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get and sanitize input
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? strip_tags(trim($_POST['email'])) : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

// Validate inputs
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Email configuration
$to = 'sithuru15@gmail.com';
$email_subject = "Portfolio Contact: $subject";
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// HTML email template
$email_content = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #00ffff; color: #000; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f4f4f4; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #00cccc; }
        .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #00ffff; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Message from Portfolio</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Name:</span> $name
            </div>
            <div class='field'>
                <span class='label'>Email:</span> $email
            </div>
            <div class='field'>
                <span class='label'>Subject:</span> $subject
            </div>
            <div class='field'>
                <span class='label'>Message:</span>
                <div class='message-box'>$message</div>
            </div>
        </div>
    </div>
</body>
</html>
";

// Send email
if (mail($to, $email_subject, $email_content, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => 'Message sent successfully!']);
} else {
    // Log error for debugging
    error_log("Mail sending failed for: $email");
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message. Please try again later.']);
}
?>
