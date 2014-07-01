jQuery(function($){
	$('#registerform').tooltip();
	$(document).ready(function(){
		console.log();
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
	});
});