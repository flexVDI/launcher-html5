var $hash=location.hash.substring(1);
var tabsIndex=[];
var defaultSel=0;
$('#tabs ul li a').each(function(){
	tabsIndex.push(this.innerHTML.toLowerCase());
});

function hashTabsController(){
	if($hash.length > 1){
		defaultSel=$.inArray($hash,tabsIndex);
		logincontroller(defaultSel);
	}
}
function logincontroller(ind){
	switch(ind){
		case 0:{
			$('#bot').html('ACCESO');
			$('#login').removeClass('long_dis');
			break;
		}
		case 1:{
			$('#bot').html('REGISTRO');
			$('#login').addClass('long_dis');
			break;
		}
	}
}
hashTabsController();

jQuery(function($){
	$(document).ready(function(){
		$('#tabs').tabs({ active: defaultSel,
			show: { effect: "fadeIn", duration: 500 },
			beforeActivate: function(event, ui){
				logincontroller(ui.newTab.index());
			}
		});
		var tabsIndex=$( "#tabs" ).tabs( "widget" );
		$('#bot').on('click',function(e){
			document.forms[$( "#tabs" ).tabs( "option", "active" )].submit();
			e.preventDefault();
		});
		$('#login').on('keydown',function(e){
			if (e.keyCode == 13) {
				document.forms[$( "#tabs" ).tabs( "option", "active" )].submit();
				e.preventDefault();
			}
		});
		$( "#dialog-form" ).dialog({
			autoOpen: false,
			height: 300,
			width: 460,
			modal: true,
			buttons:{
				ENVIAR:function(){
					console.log('enviar');
				},
				CANCEL:function(){
					$( this ).dialog( "close" );
				}
			}
		});
		$('#access_form a').on('click',function(){
			$( "#dialog-form" ).dialog( "open" );
			event.preventDefault();
		});
	});
});