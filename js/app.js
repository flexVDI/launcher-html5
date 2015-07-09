jQuery(function($){
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
	//var pass = $('#pass_login').val();
	var resolution = $('#resolution option:selected').data('res');
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
