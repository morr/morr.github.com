$(function() {
  var $appeared = $('#appeared');
  var $disappeared = $('#disappeared');

  $('section h3').appear();
  $('#force').on('click', function() {
    $.force_appear();
  });

  $(document.body).on('appear', 'section h3', function(e, $affected) {
    // this code is executed for each appeared element
    $(this).yellowFade();

    $appeared.empty();
    $affected.each(function() {
      $appeared.append(this.innerHTML+"\n");
    })
  });

  $(document.body).on('disappear', 'section h3', function(e, $affected) {
    // this code is executed for each disappeared element
    $disappeared.empty();
    $affected.each(function() {
      $disappeared.append(this.innerHTML+"\n");
    })
  });
});
