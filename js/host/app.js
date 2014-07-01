jQuery(function($){

	$(document).ready(function(){
		$('#host_list li a').each(function(){
			$(this).on('click',function(){
				console.log('sdsasdsa '+$(this).parents('li').html());
				$(this).parents('li').remove();
			});
		});
	});
});