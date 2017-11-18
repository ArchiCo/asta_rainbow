<!DOCTYPE html>
 <?php 
 // AstaZero Challenge
 
 if(isset($_GET['p'])){ 
	$collection = $_GET['p'];
 }
 $thepath = "../general/";

if(isset($_GET['sid'])){ 
	$sid = $_GET['sid'];
} else { 
	$sid = 0;
}

$iPod    = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
$iPhone  = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
$iPad    = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
$Android = stripos($_SERVER['HTTP_USER_AGENT'],"Android");
$webOS   = stripos($_SERVER['HTTP_USER_AGENT'],"webOS");


// If solution need database connection
/*
$servername = "inceptive-178573.mysql.binero.se";
$username = "178573_ob49380";
$password = "tbd";
$dbname="178573-inceptive";
$mysqli = new mysqli($servername, $username, $password, $dbname);
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}
$sql  = 'SELECT * FROM `photo` ';
$sql  .= 'WHERE `collectiontitle` = "' . $collection . '" ';
$sql .= 'ORDER BY `score` DESC';

if ($result = $mysqli->query($sql)) {
    while ($row = $result->fetch_assoc()) {
			$image_id = $row["id"]; 
			$image_title = $row["title"]; 
			 			
	}
    $result->free();
}
$mysqli->close(); 
*/
?>

<html lang="en">
<head>
	<title><? echo $collection; ?> AstaZero Challenge</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no">
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

	<!-- For the Facebook share image and text. Replace with your Facebook app id etc -->
	<meta property="og:url"                content="http://vr.inceptive.se/<? echo $collection; ?>" />
	<meta property="og:type"               content="article" />
	<meta property="og:title"              content="<? echo $image_title; ?> - mobile VR" />
	<meta property="og:description"        content="Click to see our AstaZero Challenge solution" />
	<meta property="og:image" 			   content="http://vr.inceptive.se/uploads/astazero_challenge.jpg" />  <!--"http://delivery.inceptive.se/uploads/virtual-reality.jpg" />-->
	<meta property="og:image:width" 	   content="795"/>
	<meta property="og:image:height" 	   content="520"/>
	<meta property="fb:app_id"             content="1554936681430980" /> <!-- Test scrape info here: https://developers.facebook.com/tools/debug/og/object/ -->

	<link rel="manifest" href="<? echo $thepath; ?>manifest.json">
	<style>
		body {
		  width: 100%;
		  height: 100%;
		  background-color: #000;
		  color: #fff;
		  margin: 0px;
		  padding: 0;
		  overflow: hidden;
		} 
		<? if(!isset($_GET['action'])){  ?>
			#div2 { opacity: 0.3; filter:alpha(opacity=30); }
		<? } else { ?>
			#div2 { opacity: 1.0; filter:alpha(opacity=100); }
		<? } ?>
		#div2:hover { opacity: 1.0; filter:alpha(opacity=100); }	
		
		a:link, a:visited, h3 {
		  color: #444;
		  text-decoration: none;
		  font-size: 26px;
		  text-shadow: 1px 1px 6px #fff;
		  font-family: Arial, Helvetica, sans-serif;
		  font-weight: bold;
		}

		a:hover {
		  color: #000;
		  text-shadow: 1px 1px 8px #fff;
		}

		a:active {
		  text-shadow: -1px -1px 7px #ddd;
		}

	</style>

	<!-- Share buttons -->
	<script type="text/javascript">var switchTo5x=true;</script>
	<script type="text/javascript" src="http://w.sharethis.com/button/buttons.js"></script>
	<script type="text/javascript">stLight.options({publisher: "40749252-018c-49a2-8247-3207c36d8529", doNotHash: false, doNotCopy: false, hashAddressBar: false});</script>
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
</head>

<body>
	<div id="maindiv" style="position:relative;">

		<? if(!isset($_GET['action'])){ ?>
			<div id="div2" style="position:fixed; bottom: 2px; left: 5px; z-index:10; color:grey;">		
		<? } else { ?>
			<div id="div2" style="position:fixed; top: 5px; left: 5px; z-index:10;">				
			<h3>2. Share it with your friends</h3>
		<? } ?>
			<span class='st_facebook' displayText='Facebook'></span>

			<? if(!($iPhone || $Android)){ ?>
			<span class='st_linkedin' displayText='LinkedIn'></span>
			<span class='st_twitter' displayText='Tweet'></span>
			<span class='st_email' displayText='Email'></span>
			<? } ?>		
		</div>

		<? if(!($iPhone || $Android)){ ?>
			<div id="div3" style="position:fixed; bottom: 25px; left: 5px; z-index:10; color:grey;">		
				<a href="http://www.astazero.com"><img src="images/astazerologo.png" alt="AstaZero challenge logo"></a>
			</div>
		<? } ?>		
	</div>	
</body>

<script>


/*
 * Debug parameters.
 */
WebVRConfig = {
  /**
   * webvr-polyfill configuration
   */

  // Forces availability of VR mode.
  FORCE_ENABLE_VR: true, // Default: false.
  // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
  //K_FILTER: 0.98, // Default: 0.98.
  // How far into the future to predict during fast motion.
  //PREDICTION_TIME_S: 0.040, // Default: 0.040 (in seconds).
  // Flag to disable touch panner. In case you have your own touch controls
  //TOUCH_PANNER_DISABLED: true, // Default: false.
  // Enable yaw panning only, disabling roll and pitch. This can be useful for
  // panoramas with nothing interesting above or below.
  //YAW_ONLY: true, // Default: false.

  /**
   * webvr-boilerplate configuration
   */
  // Forces distortion in VR mode.
  //FORCE_DISTORTION: true, // Default: false.
  // Override the distortion background color.
  // DISTORTION_BGCOLOR: {x: 1, y: 0, z: 0, w: 1}, // Default: (0,0,0,1).
  // Prevent distortion from happening.
  //PREVENT_DISTORTION: true, // Default: false.
  // Show eye centers for debugging.
  // SHOW_EYE_CENTERS: true, // Default: false.
  // Prevent the online DPDB from being fetched.
  // NO_DPDB_FETCH: true,  // Default: false.
};
</script>

<!--
  A polyfill for Promises. Needed for IE and Edge.
  -->
<script src="<? echo $thepath; ?>node_modules/es6-promise/dist/es6-promise.js"></script>

<!--
  three.js 3d library
  -->
<script src="<? echo $thepath; ?>node_modules/three/three.min.js"></script>
<script src="<? echo $thepath; ?>node_modules/three/examples/js/loaders/OBJLoader.js"></script>
<script src="<? echo $thepath; ?>node_modules/three/examples/js/loaders/MTLLoader.js"></script>
<script src="<? echo $thepath; ?>node_modules/three/examples/js/loaders/OBJMTLLoader.js"></script>


<!--
  VRControls.js acquires positional information from connected VR devices and applies the transformations to a three.js camera object.
   -->
<script src="<? echo $thepath; ?>node_modules/three/examples/js/controls/VRControls.js"></script>

<!--
  VREffect.js handles stereo camera setup and rendering.
  -->
<script src="<? echo $thepath; ?>node_modules/three/examples/js/effects/VREffect.js"></script>

<!--
  A polyfill for WebVR using the Device{Motion,Orientation}Event API.
  -->
<script src="<? echo $thepath; ?>node_modules/webvr-polyfill/build/webvr-polyfill.js"></script>

<!--
  Helps enter and exit VR mode, provides best practices while in VR.
  -->
<script src="<? echo $thepath; ?>build/webvr-manager.js"></script>

<script src="<? echo $thepath; ?>reticulum.js?s=<?php echo time(); ?>"></script>

<script src="astazero.js?s=<?php echo time(); ?>&collection=<? echo $collection; ?>"></script>

</html>
