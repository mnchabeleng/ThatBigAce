<?php
    /** Display all errors and warnings */
    error_reporting(E_ALL);
    ini_set('display_errors', '1');

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    require 'vendor/phpmailer/phpmailer/src/Exception.php';
    require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
    require 'vendor/phpmailer/phpmailer/src/SMTP.php';

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: X-Requested-With');
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $name = isset($_POST['name']) ? capitalize(ucfirst($_POST['name'])) : null;
        $email = isset($_POST['email']) ? $_POST['email'] : null;
        $phone = isset($_POST['phone']) ? $_POST['phone'] : null;
        $message = isset($_POST['message']) ? $_POST['message'] : null;

        $validations = [
            'name' => null,
            'email' => null,
            'phone' => null,
            'message' => null
        ];

        if(empty($name) || !validate_email($email) || !validate_phone($phone) || empty($message)) {
            if(empty($name)) {
                $validations['name'] = 'Name is required.';
            }

            if(!validate_email($email)) {
                $validations['email'] = 'Enter a valid email address.';
            }

            if(!validate_phone($phone)) {
                $validations['phone'] = 'Enter a valid phone number.';
            }

            if( empty($message)) {
                $validations['message'] = 'Enter a message.';
            }
            
            echo json_encode([
                'status' => 'validation',
                'message' => $validations
            ]);

            exit;
        } else {
            $mail = new PHPMailer(true);

            try {
                //$mail->SMTPDebug = SMTP::DEBUG_SERVER; //Enable verbose debug output
                $mail->isSMTP(); //Send using SMTP
                $mail->Host = 'smtp.mailtrap.io'; //Set the SMTP server to send through
                $mail->SMTPAuth = true; //Enable SMTP authentication
                $mail->Username = 'fad486c524220f'; //SMTP username
                $mail->Password = '9a8ffe91534288'; //SMTP password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; //Enable implicit TLS encryption
                $mail->Port = 2525; //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
            
                $mail->setFrom($email, $name);
                $mail->addAddress('bigace@mail.com');
                $mail->addReplyTo($email, $name);
            
                $mail->isHTML(true);
                $mail->Subject = "thatbigace.co.za: $name ($phone)";
                $mail->Body = "<strong>thatbigace.co.za: $name ($phone)</strong><p>$message</p>";
                $mail->AltBody = $message;
            
                $mail->send();

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Message has been sent'
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'fail',
                    'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"
                ]);
            }

            exit;
        }
    }

    function capitalize($str) {
        return preg_replace_callback('/(?<=( |-))./',
                      function ($m) { return strtoupper($m[0]); },
                      $str);
    }

    function validate_email($email) {
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        return true;
    }

    function validate_phone($phone) {
        if(!preg_match('/^(\+27|27|0)[0-9][0-9]{8}$/', $phone)) {
            return false;
        }
        return true;
    }
?>