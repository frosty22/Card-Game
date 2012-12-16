<?php
if (!isset($_GET["user"])) die("Parameter user must be set");

$db = new PDO('mysql:host=localhost;dbname=test;charset=UTF-8', "root");
$result = $db->prepare("SELECT hash FROM user WHERE id = ?");
$result->execute(array($_GET["user"]));
$result = $result->fetchColumn();
if (!$result) die("Unknown user");
?>
<html>
 <head>
	<meta charset="utf-8">

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>

	<script type="text/javascript">
		 var config = {
		 	 ws: "<?php echo $_SERVER["REMOTE_ADDR"] != "127.0.0.1" ? "192.168.1.10:8080" : "127.0.0.1:8080"; ?>",
			 game : "12345678901234567890123456789012",
			 user : "<?php echo $result; ?>"
		 }
	</script>

	<script src="game.js"></script>
	<link rel="stylesheet" href="style.css" type="text/css">

 </head>
<body>

	<div id="state">Načítám hru ...</div>
	<div id="board">

		<div id="player">
			Hráč: <span id="player-username"></span>
			Úroveň: <span id="player-level"></span>
			Život: <span id="player-life"></span>/<span id="player-maxLife"></span>
		</div>
		<div id="opposite">
			Protivník: <span id="opponent-username"></span>
			Úroveň: <span id="opponent-level"></span>
			Život: <span id="opponent-life"></span>/<span id="opponent-maxLife"></span>
		</div>

	</div>
    
</body>
</html> 