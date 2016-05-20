jQuery(function($){
    var resolutions = [{w:2560, h:1600},
		       {w:2560, h:1440},
		       {w:2048, h:1536},
		       {w:1920, h:1440},
		       {w:1920, h:1200},
		       {w:1920, h:1080},
		       {w:1600, h:1200},
		       {w:1680, h:1050},
		       {w:1400, h:1050},
		       {w:1600, h:900},
		       {w:1280, h:1024},
		       {w:1440, h:900},
		       {w:1280, h:960},
		       {w:1366, h:768},
		       {w:1360, h:768},
		       {w:1280, h:800},
		       {w:1152, h:870},
		       {w:1152, h:864},
		       {w:1280, h:768},
		       {w:1280, h:760},
		       {w:1280, h:720},
		       {w:1024, h:768},
		       {w:1024, h:600},
		       {w:960, h:640},
		       {w:832, h:624},
		       {w:800, h:600},
		       {w:800, h:480},
		       {w:640, h:480}];

    function getBestResolution(width, height, windowed) {
	var reslength = resolutions.length;
	var bestres_item = -1;
	var bestres_width_diff = -1;
	var bestres_width_height = -1;

	for (var i = 0; i < reslength; ++i) {
	    testres = resolutions[i];
	    width_diff = Math.abs(testres.w - width);
	    height_diff = Math.abs(testres.h - height);

	    if (bestres_item == -1) {
		if (!windowed || (testres.w <= width && testres.h <= height)) {
		    bestres_item = i;
		    bestres_width_diff = width_diff;
		    bestres_height_diff = height_diff;
		}
	    } else if (!windowed && width_diff == 0 && height_diff == 0) {
		return testres.w + "x" + testres.h;
	    } else if (width_diff < bestres_width_diff) {
		if (!windowed || (testres.w <= width && testres.h <= height)) {
		    bestres_item = i;
		    bestres_width_diff = width_diff;
		    bestres_height_diff = height_diff;
		}
	    } else if (width_diff == bestres_width_diff &&
		       height_diff < bestres_height_diff) {
		if (!windowed || (testres.w <= width && testres.h <= height)) {
		    bestres_item = i;
		    bestres_width_diff = width_diff;
		    bestres_height_diff = height_diff;
		}
	    }
	}

	if (bestres_item == -1) {
	    return "";
	} else {
	    var bestres = resolutions[bestres_item];
	    return bestres.w + "x" + bestres.h;
	}
    }
			
    $.fn.serializeObject = function()
    {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
	    if (o[this.name] !== undefined) {
		if (!o[this.name].push) {
		    o[this.name] = [o[this.name]];
		}
		o[this.name].push(this.value || '');
	    } else {
		o[this.name] = this.value || '';
	    }
	});
	return o;
    };

    function guid() {
	function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
    }

    function authenticate() {
	var managerAPI = "/vdi/desktop";
	if ($('#randed_post').val() == 'yes' || $('#randed_get').val() == 'yes') {
	    managerAPI = "/html/desktop.php";
	}
	
	var user = $('#user_login').val();
	
	if (!document.getElementById('nativeres') || document.getElementById('nativeres').checked) {
            var resolution = getBestResolution(screen.width, screen.height, false);
            var fsmode = true;
	} else {
	    var resolution = getBestResolution($(window).width(), $(window).height(), true);
            var fsmode = false;
	}
	if (resolution == "") {
	    $( "#msgerr" ).dialog( "option","title","Error");
	    $( '#msgerr' ).html('<p style="margin-top:1em" class="msg-error">La ventana del navegador es demasiado pequeña.</p>');
	    $( "#msgerr" ).dialog( "open" );
	    return;
	    
	}
	
	createCookie('resolution', resolution, 360);
	createCookie('fsmode', fsmode, 360);
        createCookie('hwaddress', $('#hwaddress').val(), 1);
	createCookie('username', $('#user_login').val(), 1);
	createCookie('password', $('#pass_login').val(), 1);
	
	$('#user_login').val(user.trim());
	$('#res').val(resolution);
	var request = JSON.stringify({"hwaddress": $('#hwaddress').val(), "username": $('#user_login').val(), "password": $('#pass_login').val(), "desktop": $('#desktop').val(), "resolution": resolution});
	var desktopList = null;
	
	$.post(managerAPI, request)
	    .done(function(data){
		var response = JSON.parse(data);
		if (response.status === "OK") {
		    if ($('#randed_post').val() == 'yes') {
			var p1 = document.createElement('input');
			p1.name = 'p1';
			p1.type = 'hidden';
			p1.value = 'spice';
			
			var p2 = document.createElement('input');
			p2.name = 'p2';
			p2.type = 'hidden';
			p2.value = response.spice_address;
			
			var p3 = document.createElement('input');
			p3.name = 'p3';
			p3.type = 'hidden';
			p3.value = response.spice_port;
			
			var p4 = document.createElement('input');
			p4.name = 'p4';
			p4.type = 'hidden';
			p4.value = response.spice_password;

			var form = document.loginform;
			form.method = 'post';
			form.action = 'https://RANDEDIP/applaunch';
			form.appendChild(p1);
			form.appendChild(p2);
			form.appendChild(p3);
			form.appendChild(p4);
			form.submit();
		    } else if ($('#randed_get').val() == 'yes') {
			document.location.href = 'https://RANDEDIP/applaunch?p1=spice&p2=' + response.spice_address + '&p3=' + response.spice_port + '&p4=' + response.spice_password;
		    } else {
			eraseCookie("token");
			createCookie("token",JSON.stringify(response),1);
			document.location.href = 'spice-web-client/index.html';
			/*
			if (navigator.appVersion.indexOf("Win") != -1) {
			    document.location.href = 'spice-web-client/index.html';
			} else {
			    document.location.href = 'spice-web-client/index.html?host=' + response.spice_address + '&port=' + response.spice_port + '&token=' + response.spice_password;
			}
			*/
		    }
		} else if (response.status === "Pending") {
		    setTimeout(authenticate(), 10000);
		} else if (response.status === "SelectDesktop") {
		    desktopList = JSON.parse(response.message);
		    var i = 0;
		    
		    for (var key in desktopList) {
			if (desktopList[key] != "") {
			    var text = desktopList[key];
			} else {
			    var text = key;
			}
			
			switch (i) {
			case 0:
			    $('#entry1').val(key);
			    $('#entry1').text(text);
			    break;
			case 1:
			    $('#entry2').val(key);
			    $('#entry2').text(text);
			    break;
			case 2:
			    $('#entry3').val(key);
			    $('#entry3').text(text);
			    break;
			case 3:
			    $('#entry4').val(key);
			    $('#entry4').text(text);
			    break;
			default:
			    $( "#msgerr" ).dialog( "option","title","Error");
			    $( '#msgerr' ).html('<p style="margin-top:1em" class="msg-error">Su política tiene demasiados Escritorios</p>');
			    $( "#msgerr" ).dialog( "open" );
			    return;
			}
			i++;
		    }
			
		    $( "#menu" ).menu({
			select: function( event, ui ) {
			    var item = ui.item.text();
			    var desktop = "";
			    for (var key in desktopList) {
				if (key == item || desktopList[key] == item) {
				    desktop = key;
				    break;
				}
			    }
			    $('#desktop').val(desktop);
			    authenticate();
			    $('#msgbox').dialog("close");
			}
		    });
		    $('#msgbox').dialog("option","title","Seleccione un escritorio");
		    $('#msgbox').dialog("open");
		} else if (response.status === "Error") {
		    $( "#msgerr" ).dialog( "option","title","Error");
		    $( '#msgerr' ).html('<p style="margin-top:1em" class="msg-error">' + response.message + '</p>');
		    $( "#msgerr" ).dialog( "open" );
		}
	    })
	    .fail(function(jqXHR){
		if (jqXHR.status != 0) {
		    $( "#msgerr" ).dialog( "option","title","Error "+jqXHR.status);
		    $( '#msgerr' ).html('<p style="margin-top:1em" class="msg-error">No hay escritorios disponibles. Por favor, inténtelo más tarde.</p>');
		    $( "#msgerr" ).dialog( "open" );
		}
	    });
    }

    $(document).ready(function(){
           
	var uuid = readCookie('uuid');
	if (uuid == null) {
	    uuid = guid();
	    createCookie('uuid', uuid, 360);
	}
	$('#hwaddress').val("h5-" + uuid);
	$('#msgerr').dialog({
	    autoOpen: false,
	    modal:true,
	    width:350,
	    height:250,
	    buttons:{
		CANCELAR:function(){
		    $( this ).dialog( "close" );
		}
	    }
	});
	$('#msgbox').dialog({
	    autoOpen: false,
	    modal:true,
	    width:350,
	    height:250,
	    buttons:{
		CANCELAR:function(){
		    $( this ).dialog( "close" );
		}
	    }
	});
	$('#user_login').focus();
	$('#bot').on('click',function(e){
	    e.preventDefault();
	    $('#desktop').val("");
	    if($('#user_login').val() !== '' && $('#pass_login').val() !== ''){
		$( "#user_login" ).focus();
		authenticate();
	    }
	    else{
		$( "#user_login" ).focus();
		$( "#msgerr" ).dialog( "option","title","Error");
		$( '#msgerr' ).html('<p style="margin-top:1em" class="msg-error">Debe introducir Usuario y Password</p>');
		$( "#msgerr" ).dialog( "open" );
	    }
	});
	$('#reset').on('click',function(e){
            history.go(-1);
	});
	$("#pass_login").keyup(function(event){
	    if(event.keyCode == 13){
		$("#bot").click();
	    }
	});
	if ($('#autologin').val() == 'yes') {
            $("#bot").click();
        }
    });
});
