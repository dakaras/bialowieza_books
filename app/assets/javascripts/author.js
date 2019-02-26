// use $(document).ready() to load the page before loading the annon. function
$(function(){
  $.get('a.load_book').on('click', function(e){
    e.preventDefault()
    $.ajax({
      method: 'GET',
      url: this.href
    }).done(function(response){
      $('div.present_info').html(response)
    })
  })
})
