/**
 * Custom(ized) jQuery plugin for Comcast Silicon Valley
 *
 * https://github.com/marshallbu/jquery-linkify
 *
 */
function linkify(string, options) {
  var urlRegEx = /(?:(https?|ftps?|file):\/\/)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(?:\/?[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var emailRegEx = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/i;

  string = string.replace(urlRegEx, function(captured, p1) {
    var uri;
    // console.log(captured);
    // console.log(p1);
    if (emailRegEx.test(captured)) {
      //if captured string is an email, use mailto protocol
      uri = 'mailto:' + captured;
    }
    else if (captured.toLowerCase().indexOf('www.') === 0) {
      if (!options.includeW3) {
        return captured;
      }
      uri = options.defaultProtocol + captured;
    }
    else if (options.alwaysIncludeProtocol && (typeof p1 === 'undefined' || p1 === '')) {
      //make sure it doesn't exist already by checking for an empty string in 
      //the passed in p1 capture group from our regex
      //if it doesn't default to
      uri = options.defaultProtocol + captured;
    } else {
      uri = captured;
    }

    return '<a href="' + uri + '" target="' + options.target + '">' + captured + '</a>';
  });

  if (options.buildHashtagUrl) {
    string = string.replace(/\B#(\w+)/g, '<a href="' + options.buildHashtagUrl('$1') + '" target="' + options.target + '">#$1</a>');
  }

  if (options.buildMailToUrl) {
    string = string.replace(/\B#(\w+)/g, '<a href="' + options.buildMailToUrl('$1') + '" target="' + options.target + '">#$1</a>');
  }

  return string;
}

(function($) {
  $.fn.linkify = function(opts) {
    return this.each(function() {
      var $this = $(this);
      var options = {
        includeW3: true,
        target: '_self',
        alwaysIncludeProtocol: false,
        defaultProtocol: 'http://',
        buildHashtagUrl: null,
        buildMailToUrl: null
      };

      if (opts) {
        if (typeof opts  === 'function') {
          // TODO: allow for just a function to be passed in if you want to go with defaults
          // since there are 2 (and will be more) function options, this should be interesting
          // buildHashtagUrl = opts;
        } else {
          if (typeof opts.hashtagUrlBuilder === 'function') {
            options.buildHashtagUrl = opts.hashtagUrlBuilder;
          }
          if (typeof opts.mailToUrlBuilder === 'function') {
            options.buildMailToUrl = opts.mailToUrlBuilder;
          }
          if (typeof opts.includeW3 === 'boolean') {
            options.includeW3 = opts.includeW3;
          }
          if (typeof opts.target === 'string') {
            options.target = opts.target;
          }
          if (typeof opts.alwaysIncludeProtocol === 'boolean') {
            options.alwaysIncludeProtocol = opts.alwaysIncludeProtocol;
          }
        }
      }

      $this.html(linkify($this.html(), options));
    });
  };

})(jQuery);