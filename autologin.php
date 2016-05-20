<!doctype html>
<head>
  <meta charset="utf-8">
  <title>flexVDI</title>
  <meta name="description" content="flexVDI">
  <meta name="keywords" content="flexVDI">
  <meta name="author" content="flexVDI">
  <link rel="shortcut icon" href="favicon.ico">
  <link rel="stylesheet/less" href="./less/main.less" type="text/css" />
  <link rel="stylesheet" href="./css/jquery-ui-menu.css" />
  <script src="./lib/less/less-1.7.0.min.js"></script>
</head>
<body class="login">
  <div class="shadow-bck">
    <section id="login" class="login_content clearfix">
      <div class="logotype"><img src="img/general/icon_logo.png"></div>
      <h1 class="clearfix"><span class="logotype"></h1>
      <form class="loginForm" id="loginform" name="loginform" >
	<input type="hidden" name="hwaddress" id="hwaddress" value="webclient">
	<input type="hidden" name="desktop" id="desktop" value="">
	<input type="hidden" name="username" id="user_login" value="<?php print $_POST["username"]?>">
	<input type="hidden" name="password" id="pass_login" value="<?php print $_POST["password"]?>">
	<input type="hidden" id="autologin" value="yes">
	<div id="tabs" class="clearfix mrq_gen mrq_trian">
	  <p class="description">
	    Aquí iría un texto explicando la operativa de Codelogin+flexVDI, y pidiendo al usuario que espere unos instantes.
	  <p class="warning">
	    El botón REINCIAR hacer un history.go(-1), pero se podría hacer una redirección a dónde fuera necesario
	</div>
	<p class="footer">
	  <a href="javascript:void(0)" id="reset">REINCIAR</a>
	  <a href="javascript:void(0)" id="bot"></a>
	  <span class="copy">© 2015 <a href="http://www.flexvdi.com">Flexible Software Solutions S.L.</a> | v1.8</span>
	</p>
      </form>
    </section>
  </div>
  <div id="msgbox" title="Envio correcto" style="display:none">
    <ul id="menu">
      <li><a href="#">Windows XP SP3</a></li>
      <li><a href="#">Windows 7</a></li>
      <li><a href="#">OpenSuSE 13.2 (GNOME)</a></li>
      <li><a href="#">OpenSuSE 13.2 (KDE)</a></li>
    </ul>
  </div>
  <div id="msgerr" title="Error" style="display:none" />
  <script type="text/javascript" src="js/spin.min.js"></script>
  <script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
  <script type="text/javascript" src="js/jquery-ui-1.10.4.custom.min.js"></script>
  <script type="text/javascript" src="js/utils.js"></script>
  <script type="text/javascript" src="js/app.js"></script>
</body>
</html>
