$(function() {
  var $appeared = $('#appeared');
  $('section h3').appear(function($elements) {
    $elements.yellowFade();

    $appeared.empty();
    $elements.each(function() {
      $appeared.append(this.innerHTML+"\n");
    })
  });

  $('#force').on('click', function() {
    $.force_appear();
  });
});
