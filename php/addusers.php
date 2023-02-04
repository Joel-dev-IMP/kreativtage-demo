<?php
// Testnutzer zu Testzwecken in die Datenbank einfügen.

include 'config.php';

$db = new mysqli($HOST, $USER, $PASSWD, $DATENBANK); // Verbindung zur Datenbank herstellen
$sql = 'INSERT INTO `Nutzer`
    (`id`, `username`, `passwort`, `berechtigung`, `name`, `vorname`, `stufe`, `klasse`)
    VALUES
    (?,?,?,?,?,?,?,?)';

$letters = array("a", "b", "c", "d", "e");

for ($i=13; $i < 31; $i++) {
    $pwd = "muster";

    $name = "User$i";
    $prename = "Test";
    $username = "$prename.$name";

    $class = rand(5, 11);
    $zug = $letters[rand(0, 4)];

    $role = "1";

    $stmnt = $db->prepare($sql);
    $stmnt->bind_param('ississis',
    $i,
    $username,
    $pwd,
    $role,
    $name,
    $prename,
    $class,
    $zug);

    $stmnt->execute();
    echo "$i</br>";
}

?>
