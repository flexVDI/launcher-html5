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
	$(document).ready(function(){
		$('#msgbox').dialog({
				autoOpen: false,
				modal:true,
				width:350,
				height:200,
				buttons:{
					ACEPTAR:function(){
						$( this ).dialog( "close" );
					}
				}
			});
		$('#bot').on('click',function(){
			event.preventDefault();
			if($('#user_login').val() !== '' && $('#pass_login').val() !== ''){
				var managerAPI = this.form.action;
				console.log(managerAPI);
				/*var managerAPI = "php/proxy.php";
				$.post(managerAPI,{data:JSON.stringify($(this.form).serializeObject())})*/
				$.post(managerAPI,JSON.stringify($(this.form).serializeObject()))
				.done(function(data){
					console.log(data);
					eraseCookie("token");
					createCookie("token",JSON.stringify(data),1);
					document.location.href='spice/console.html';
				})
				.fail(function(jqXHR){
					$( "#msgbox" ).dialog( "option","title","Error "+jqXHR.status);
					$( '#msgbox' ).html('<p style="margin-top:1em" class="msg-error">'+jqXHR.responseText+'</p>');
					$( "#msgbox" ).dialog( "open" );
				});
			}
			else{
				$( "#msgbox" ).dialog( "option","title","Error");
				$( '#msgbox' ).html('<p style="margin-top:1em" class="msg-error">Debe introducir Usuario y Password</p>');
				$( "#msgbox" ).dialog( "open" );
			}
		});
	});
});