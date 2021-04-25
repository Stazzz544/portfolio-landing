<?php 

{
require_once('PHPMailerAutoload.php');
$mail = new PHPMailer();
$mail->CharSet = 'utf-8';
$name = $_POST['name']; //получаем из  инпута в html
$phone = $_POST['phone']; //получаем из  инпута в html
$email = $_POST['email']; //получаем из  инпута в html
$myEmail = 'stas_mail_test1@mail.ru'; //email владельца сайта
        //$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->From = 'mail@taxi.com';
$mail->FromName = 'Taxi-website';
$mail->isHTML(true);   


$getters = ['a', 'b'];

foreach ($getters as $getter) {
	set_time_limit(60);
	$mail->clearAttachments();
	$mail->clearAllRecipients();

   if ($getter == 'a') {
      $mail->AddAddress($myEmail);
		$mail->Subject = "Сообщение для хозяина сайта";
      $mail->Body = '' .$name . ' оставил заявку, его телефон ' .$phone. '<br>Почта этого пользователя: ' .$email;
      $mail->send();
   }
   if ($getter == 'b') {
      $mail->AddAddress($email);
		$mail->Subject = "Сообщение для клиента";
      $mail->Body = '' .$name . ', это письмо для тебя!';
		$mail->send();
   }
}
}
?>