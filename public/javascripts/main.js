$(window).on('load',function(){
  $('#signup, #placeBidBtn').click(function(){
    debugger
    var validForm = true;
    var form = this.closest('form')
    for(var i = 0; i < form.elements.length; i++){
      validForm = form.elements[i].checkValidity()
      if(!validForm)
        break;
    }
    if(validForm){
      $('#LoadingImage').show();
      setTimeout(function(){
        $('#LoadingImage').hide();
      },30000);
    }
  });

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