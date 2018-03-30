<?php
    $commentfile = $_POST['commentfile'];
    $timename = date('Y/m/d h:i:sa').' by '.$_POST['name'];
    $email=$_POST['email'];
    $subject = $_POST['subject'];
    $fb = $_POST['fb'];

    $fcontent=file_get_contents($commentfile);

    $fcontent or exit("Unable to load the comment file!");
    $str = "<p>$timename</p>"."\r\n"."<p>Email: $email</p>"."\r\n"."<p>Subject: $subject</p>"."\r\n"."<p>$fb</p><hr>"."\r\n";

    file_put_contents($commentfile, $str.$fcontent);

    echo "Feedback is sent!";
    header("refresh:2; url=/profile.html");
    exit();

?>