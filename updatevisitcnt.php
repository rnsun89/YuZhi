<?php
    $visitCntFile = "visitcnt.txt";
    $content = (int) file_get_contents($visitCntFile) + 1;

    $f = fopen($visitCntFile,'w');
    fwrite($f,$content);
    fclose($f);
    echo $content;
?>
