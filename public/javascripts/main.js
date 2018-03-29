$(window).on('load',function(){
  $('.contest-start-draw').click(function(e){
  	var url = "/admin/contests/" + e.target.value + "/" + e.target.innerText.toLowerCase();
  	console.log(url);
  	$.ajax({
		  url: url,
		  type: 'PUT',
		  success: function(data) {
		    window.open('/contests', '_self');
		  }
		});
  });
});