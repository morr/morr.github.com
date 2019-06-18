(function ($) {
  var selectors = [];

  var checkBinded = false;
  var checkLock = false;
  var defaults = {
    interval: 250,
    force_process: false
  };
  var $window = $(window);

  var $priorAppeared = [];

  function appeared(selector) {
    return $(selector).filter(function () {
      var $this = $(this);
      console.log($this.data('_appear_triggered'))
      return !$this.data('_appear_triggered') && $this.is(':appeared');
    });
  }

  function process() {
    checkLock = false;
    for (var index = 0, selectorsLength = selectors.length; index < selectorsLength; index++) {
      var $appeared = appeared(selectors[index]);

      $appeared
        .data('_appear_triggered', true)
        .trigger('appear', [$appeared]);

      if ($priorAppeared[index]) {
        var $disappeared = $priorAppeared[index].not($appeared);
        $disappeared
          .data('_appear_triggered', false)
          .trigger('disappear', [$disappeared]);
      }
      $priorAppeared[index] = $appeared;
    }
  }

  function addSelector(selector) {
    selectors.push(selector);
    $priorAppeared.push();
  }

  // ":appeared" custom filter
  $.expr.pseudos.appeared = $.expr.createPseudo(function (_arg) {
    return function (element) {
      var $element = $(element);

      if (!$element.is(':visible')) {
        return false;
      }

      var windowLeft = $window.scrollLeft();
      var windowTop = $window.scrollTop();
      var offset = $element.offset();
      var left = offset.left;
      var top = offset.top;

      if (top + $element.height() >= windowTop &&
          top - ($element.data('appear-top-offset') || 0) <= windowTop + $window.height() &&
          left + $element.width() >= windowLeft &&
          left - ($element.data('appear-left-offset') || 0) <= windowLeft + $window.width()) {
        return true;
      }
      return false;
    };
  });

  $.fn.extend({
    // watching for element's appearance in browser viewport
    appear: function (selector, options) {
      $.appear(this, options);
      return this;
    }
  });

  $.extend({
    appear: function (selector, options) {
      var opts = $.extend({}, defaults, options || {});

      if (!checkBinded) {
        var onCheck = function () {
          if (checkLock) {
            return;
          }
          checkLock = true;

          setTimeout(process, opts.interval);
        };

        $(window).scroll(onCheck).resize(onCheck);
        checkBinded = true;
      }

      if (opts.force_process) {
        setTimeout(process, opts.interval);
      }

      addSelector(selector);
    },
    // force elements's appearance check
    force_appear: function () {
      if (checkBinded) {
        process();
        return true;
      }
      return false;
    }
  });
}(function () {
  if (typeof module !== 'undefined') {
    // Node
    return require('jquery');
  }
  return jQuery;
}()));
