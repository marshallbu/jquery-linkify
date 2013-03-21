function linkify(string, buildHashtagUrl, includeW3, target) {
  var urlRegEx = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(?:\/?[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/gi;
  var emailRegEx = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/i;

  string = string.replace(urlRegEx, function(captured) {
    var uri;

    if (emailRegEx.test(captured)) {
      //if captured string is an email, use mailto protocol
      uri = 'mailto:' + captured;
    }
    else if (captured.toLowerCase().indexOf('www.') === 0) {
      if (!includeW3) {
        return captured;
      }
      uri = 'http://' + captured;
    } else {
      uri = captured;
    }

    return '<a href="' + uri + '" target="' + target + '">' + captured + '</a>';
  });

  if (buildHashtagUrl) {
    string = string.replace(/\B#(\w+)/g, '<a href="' + buildHashtagUrl('$1') + '" target="' + target + '">#$1</a>');
  }

  return string;
}

(function($) {
  $.fn.linkify = function(opts) {
    return this.each(function() {
      var $this = $(this);
      var buildHashtagUrl;
      var includeW3 = true;
      var target = '_self';

      if (opts) {
        if (typeof opts  === "function") {
          buildHashtagUrl = opts;
        } else {
          if (typeof opts.hashtagUrlBuilder === "function") {
            buildHashtagUrl = opts.hashtagUrlBuilder;
          }
          if (typeof opts.includeW3 === "boolean") {
            includeW3 = opts.includeW3;
          }
          if (typeof opts.target === "string") {
            target = opts.target;
          }
        }
      }

      $this.html(linkify($this.html(), buildHashtagUrl, includeW3, target));
    });
  };

})(jQuery);