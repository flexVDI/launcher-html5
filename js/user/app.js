function checkpass(obj){
	if(!obj.elements[0].value || !obj.elements[1].value || !obj.elements[2].value) return false;
	else return (obj.elements[1].value != obj.elements[2].value)? false : true;
}

function userlaunch(){
	$('#userform').submit();
}

jQuery(function($){
	$(document).ready(function(){
		$( "#dialog-form" ).dialog({
			autoOpen: false,
			height: 380,
			width: 460,
			modal: true,
			buttons:{
				ENVIAR:function(){
					var name=document.forms['chckpass'];
					if(checkpass(name)){
						$.post(name.action,$(name).serialize())
						.done(function(t) {
							console.log(t+'\nSTATUS: '+t.status+'\nMSG: '+t.message);
							var _title=(t.status=='OK')? 'Cambio realizado': 'Error';
							$('#msgbox').attr('title',_title);
							$('#msgbox').html('<p style="margin-top:1em">'+t.message+'</p>');
							$( "#dialog-form" ).dialog( "close" );
							
						})
						.fail(function(xhr, ajaxOptions, thrownError) {
							$('#msgbox').attr('title','Error');
							$('#msgbox').html('<p style="margin-top:1em">'+xhr.responseText+'</p>');
							$( "#dialog-form" ).dialog( "close" );
						})
						.always(function(){
							$( "#msgbox" ).dialog( "open" );
						})
					}else{
						for(var i=1;i<name.elements.length;i++){
							$(name.elements[i]).addClass('error');
						}
					}
				},
				CANCEL:function(){
					$( this ).dialog( "close" );
				}
			}
		});
		$('#msgbox').dialog({
				autoOpen: $('#msgbox').html()!=''? true : false,
				modal:true,
				width:350,
				height:200,
				buttons:{
					ACEPTAR:function(){
						$( this ).dialog( "close" );
					}
				}
			});
		$('#resetpass').on('click',function(e){
			$( "#dialog-form" ).dialog( "open" );
			e.preventDefault();
		});
	});
});