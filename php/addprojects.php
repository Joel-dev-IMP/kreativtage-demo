<?php
// Beispielprojekte zu Testzwecken in die Datenbank einfügen.

// config.php definiert vier Variablen: $HOST, $USER, $PASSWD und $DATENBANK
include 'config.php';

$db = new mysqli($HOST, $USER, $PASSWD, $DATENBANK); // Verbindung zur Datenbank herstellen
$sql = 'INSERT INTO
        `Projektdaten`
        (	`nleiter1`,
            `nleiter2`,
            `vleiter1`,
            `vleiter2`,
            `sleiter1`,
            `sleiter2`,
            `kleiter1`,
            `kleiter2`,
            `mleiter2`,
            `mleiter1`,
            `titel`,
            `beschreib`,
            `stufemin`,
            `stufemax`,
            `teilmin`,
            `teilmax`,
            `beschreibunglang`,
            `zeitfenster`,
            `pate`,
            `bemerkung`,
            `sle`,
            `zertsj1`,
            `zertprojekt1`,
            `zertsj2`,
            `zertprojekt2`,
            `status`,
            `angelegtvon`
        )
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

$letters = array("a", "b", "c", "d", "e");


for ($i=3; $i < 32; $i++) {
    $userid = $i + 70;

    $title = "Test Project $i";
    $beschreib = "Dies ist ein Test.";
    $smin = rand(5, 11);
    $smax = rand(5, 11);

    if ($smin > $smax) {
        $temp = $smax;
        $smax = $smin;
        $smin = $temp;
    }

    $tmin = rand(5, 12);
    $tmax = rand(15, 25);

    $bemerkung = "Hier steht eine Bemerkung.";

    $nleiter1 = "User$userid";
    $nleiter2 = "";

    $vleiter1 = "Test";
    $vleiter2 = "";

    $sle = 1;
    $sleiter1 = rand(3, 11);
    $sleiter2 = 5;

    $kleiter1 = $letters[rand(0, 4)];
    $kleiter2 = "a";

    if ($sleiter1 < 5) {
        $sleiter1 = 0;
        $kleiter1 = "f";
        $sle = 2;
    }

    $beschreiblang = "Was für eine lange Beschreibung";

    $zeitfenster = rand(1, 10);

    if ($zeitfenster > 2) {
        $zeitfenster = 2;
    }

    $null = "";

    $status = 2;

    $stmnt = $db->prepare($sql);
    $stmnt->bind_param('ssssiissssssiiiisississssii',
    $nleiter1,
    $nleiter2,
    $vleiter1,
    $vleiter2,
    $sleiter1,
    $sleiter2,
    $kleiter1,
    $kleiter2,
    $null,
    $null,
    $title,
    $beschreib,
    $smin,
    $smax,
    $tmin,
    $tmax,
    $beschreiblang,
    $zeitfenster,
    $null,
    $bemerkung,
    $sle,
    $null,
    $null,
    $null,
    $null,
    $status,
    $userid
);

    if (!$stmnt->execute()) {
        $error = $stmnt->error;
        $stmnt->close();
        return $error;
    }
    echo "$i</br>";
}

?>
