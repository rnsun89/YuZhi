<?php
    $commentfile = $_POST['commentfile'];
    $comment1 = date('Y/m/d h:i:sa').' by '.$_POST['name'];
    $comment2 = $_POST['comment'];

	$fcontent=file_get_contents($commentfile);
	$fcontent or exit("Unable to load the comment file!");	
	
    //$f=fopen($commentfile,'r+') or exit("Unable to load the comment file!");
	//fwrite($f, "<p>$comment1</p>"."\r\n");
    //fwrite($f, "<p>$comment2</p><hr>"."\r\n");
	//fclose($f);
	
    $str = "<p>$comment1</p>"."\r\n"."<p>$comment2</p><hr>"."\r\n";
	file_put_contents($commentfile, $str.$fcontent);    
	
    header("refresh:0; url=/DisplayArticle.html");
    exit();
?>