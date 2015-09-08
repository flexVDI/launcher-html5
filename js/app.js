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

	var bestres = resolutions[bestres_item];
	return bestres.w + "x" + bestres.h;
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
	var managerAPI = "php/proxy.php";
	var user = $('#user_login').val();
	if (document.getElementById('nativeres').checked) {
            var resolution = getBestResolution(screen.width, screen.height, false);
	} else {
	    var resolution = getBestResolution($(window).width(), $(window).height(), true);
	}
	createCookie('resolution', resolution, 360);
        createCookie('hwaddress', $('#hwaddress').val(), 1);
	//$('#pass_login').val(pass.trim());
	$('#user_login').val(user.trim());
	$('#res').val(resolution);
	var request = JSON.stringify($('#loginform').serializeObject());
	
	$.post(managerAPI,{data:request})
	    .done(function(data){
		if (data.status === "OK") {
		    eraseCookie("token");
		    createCookie("token",JSON.stringify(data),1);
		    document.location.href='spice/console.html';
		} else if (data.status === "Pending") {
		    setTimeout(authenticate(), 10000);
		} else if (data.status === "SelectDesktop") {
		    $( "#menu" ).menu({
			select: function( event, ui ) { 
			    var desktop_name = ui.item.text();
			    var desktop = "windowsXP_public";
			    switch (desktop_name) {
				case "Windows XP SP3":
				desktop = "windowsXP_public";
				break;
				case "Windows 7":
				desktop = "windows7_public";
				break;
				case "OpenSuSE 13.2 (GNOME)":
				desktop = "opensuseGNOME_public";
				break;
				case "OpenSuSE 13.2 (KDE)":
				desktop = "opensuseKDE_public";
				break;
			    }
			    //var tmp2 = tmp.substring(tmp.indexOf('#') + 1)
			    //var desktop_name = tmp2.substring(0, tmp2.indexOf('>') - 1)
			    $('#desktop').val(desktop);
			    authenticate();
			    $('#msgbox').dialog("close");
			}
		    });
		    $('#msgbox').dialog("option","title","Seleccione un escritorio");
		    $('#msgbox').dialog("open");
		} else if (data.status === "Error") {
		    $( "#msgerr" ).dialog( "option","title","Error");
		    $( '#msgerr' ).html('<p style="margin-top:1em" class="msg-error">' + data.message + '</p>');
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
