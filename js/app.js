jQuery(function($){
	$('#sec-1').tooltip();
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
				$.post(this.form.action,$(this.form).serialize())
				.done(function(data){
					console.log('ok');
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