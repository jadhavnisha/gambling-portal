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

  var pwShown = 0;

  $('#eye').click(function(){
    if(pwShown){
      pwShown = 0;
      hide();
    }else{
      pwShown = 1;
      show();
    }
  });
});

function show() {
  $('#chain-password').attr('type', 'text');
  $('#eye').attr('title', 'Hide Password');
  $('#eye').attr('src', '/images/eye-close.png');

}

function hide() {
  $('#chain-password').attr('type', 'password');
  $('#eye').attr('title', 'Show Password');
  $('#eye').attr('src', '/images/eye-open.png');
}