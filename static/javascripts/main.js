(function() {
  var Main;

  Main = (function() {

    function Main() {
      this.setupEvents();
    }

    Main.prototype.setupEvents = function() {
      return $('.avatar').on('click', function(e) {
        console.log('avatar clicked');
        return $(this).toggleClass('off');
      });
    };

    return Main;

  })();

  window.Main = new Main();

}).call(this);
