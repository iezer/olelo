// jquery-text-selection 1.0
(function() {

  /**
   *
   */
  var Selection = (function() {

  	var hasRange = (typeof document.selection !== 'undefined' && typeof document.selection.createRange !== 'undefined');

    return {

      /**
       *
       */
      getSelectionRange: function(el) {

    	  var start,
    	      end,
    	      range,
            rangeLength,
            duplicateRange,
            textRange;

    	  el.focus();

    	  // Mozilla / Safari
    	  if (typeof el.selectionStart !== 'undefined') {

    	    start = el.selectionStart;
    	    end   = el.selectionEnd;

    	  // IE
    	  } else if (hasRange) {

    	    range = document.selection.createRange();
    	    rangeLength = range.text.length;

    	    if(range.parentElement() !== el) {
    	      throw('Unable to get selection range.');
    	    }

    	    // Textarea
    	    if (el.type === 'textarea') {

    	      duplicateRange = range.duplicate();
    	      duplicateRange.moveToElementText(el);
    	      duplicateRange.setEndPoint('EndToEnd', range);

    	      start = duplicateRange.text.length - rangeLength;

    	    // Text Input
    	    } else {

    	      textRange = el.createTextRange();
    	      textRange.setEndPoint("EndToStart", range);

    	      start = textRange.text.length;
    	    }

    	    end = start + rangeLength;

    	  // Unsupported type
    	  } else {
    	    throw('Unable to get selection range.');
    	  }

    	  return {
    	    start: start,
    	    end:   end
    	  };
      },


      /**
       *
       */
    	getSelectionStart: function(el) {
        return this.getSelectionRange(el).start;
      },


      /**
       *
       */
      getSelectionEnd: function(el) {
        return this.getSelectionRange(el).end;
      },


      /**
       *
       */
      setSelectionRange: function(el, start, end) {

        var value,
            range;

    	  el.focus();

    	  if (typeof end === 'undefined') {
    	    end = start;
    	  }

    	  // Mozilla / Safari
    	  if (typeof el.selectionStart !== 'undefined') {

    	    el.setSelectionRange(start, end);

    	  // IE
    	  } else if (hasRange) {

          value = el.value;
    	    range = el.createTextRange();
    	    end   -= start + value.slice(start + 1, end).split("\n").length - 1;
    	    start -= value.slice(0, start).split("\n").length - 1;
    	    range.move('character', start);
    	    range.moveEnd('character', end);
    	    range.select();

    	  // Unsupported
    	  } else {
    	    throw('Unable to set selection range.');
    	  }
      },


      /**
       *
       */
      getSelectedText: function(el) {
    	  var selection = this.getSelectionRange(el);
    	  return el.value.substring(selection.start, selection.end);
      },


      /**
       *
       */
      insertText: function(el, text, start, end, selectText) {

        end = end || start;

    		var textLength = text.length,
    		    selectionEnd  = start + textLength,
    		    beforeText = el.value.substring(0, start),
            afterText  = el.value.substr(end);

    	  el.value = beforeText + text + afterText;

    	  if (selectText === true) {
    	    this.setSelectionRange(el, start, selectionEnd);
    	  } else {
    	    this.setSelectionRange(el, selectionEnd);
    	  }
      },


      /**
       *
       */
      replaceSelectedText: function(el, text, selectText) {
    	  var selection = this.getSelectionRange(el);
    		this.insertText(el, text, selection.start, selection.end, selectText);
      },


      /**
       *
       */
      wrapSelectedText: function(el, beforeText, afterText, selectText) {
    	  var text = beforeText + this.getSelectedText(el) + afterText;
    		this.replaceSelectedText(el, text, selectText);
      }

    };
  })();


  /**
   *
   */
  window.Selection = Selection;


})();

(function($) {


  $.fn.extend({

    /**
     *
     */
    getSelectionRange: function() {
	    return Selection.getSelectionRange(this[0]);
  	},


    /**
     *
     */
  	getSelectionStart: function() {
  	  return Selection.getSelectionStart(this[0]);
  	},


    /**
     *
     */
  	getSelectionEnd: function() {
  	  return Selection.getSelectionEnd(this[0]);
  	},


    /**
     *
     */
  	getSelectedText: function() {
	    return Selection.getSelectedText(this[0]);
  	},


    /**
     *
     */
  	setSelectionRange: function(start, end) {
      return this.each(function() {
        Selection.setSelectionRange(this, start, end);
      });
  	},


    /**
     *
     */
  	insertText: function(text, start, end, selectText) {
      return this.each(function() {
        Selection.insertText(this, text, start, end, selectText);
      });
  	},


    /**
     *
     */
  	replaceSelectedText: function(text, selectText) {
      return this.each(function() {
        Selection.replaceSelectedText(this, text, selectText);
      });
  	},


    /**
     *
     */
  	wrapSelectedText: function(beforeText, afterText, selectText) {
      return this.each(function() {
        Selection.wrapSelectedText(this, beforeText, afterText, selectText);
      });
  	}

  });


})(jQuery);(function($) {
    "use strict";

    var markups = {
        creole: {
            link:   ['[[', 'link text', ']]'],
            bold:   ['**', 'bold text', '**'],
            italic: ['//', 'italic text', '//'],
            ul:     ['* ', 'list item', '', true],
            ol:     ['# ', 'list item', '', true],
            h1:     ['= ', 'headline', '', true],
            h2:     ['== ', 'headline', '', true],
            h3:     ['=== ', 'headline', '', true],
            sub:    ['~~', 'subscript', '~~'],
            sup:    ['^^', 'superscript', '^^'],
            del:    ['--', 'deleted text', '--'],
            ins:    ['++', 'inserted text', '++'],
            image:  ['{{', 'image', '}}'],
            preformatted: ['{{{', 'preformatted', '}}}']
        },
        markdown: {
            link: function(selected) {
                var target = prompt('link target:', selected);
                return target ? ['[', 'link text', '](' + target + ')'] : null;
            },
            bold:   ['**', 'bold text', '**'],
            italic: ['*',  'italic text', '*'],
            ul:     ['* ', 'list item', '', true],
            ol:     ['1. ', 'list item', '', true],
            h1:     ['', 'headline', '\n========', true],
            h2:     ['', 'headline', '\n--------', true],
            image: function(selected) {
                var target = prompt('image path:', selected);
                return target ? ['![', 'image alt text', '](' + target + ')'] : null;
            },
            preformatted: ['    ', 'preformatted', '', true]
        },
        orgmode: {
            bold:   ['*', 'bold text', '*'],
            italic: ['/', 'italic text', '/'],
            ul:     ['- ', 'list item', ''],
            ol:     ['1. ', 'list item', ''],
            h1:     ['* ',  'headline', ''],
            h2:     ['** ', 'headline', ''],
            h3:     ['*** ', 'headline', '']
        },
        textile: {
            link: function(selected) {
                var target = prompt('link target:', selected);
                return target ? ['"', 'link text', '":' + target] : null;
            },
            bold:   ['*', 'bold text', '*'],
            italic: ['_', 'italic text', '_'],
            ul:     ['* ', 'list item', '', true],
            ol:     ['# ', 'list item', '', true],
            h1:     ['h1. ', 'headline', '', true],
            h2:     ['h2. ', 'headline', '', true],
            h3:     ['h3. ', 'headline', '', true],
            em:     ['_', 'emphasized text', '_'],
            sub:    ['~', 'subscript', '~'],
            sup:    ['^', 'superscript', '^'],
            del:    ['-', 'deleted text', '-'],
            ins:    ['+', 'inserted text', '+'],
            image:  ['!', 'image', '!']
        }
    };

    function insertMarkup(textarea, config) {
        var selected = textarea.getSelectedText();
        if (typeof config == 'function') {
            config = config(selected);
        }
        if (!config) {
            return;
        }
        var range = textarea.getSelectionRange();
        var prefix = config[0], content = config[1], suffix = config[2], newline = config[3];
        if (newline) {
            textarea.setSelectionRange(range.start - 1, range.start);
            if (range.start !== 0 && textarea.getSelectedText() != '\n') {
                prefix = '\n' + prefix;
            }
            textarea.setSelectionRange(range.end, range.end + 1);
            if (textarea.getSelectedText() != '\n') {
                suffix += '\n';
            }
        }
        if (range.start == range.end) {
            textarea.insertText(prefix + content + suffix, range.start, range.start, false);
            textarea.setSelectionRange(range.start + prefix.length, range.start + prefix.length + content.length);
        } else {
            textarea.insertText(prefix + selected + suffix, range.start, range.end, false);
        }
    }

    $.fn.markupEditor = function(markup) {
        markup = markups[markup];
        if (markup) {
            var list = $('<ul class="button-bar" id="markup-editor"/>');

            var buttons = [];
            for (var k in markup) {
                 buttons.push(k);
            }
            buttons.sort();
            for (var i = 0; i < buttons.length; ++i) {
                list.append('<li><a href="#" id="markup-editor-' + buttons[i] + '">' + buttons[i] + '</a></li>');
            }
            this.before(list);

            var textarea = this;
            $('a', list).click(function() {
                insertMarkup(textarea, markup[this.id.substr(14)]);
                return false;
            });
        }
    };
})(jQuery);
$(function() {
    "use strict";

    var mime = Olelo.page_mime;
    if (mime == 'application/x-empty' || mime == 'inode/directory') {
	mime = Olelo.default_mime;
    }
    var match = /text\/x-(\w+)/.exec(mime);
    if (match) {
	$('#edit-content').markupEditor(match[1]);
    }
});
