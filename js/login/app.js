jQuery(function($){
	$('#sec-1').tooltip();
	$(document).ready(function(){
		$( "#dialog-form" ).dialog({
			autoOpen: false,
			height: 300,
			width: 460,
			modal: true,
			buttons:{
				ENVIAR:function(e){
					document.forms['resetpass'].submit();
					$( this ).dialog( "close" );
					e.preventDefault();
				},
				CANCEL:function(){
					$( this ).dialog( "close" );
				}
			}
		});
		if($('#msgbox').html()!=''){
			$('#msgbox').dialog({
				autoOpen: true,
				modal:true,
				width:350,
				height:200,
				buttons:{
					ACEPTAR:function(){
						$( this ).dialog( "close" );
					}
				}
			});
		}
		$('#access_form a').on('click',function(){
			$( "#dialog-form" ).dialog( "open" );
			event.preventDefault();
		});
	});
});