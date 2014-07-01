jQuery(function($){
	$('#sec-1').tooltip();

	$(document).ready(function(){
		$('.blcprod').each(function(){
			$(this).find('.titleprod').height($(this).outerHeight());
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