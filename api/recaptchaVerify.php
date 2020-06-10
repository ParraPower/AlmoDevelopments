<?php require_once('../environment.php'); ?>
<?php
    function getCaptcha($secretKey) {
        $url = 'https://www.google.com/recaptcha/api/siteverify?';
        
        $url .= "secret=" . $_ENV["SECURE_KEY"];
        $url .= "&response=" . $secretKey;

        $response = file_get_contents($url);

        return json_decode($response); 
    }

    $return  = getCaptcha($_POST['g-recaptcha-response']); 

    var_dump($return);
?>