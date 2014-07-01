var xhr='';
function msgservice(obj){
	console.log('msgservice');
	var attr='';
	if(xhr==''){
		attr=obj.href.split('!#')[1].split('/');
		console.log('attr '+attr);
		$.post('./js/product/srv.json','')
		.done(function(t) {
			console.log(t+'\nSTATUS: '+t.status+'\nMSG: '+t.message);
		})
		.fail(function(xhr, ajaxOptions, thrownError) {
			console.log('error');
		})
	}
}

jQuery(function($){
	$('.installer').tooltip();
	$(document).ready(function(){
		$('.blcprod').each(function(){
			$(this).find('.titleprod').height($(this).outerHeight());
		});
		$('#dialog-form').dialog({
				autoOpen:false,
				modal:true,
				width:350,
				height:200,
				buttons:{
					ACEPTAR:function(){
						$( this ).dialog( "close" );
					},
					CANCELAR:function(){
						$( this ).dialog( "close" );
					}
				}
			});
		$('.listprod a').each(function(){
			$(this).on('click',function(e){
				msgservice(this);
				e.preventDefault();
			});
		});
		if(document.getElementById('file_avatar')){
			$('#button_avatar').on('click',function(){
				$("#filehd_avatar" ).trigger( "click" );
				event.preventDefault();
			});
			$('#filehd_avatar').on('change',function(){
				console.log(this.value);
				$("#uri_avatar").val(this.value);
				event.preventDefault();
			});
		}
	});
});