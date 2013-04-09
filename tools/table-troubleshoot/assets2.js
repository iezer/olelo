/* editor/markup/script.js */
(function(){var e=function(){var g=typeof document.selection!=="undefined"&&typeof document.selection.createRange!=="undefined";return{getSelectionRange:function(a){var b,c,d;a.focus();if(typeof a.selectionStart!=="undefined"){b=a.selectionStart;c=a.selectionEnd}else if(g){b=document.selection.createRange();c=b.text.length;if(b.parentElement()!==a)throw"Unable to get selection range.";if(a.type==="textarea"){d=b.duplicate();d.moveToElementText(a);d.setEndPoint("EndToEnd",b);b=d.text.length-c}else{a=
a.createTextRange();a.setEndPoint("EndToStart",b);b=a.text.length}c=b+c}else throw"Unable to get selection range.";return{start:b,end:c}},getSelectionStart:function(a){return this.getSelectionRange(a).start},getSelectionEnd:function(a){return this.getSelectionRange(a).end},setSelectionRange:function(a,b,c){var d;a.focus();if(typeof c==="undefined")c=b;if(typeof a.selectionStart!=="undefined")a.setSelectionRange(b,c);else if(g){d=a.value;a=a.createTextRange();c-=b+d.slice(b+1,c).split("\n").length-
1;b-=d.slice(0,b).split("\n").length-1;a.move("character",b);a.moveEnd("character",c);a.select()}else throw"Unable to set selection range.";},getSelectedText:function(a){var b=this.getSelectionRange(a);return a.value.substring(b.start,b.end)},insertText:function(a,b,c,d,h){d=d||c;var i=c+b.length,k=a.value.substring(0,c);d=a.value.substr(d);a.value=k+b+d;h===true?this.setSelectionRange(a,c,i):this.setSelectionRange(a,i)},replaceSelectedText:function(a,b,c){var d=this.getSelectionRange(a);this.insertText(a,
b,d.start,d.end,c)},wrapSelectedText:function(a,b,c,d){b=b+this.getSelectedText(a)+c;this.replaceSelectedText(a,b,d)}}}();window.Selection=e})();
(function(e){e.fn.extend({getSelectionRange:function(){return Selection.getSelectionRange(this[0])},getSelectionStart:function(){return Selection.getSelectionStart(this[0])},getSelectionEnd:function(){return Selection.getSelectionEnd(this[0])},getSelectedText:function(){return Selection.getSelectedText(this[0])},setSelectionRange:function(g,a){return this.each(function(){Selection.setSelectionRange(this,g,a)})},insertText:function(g,a,b,c){return this.each(function(){Selection.insertText(this,g,a,
b,c)})},replaceSelectedText:function(g,a){return this.each(function(){Selection.replaceSelectedText(this,g,a)})},wrapSelectedText:function(g,a,b){return this.each(function(){Selection.wrapSelectedText(this,g,a,b)})}})})(jQuery);(function(e){var g={creole:{link:["[[","link text","]]"],bold:["**","bold text","**"],italic:["//","italic text","//"],ul:["* ","list item","",true],ol:["# ","list item","",true],h1:["= ","headline","",true],h2:["== ","headline","",true],h3:["=== ","headline","",true],sub:["~~","subscript","~~"],sup:["^^","superscript","^^"],del:["--","deleted text","--"],ins:["++","inserted text","++"],image:["{{","image","}}"],preformatted:["{{{","preformatted","}}}"]},markdown:{link:function(a){return(a=prompt("link target:",
a))?["[","link text","]("+a+")"]:null},bold:["**","bold text","**"],italic:["*","italic text","*"],ul:["* ","list item","",true],ol:["1. ","list item","",true],h1:["","headline","\n========",true],h2:["","headline","\n--------",true],image:function(a){return(a=prompt("image path:",a))?["![","image alt text","]("+a+")"]:null},preformatted:["    ","preformatted","",true]},orgmode:{bold:["*","bold text","*"],italic:["/","italic text","/"],ul:["- ","list item",""],ol:["1. ","list item",""],h1:["* ","headline",
""],h2:["** ","headline",""],h3:["*** ","headline",""]},textile:{link:function(a){return(a=prompt("link target:",a))?['"',"link text",'":'+a]:null},bold:["*","bold text","*"],italic:["_","italic text","_"],ul:["* ","list item","",true],ol:["# ","list item","",true],h1:["h1. ","headline","",true],h2:["h2. ","headline","",true],h3:["h3. ","headline","",true],em:["_","emphasized text","_"],sub:["~","subscript","~"],sup:["^","superscript","^"],del:["-","deleted text","-"],ins:["+","inserted text","+"],
image:["!","image","!"]}};e.fn.markupEditor=function(a){if(a=g[a]){var b=e('<ul class="button-bar" id="markup-editor"/>'),c=[];for(var d in a)c.push(d);c.sort();for(d=0;d<c.length;++d)b.append('<li><a href="#" id="markup-editor-'+c[d]+'">'+c[d]+"</a></li>");this.before(b);var h=this;e("a",b).click(function(){var i=a[this.id.substr(14)],k=h.getSelectedText();if(typeof i=="function")i=i(k);if(i){var f=h.getSelectionRange(),j=i[0],m=i[1],l=i[2];if(i[3]){h.setSelectionRange(f.start-1,f.start);if(f.start!==
0&&h.getSelectedText()!="\n")j="\n"+j;h.setSelectionRange(f.end,f.end+1);if(h.getSelectedText()!="\n")l+="\n"}if(f.start==f.end){h.insertText(j+m+l,f.start,f.start,false);h.setSelectionRange(f.start+j.length,f.start+j.length+m.length)}else h.insertText(j+k+l,f.start,f.end,false)}return false})}}})(jQuery);$(function(){var e=Olelo.page_mime;if(e=="application/x-empty"||e=="inode/directory")e=Olelo.default_mime;(e=/text\/x-(\w+)/.exec(e))&&$("#edit-content").markupEditor(e[1])});


/* history/script/00-init.js */
$(function() {
    "use strict";
    $('#content').bind('pageLoaded', function pageLoaded() {
        $('#history', this).historyTable();
    });
    $('#history').historyTable();
});


/* history/script/01-historytable.js */
(function($) {
    "use strict";

    $.fn.historyTable = function() {
	$('thead tr', this).prepend('<th class="compare"><button>&#177;</button></th>');
	$('tbody tr', this).each(function() {
	    var version = $(this).attr('id').substr(8);
	    $(this).prepend('<td class="compare"><input type="checkbox" name="' + version + '"/></td>');
	});
	var versions = $.storage.get('historyTable');
	if (versions) {
	    for (var i = 0; i < versions.length; ++i)
		$('input[name=' + versions[i] + ']').attr('checked', 'checked');
	}

	var checkboxes = $('tbody input', this);
	function getSelectedVersions() {
	    var versions = [];
	    checkboxes.each(function() {
		if (this.checked) {
		    versions.push(this.name);
		}
	    });
	    return versions;
	}

	var button = $('th button', this);
	button.click(function() {
	    var versions = getSelectedVersions();
	    $.storage.set('historyTable', versions);
            location.href = location.pathname.replace('/history', '/compare/' + versions[versions.length-1] + '...' + versions[0]);
	});

	$('td input', this).change(function() {
	    var versions = getSelectedVersions();
	    if (versions.length > 1)
		button.removeAttr('disabled');
	    else
		button.attr('disabled', 'disabled');
	}).change();
    };
})(jQuery);


/* misc/fancybox/script.js */
(function(b){function a(d){var j=d||window.event,k=[].slice.call(arguments,1),w=0,o=0,x=0;d=b.event.fix(j);d.type="mousewheel";if(j.wheelDelta)w=j.wheelDelta/120;if(j.detail)w=-j.detail/3;x=w;if(j.axis!==undefined&&j.axis===j.HORIZONTAL_AXIS){x=0;o=-1*w}if(j.wheelDeltaY!==undefined)x=j.wheelDeltaY/120;if(j.wheelDeltaX!==undefined)o=-1*j.wheelDeltaX/120;k.unshift(d,w,o,x);return(b.event.dispatch||b.event.handle).apply(this,k)}var f=["DOMMouseScroll","mousewheel"];if(b.event.fixHooks)for(var e=f.length;e;)b.event.fixHooks[f[--e]]=
b.event.mouseHooks;b.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var d=f.length;d;)this.addEventListener(f[--d],a,false);else this.onmousewheel=a},teardown:function(){if(this.removeEventListener)for(var d=f.length;d;)this.removeEventListener(f[--d],a,false);else this.onmousewheel=null}};b.fn.extend({mousewheel:function(d){return d?this.bind("mousewheel",d):this.trigger("mousewheel")},unmousewheel:function(d){return this.unbind("mousewheel",d)}})})(jQuery);jQuery.easing.jswing=jQuery.easing.swing;
jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(b,a,f,e,d){return jQuery.easing[jQuery.easing.def](b,a,f,e,d)},easeInQuad:function(b,a,f,e,d){return e*(a/=d)*a+f},easeOutQuad:function(b,a,f,e,d){return-e*(a/=d)*(a-2)+f},easeInOutQuad:function(b,a,f,e,d){if((a/=d/2)<1)return e/2*a*a+f;return-e/2*(--a*(a-2)-1)+f},easeInCubic:function(b,a,f,e,d){return e*(a/=d)*a*a+f},easeOutCubic:function(b,a,f,e,d){return e*((a=a/d-1)*a*a+1)+f},easeInOutCubic:function(b,a,f,e,d){if((a/=d/2)<1)return e/
2*a*a*a+f;return e/2*((a-=2)*a*a+2)+f},easeInQuart:function(b,a,f,e,d){return e*(a/=d)*a*a*a+f},easeOutQuart:function(b,a,f,e,d){return-e*((a=a/d-1)*a*a*a-1)+f},easeInOutQuart:function(b,a,f,e,d){if((a/=d/2)<1)return e/2*a*a*a*a+f;return-e/2*((a-=2)*a*a*a-2)+f},easeInQuint:function(b,a,f,e,d){return e*(a/=d)*a*a*a*a+f},easeOutQuint:function(b,a,f,e,d){return e*((a=a/d-1)*a*a*a*a+1)+f},easeInOutQuint:function(b,a,f,e,d){if((a/=d/2)<1)return e/2*a*a*a*a*a+f;return e/2*((a-=2)*a*a*a*a+2)+f},easeInSine:function(b,
a,f,e,d){return-e*Math.cos(a/d*(Math.PI/2))+e+f},easeOutSine:function(b,a,f,e,d){return e*Math.sin(a/d*(Math.PI/2))+f},easeInOutSine:function(b,a,f,e,d){return-e/2*(Math.cos(Math.PI*a/d)-1)+f},easeInExpo:function(b,a,f,e,d){return a==0?f:e*Math.pow(2,10*(a/d-1))+f},easeOutExpo:function(b,a,f,e,d){return a==d?f+e:e*(-Math.pow(2,-10*a/d)+1)+f},easeInOutExpo:function(b,a,f,e,d){if(a==0)return f;if(a==d)return f+e;if((a/=d/2)<1)return e/2*Math.pow(2,10*(a-1))+f;return e/2*(-Math.pow(2,-10*--a)+2)+f},
easeInCirc:function(b,a,f,e,d){return-e*(Math.sqrt(1-(a/=d)*a)-1)+f},easeOutCirc:function(b,a,f,e,d){return e*Math.sqrt(1-(a=a/d-1)*a)+f},easeInOutCirc:function(b,a,f,e,d){if((a/=d/2)<1)return-e/2*(Math.sqrt(1-a*a)-1)+f;return e/2*(Math.sqrt(1-(a-=2)*a)+1)+f},easeInElastic:function(b,a,f,e,d){b=1.70158;var j=0,k=e;if(a==0)return f;if((a/=d)==1)return f+e;j||(j=d*0.3);if(k<Math.abs(e)){k=e;b=j/4}else b=j/(2*Math.PI)*Math.asin(e/k);return-(k*Math.pow(2,10*(a-=1))*Math.sin((a*d-b)*2*Math.PI/j))+f},easeOutElastic:function(b,
a,f,e,d){b=1.70158;var j=0,k=e;if(a==0)return f;if((a/=d)==1)return f+e;j||(j=d*0.3);if(k<Math.abs(e)){k=e;b=j/4}else b=j/(2*Math.PI)*Math.asin(e/k);return k*Math.pow(2,-10*a)*Math.sin((a*d-b)*2*Math.PI/j)+e+f},easeInOutElastic:function(b,a,f,e,d){b=1.70158;var j=0,k=e;if(a==0)return f;if((a/=d/2)==2)return f+e;j||(j=d*0.3*1.5);if(k<Math.abs(e)){k=e;b=j/4}else b=j/(2*Math.PI)*Math.asin(e/k);if(a<1)return-0.5*k*Math.pow(2,10*(a-=1))*Math.sin((a*d-b)*2*Math.PI/j)+f;return k*Math.pow(2,-10*(a-=1))*Math.sin((a*
d-b)*2*Math.PI/j)*0.5+e+f},easeInBack:function(b,a,f,e,d,j){if(j==undefined)j=1.70158;return e*(a/=d)*a*((j+1)*a-j)+f},easeOutBack:function(b,a,f,e,d,j){if(j==undefined)j=1.70158;return e*((a=a/d-1)*a*((j+1)*a+j)+1)+f},easeInOutBack:function(b,a,f,e,d,j){if(j==undefined)j=1.70158;if((a/=d/2)<1)return e/2*a*a*(((j*=1.525)+1)*a-j)+f;return e/2*((a-=2)*a*(((j*=1.525)+1)*a+j)+2)+f},easeInBounce:function(b,a,f,e,d){return e-jQuery.easing.easeOutBounce(b,d-a,0,e,d)+f},easeOutBounce:function(b,a,f,e,d){return(a/=
d)<1/2.75?e*7.5625*a*a+f:a<2/2.75?e*(7.5625*(a-=1.5/2.75)*a+0.75)+f:a<2.5/2.75?e*(7.5625*(a-=2.25/2.75)*a+0.9375)+f:e*(7.5625*(a-=2.625/2.75)*a+0.984375)+f},easeInOutBounce:function(b,a,f,e,d){if(a<d/2)return jQuery.easing.easeInBounce(b,a*2,0,e,d)*0.5+f;return jQuery.easing.easeOutBounce(b,a*2-d,0,e,d)*0.5+e*0.5+f}});(function(b){var a,f,e,d,j,k,w,o,x,C,t=0,i={},r=[],s=0,h={},q=[],G=null,y=new Image,J=/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i,V=/[^\.]\.(swf)\s*$/i,K,L=1,B=0,v="",u,n,m=false,D=b.extend(b("<div/>")[0],{prop:0}),M=function(){f.hide();y.onerror=y.onload=null;G&&G.abort();a.empty()},N=function(){if(false===i.onError(r,t,i)){f.hide();m=false}else{i.titleShow=false;i.width="auto";i.height="auto";a.html('<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>');F()}},I=
function(){var c=r[t],g,l,p,E,O,z;M();i=b.extend({},b.fn.fancybox.defaults,typeof b(c).data("fancybox")=="undefined"?i:b(c).data("fancybox"));z=i.onStart(r,t,i);if(z===false)m=false;else{if(typeof z=="object")i=b.extend(i,z);p=i.title||(c.nodeName?b(c).attr("title"):c.title)||"";if(c.nodeName&&!i.orig)i.orig=b(c).children("img:first").length?b(c).children("img:first"):b(c);if(p===""&&i.orig&&i.titleFromAlt)p=i.orig.attr("alt");g=i.href||(c.nodeName?b(c).attr("href"):c.href)||null;if(/^(?:javascript)/i.test(g)||
g=="#")g=null;if(i.type){l=i.type;if(!g)g=i.content}else if(i.content)l="html";else if(g)l=g.match(J)?"image":g.match(V)?"swf":b(c).hasClass("iframe")?"iframe":g.indexOf("#")===0?"inline":"ajax";if(l){if(l=="inline"){c=g.substr(g.indexOf("#"));l=b(c).length>0?"inline":"ajax"}i.type=l;i.href=g;i.title=p;if(i.autoDimensions)if(i.type=="html"||i.type=="inline"||i.type=="ajax"){i.width="auto";i.height="auto"}else i.autoDimensions=false;if(i.modal){i.overlayShow=true;i.hideOnOverlayClick=false;i.hideOnContentClick=
false;i.enableEscapeButton=false;i.showCloseButton=false}i.padding=parseInt(i.padding,10);i.margin=parseInt(i.margin,10);a.css("padding",i.padding+i.margin);b(".fancybox-inline-tmp").unbind("fancybox-cancel").bind("fancybox-change",function(){b(this).replaceWith(k.children())});switch(l){case "html":a.html(i.content);F();break;case "inline":if(b(c).parent().is("#fancybox-content")===true){m=false;return}b('<div class="fancybox-inline-tmp" />').hide().insertBefore(b(c)).bind("fancybox-cleanup",function(){b(this).replaceWith(k.children())}).bind("fancybox-cancel",
function(){b(this).replaceWith(a.children())});b(c).appendTo(a);F();break;case "image":m=false;b.fancybox.showActivity();y=new Image;y.onerror=function(){N()};y.onload=function(){m=true;y.onerror=y.onload=null;i.width=y.width;i.height=y.height;b("<img />").attr({id:"fancybox-img",src:y.src,alt:i.title}).appendTo(a);P()};y.src=g;break;case "swf":i.scrolling="no";E='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+i.width+'" height="'+i.height+'"><param name="movie" value="'+g+
'"></param>';O="";b.each(i.swf,function(A,H){E+='<param name="'+A+'" value="'+H+'"></param>';O+=" "+A+'="'+H+'"'});E+='<embed src="'+g+'" type="application/x-shockwave-flash" width="'+i.width+'" height="'+i.height+'"'+O+"></embed></object>";a.html(E);F();break;case "ajax":m=false;b.fancybox.showActivity();i.ajax.win=i.ajax.success;G=b.ajax(b.extend({},i.ajax,{url:g,data:i.ajax.data||{},error:function(A){A.status>0&&N()},success:function(A,H,Q){if((typeof Q=="object"?Q:G).status==200){if(typeof i.ajax.win==
"function"){z=i.ajax.win(g,A,H,Q);if(z===false){f.hide();return}else if(typeof z=="string"||typeof z=="object")A=z}a.html(A);F()}}}));break;case "iframe":P();break}}else N()}},F=function(){var c=i.width,g=i.height;c=c.toString().indexOf("%")>-1?parseInt((b(window).width()-i.margin*2)*parseFloat(c)/100,10)+"px":c=="auto"?"auto":c+"px";g=g.toString().indexOf("%")>-1?parseInt((b(window).height()-i.margin*2)*parseFloat(g)/100,10)+"px":g=="auto"?"auto":g+"px";a.wrapInner('<div style="width:'+c+";height:"+
g+";overflow: "+(i.scrolling=="auto"?"auto":i.scrolling=="yes"?"scroll":"hidden")+';position:relative;"></div>');i.width=a.width();i.height=a.height();P()},P=function(){var c,g;f.hide();if(d.is(":visible")&&false===h.onCleanup(q,s,h)){b.event.trigger("fancybox-cancel");m=false}else{m=true;b(k.add(e)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");d.is(":visible")&&h.titlePosition!=="outside"&&d.css("height",d.height());q=r;s=t;h=i;if(h.overlayShow){e.css({"background-color":h.overlayColor,
opacity:h.overlayOpacity,cursor:h.hideOnOverlayClick?"pointer":"auto",height:b(document).height()});e.is(":visible")||e.show()}else e.hide();n=W();v=h.title||"";B=0;o.empty().removeAttr("style").removeClass();if(h.titleShow!==false){if(b.isFunction(h.titleFormat))c=h.titleFormat(v,q,s,h);else c=v&&v.length?h.titlePosition=="float"?'<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">'+v+'</td><td id="fancybox-title-float-right"></td></tr></table>':
'<div id="fancybox-title-'+h.titlePosition+'">'+v+"</div>":false;v=c;if(!(!v||v==="")){o.addClass("fancybox-title-"+h.titlePosition).html(v).appendTo("body").show();switch(h.titlePosition){case "inside":o.css({width:n.width-h.padding*2,marginLeft:h.padding,marginRight:h.padding});B=o.outerHeight(true);o.appendTo(j);n.height+=B;break;case "over":o.css({marginLeft:h.padding,width:n.width-h.padding*2,bottom:h.padding}).appendTo(j);break;case "float":o.css("left",parseInt((o.width()-n.width-40)/2,10)*
-1).appendTo(d);break;default:o.css({width:n.width-h.padding*2,paddingLeft:h.padding,paddingRight:h.padding}).appendTo(d);break}}}o.hide();if(d.is(":visible")){b(w.add(x).add(C)).hide();c=d.position();u={top:c.top,left:c.left,width:d.width(),height:d.height()};g=u.width==n.width&&u.height==n.height;k.fadeTo(h.changeFade,0.3,function(){var l=function(){k.html(a.contents()).fadeTo(h.changeFade,1,R)};b.event.trigger("fancybox-change");k.empty().removeAttr("filter").css({"border-width":h.padding,width:n.width-
h.padding*2,height:i.autoDimensions?"auto":n.height-B-h.padding*2});if(g)l();else{D.prop=0;b(D).animate({prop:1},{duration:h.changeSpeed,easing:h.easingChange,step:S,complete:l})}})}else{d.removeAttr("style");k.css("border-width",h.padding);if(h.transitionIn=="elastic"){u=U();k.html(a.contents());d.show();if(h.opacity)n.opacity=0;D.prop=0;b(D).animate({prop:1},{duration:h.speedIn,easing:h.easingIn,step:S,complete:R})}else{h.titlePosition=="inside"&&B>0&&o.show();k.css({width:n.width-h.padding*2,height:i.autoDimensions?
"auto":n.height-B-h.padding*2}).html(a.contents());d.css(n).fadeIn(h.transitionIn=="none"?0:h.speedIn,R)}}}},X=function(){if(h.enableEscapeButton||h.enableKeyboardNav)b(document).bind("keydown.fb",function(c){if(c.keyCode==27&&h.enableEscapeButton){c.preventDefault();b.fancybox.close()}else if((c.keyCode==37||c.keyCode==39)&&h.enableKeyboardNav&&c.target.tagName!=="INPUT"&&c.target.tagName!=="TEXTAREA"&&c.target.tagName!=="SELECT"){c.preventDefault();b.fancybox[c.keyCode==37?"prev":"next"]()}});if(h.showNavArrows){if(h.cyclic&&
q.length>1||s!==0)x.show();if(h.cyclic&&q.length>1||s!=q.length-1)C.show()}else{x.hide();C.hide()}},R=function(){if(!b.support.opacity){k.get(0).style.removeAttribute("filter");d.get(0).style.removeAttribute("filter")}i.autoDimensions&&k.css("height","auto");d.css("height","auto");v&&v.length&&o.show();h.showCloseButton&&w.show();X();h.hideOnContentClick&&k.bind("click",b.fancybox.close);h.hideOnOverlayClick&&e.bind("click",b.fancybox.close);b(window).bind("resize.fb",b.fancybox.resize);h.centerOnScroll&&
b(window).bind("scroll.fb",b.fancybox.center);if(h.type=="iframe")b('<iframe id="fancybox-frame" name="fancybox-frame'+(new Date).getTime()+'" frameborder="0" hspace="0" '+(b.browser.msie?'allowtransparency="true""':"")+' scrolling="'+i.scrolling+'" src="'+h.href+'"></iframe>').appendTo(k);d.show();m=false;b.fancybox.center();h.onComplete(q,s,h);var c,g;if(q.length-1>s){c=q[s+1].href;if(typeof c!=="undefined"&&c.match(J)){g=new Image;g.src=c}}if(s>0){c=q[s-1].href;if(typeof c!=="undefined"&&c.match(J)){g=
new Image;g.src=c}}},S=function(c){var g={width:parseInt(u.width+(n.width-u.width)*c,10),height:parseInt(u.height+(n.height-u.height)*c,10),top:parseInt(u.top+(n.top-u.top)*c,10),left:parseInt(u.left+(n.left-u.left)*c,10)};if(typeof n.opacity!=="undefined")g.opacity=c<0.5?0.5:c;d.css(g);k.css({width:g.width-h.padding*2,height:g.height-B*c-h.padding*2})},T=function(){return[b(window).width()-h.margin*2,b(window).height()-h.margin*2,b(document).scrollLeft()+h.margin,b(document).scrollTop()+h.margin]},
W=function(){var c=T(),g={},l=h.autoScale,p=h.padding*2;g.width=h.width.toString().indexOf("%")>-1?parseInt(c[0]*parseFloat(h.width)/100,10):h.width+p;g.height=h.height.toString().indexOf("%")>-1?parseInt(c[1]*parseFloat(h.height)/100,10):h.height+p;if(l&&(g.width>c[0]||g.height>c[1]))if(i.type=="image"||i.type=="swf"){l=h.width/h.height;if(g.width>c[0]){g.width=c[0];g.height=parseInt((g.width-p)/l+p,10)}if(g.height>c[1]){g.height=c[1];g.width=parseInt((g.height-p)*l+p,10)}}else{g.width=Math.min(g.width,
c[0]);g.height=Math.min(g.height,c[1])}g.top=parseInt(Math.max(c[3]-20,c[3]+(c[1]-g.height-40)*0.5),10);g.left=parseInt(Math.max(c[2]-20,c[2]+(c[0]-g.width-40)*0.5),10);return g},U=function(){var c=i.orig?b(i.orig):false,g={};if(c&&c.length){g=c.offset();g.top+=parseInt(c.css("paddingTop"),10)||0;g.left+=parseInt(c.css("paddingLeft"),10)||0;g.top+=parseInt(c.css("border-top-width"),10)||0;g.left+=parseInt(c.css("border-left-width"),10)||0;g.width=c.width();g.height=c.height();g={width:g.width+h.padding*
2,height:g.height+h.padding*2,top:g.top-h.padding-20,left:g.left-h.padding-20}}else{c=T();g={width:h.padding*2,height:h.padding*2,top:parseInt(c[3]+c[1]*0.5,10),left:parseInt(c[2]+c[0]*0.5,10)}}return g},Y=function(){if(f.is(":visible")){b("div",f).css("top",L*-40+"px");L=(L+1)%12}else clearInterval(K)};b.fn.fancybox=function(c){if(!b(this).length)return this;b(this).data("fancybox",b.extend({},c,b.metadata?b(this).metadata():{})).unbind("click.fb").bind("click.fb",function(g){g.preventDefault();
if(!m){m=true;b(this).blur();r=[];t=0;g=b(this).attr("rel")||"";if(!g||g==""||g==="nofollow")r.push(this);else{r=b("a[rel="+g+"], area[rel="+g+"]");t=r.index(this)}I()}});return this};b.fancybox=function(c,g){var l;if(!m){m=true;l=typeof g!=="undefined"?g:{};r=[];t=parseInt(l.index,10)||0;if(b.isArray(c)){for(var p=0,E=c.length;p<E;p++)if(typeof c[p]=="object")b(c[p]).data("fancybox",b.extend({},l,c[p]));else c[p]=b({}).data("fancybox",b.extend({content:c[p]},l));r=jQuery.merge(r,c)}else{if(typeof c==
"object")b(c).data("fancybox",b.extend({},l,c));else c=b({}).data("fancybox",b.extend({content:c},l));r.push(c)}if(t>r.length||t<0)t=0;I()}};b.fancybox.showActivity=function(){clearInterval(K);f.show();K=setInterval(Y,66)};b.fancybox.hideActivity=function(){f.hide()};b.fancybox.next=function(){return b.fancybox.pos(s+1)};b.fancybox.prev=function(){return b.fancybox.pos(s-1)};b.fancybox.pos=function(c){if(!m){c=parseInt(c);r=q;if(c>-1&&c<q.length){t=c;I()}else if(h.cyclic&&q.length>1){t=c>=q.length?
0:q.length-1;I()}}};b.fancybox.cancel=function(){if(!m){m=true;b.event.trigger("fancybox-cancel");M();i.onCancel(r,t,i);m=false}};b.fancybox.close=function(){function c(){e.fadeOut("fast");o.empty().hide();d.hide();b.event.trigger("fancybox-cleanup");k.empty();h.onClosed(q,s,h);q=i=[];s=t=0;h=i={};m=false}if(!(m||d.is(":hidden"))){m=true;if(h&&false===h.onCleanup(q,s,h))m=false;else{M();b(w.add(x).add(C)).hide();b(k.add(e)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");
k.find("iframe").attr("src","about:blank");h.titlePosition!=="inside"&&o.empty();d.stop();if(h.transitionOut=="elastic"){u=U();var g=d.position();n={top:g.top,left:g.left,width:d.width(),height:d.height()};if(h.opacity)n.opacity=1;o.empty().hide();D.prop=1;b(D).animate({prop:0},{duration:h.speedOut,easing:h.easingOut,step:S,complete:c})}else d.fadeOut(h.transitionOut=="none"?0:h.speedOut,c)}}};b.fancybox.resize=function(){e.is(":visible")&&e.css("height",b(document).height());b.fancybox.center(true)};
b.fancybox.center=function(c){var g,l;if(!m){l=c===true?1:0;g=T();!l&&(d.width()>g[0]||d.height()>g[1])||d.stop().animate({top:parseInt(Math.max(g[3]-20,g[3]+(g[1]-k.height()-40)*0.5-h.padding)),left:parseInt(Math.max(g[2]-20,g[2]+(g[0]-k.width()-40)*0.5-h.padding))},typeof c=="number"?c:200)}};b.fancybox.init=function(){if(!b("#fancybox-wrap").length){b("body").append(a=b('<div id="fancybox-tmp"></div>'),f=b('<div id="fancybox-loading"><div></div></div>'),e=b('<div id="fancybox-overlay"></div>'),
d=b('<div id="fancybox-wrap"></div>'));j=b('<div id="fancybox-outer"></div>').append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>').appendTo(d);
j.append(k=b('<div id="fancybox-content"></div>'),w=b('<a id="fancybox-close"></a>'),o=b('<div id="fancybox-title"></div>'),x=b('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),C=b('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>'));w.click(b.fancybox.close);f.click(b.fancybox.cancel);x.click(function(c){c.preventDefault();b.fancybox.prev()});C.click(function(c){c.preventDefault();b.fancybox.next()});
b.fn.mousewheel&&d.bind("mousewheel.fb",function(c,g){if(m)c.preventDefault();else if(b(c.target).get(0).clientHeight==0||b(c.target).get(0).scrollHeight===b(c.target).get(0).clientHeight){c.preventDefault();b.fancybox[g>0?"prev":"next"]()}});b.support.opacity||d.addClass("fancybox-ie")}};b.fn.fancybox.defaults={padding:10,margin:40,opacity:false,modal:false,cyclic:false,scrolling:"auto",width:560,height:340,autoScale:true,autoDimensions:true,centerOnScroll:false,ajax:{},swf:{wmode:"transparent"},
hideOnOverlayClick:true,hideOnContentClick:false,overlayShow:true,overlayOpacity:0.7,overlayColor:"#777",titleShow:true,titlePosition:"float",titleFormat:null,titleFromAlt:false,transitionIn:"fade",transitionOut:"fade",speedIn:300,speedOut:300,changeSpeed:300,changeFade:"fast",easingIn:"swing",easingOut:"swing",showCloseButton:true,showNavArrows:true,enableEscapeButton:true,enableKeyboardNav:true,onStart:function(){},onCancel:function(){},onComplete:function(){},onCleanup:function(){},onClosed:function(){},
onError:function(){}};b(document).ready(function(){b.fancybox.init()})})(jQuery);$(function(){function b(){$("a.fancybox").each(function(){var a=this.href.replace(/aspect=\w+/g,"");this.href=a+(a.indexOf("?")<0?"?":"&")+"aspect=image&geometry=800x800>"});$("a.fancybox").fancybox({transitionIn:"none",transitionOut:"none",titlePosition:"over",titleFormat:function(a,f,e){return'<span id="fancybox-title-over">'+(e+1)+" / "+f.length+" "+(a?a:"")+"</span>"}})}$("#content").bind("pageLoaded",b);b()});



/* treeview/script.js */
(function(b){b.fn.treeView=function(a){function l(c,e){if(a.stateStore){var d=b.storage.get(a.stateStore,[]);if(e)b.inArray(c,d)<0&&d.push(c);else d=b.grep(d,function(f){return f!=c});b.storage.set(a.stateStore,d)}}function m(c){var e=c[2],d=b('<li><div class="'+(c[0]?"hitarea collapsed":"placeholder")+'"><div class="arrow"/><div class="'+c[1]+'"/></div><a href="'+e+'">'+c[3]+"</a></li>"),f=d.children(".hitarea");d.data("name",c[3]);f.click(function(){if(f.hasClass("collapsed")){n(d,e);f.removeClass("collapsed").addClass("expanded")}else{d.children("ul").hide();
f.removeClass("expanded").addClass("collapsed")}l(e,f.hasClass("expanded"));return false});if(a.stateStore&&b.inArray(e,b.storage.get(a.stateStore,[]))>=0){n(d,e);f.removeClass("collapsed").addClass("expanded")}return d}function n(c,e){function d(i){var j=b("<ul/>");b.each(i,function(o,k){j.append(m(k))});e==a.root&&c.empty();c.children("ul").remove();c.append(j)}function f(i){g&&b.storage.set(g,i);var j={},o=[];b.each(i,function(k,h){j[h[3]]=h});b("> ul > li",c).each(function(){var k=b(this),h=k.data("name");
if(j[h])delete j[h];else k.remove();o.push(b(this))});b.each(j,function(k,h){var p=false;b.each(o,function(t,q){if(k<q.data("name")){p=true;q.before(m(h));return false}});p||c.children("ul").append(m(h))})}function r(){setTimeout(function(){a.ajax(e,f,function(){g&&b.storage.remove(g)})},a.delay)}var g=a.cacheStore?a.cacheStore+":"+e:null;if(c.children("ul").length!==0){c.children("ul").show();r()}else{var s=g?b.storage.get(g):null;if(s){d(s);r()}else{c.addClass("wait");a.ajax(e,function(i){c.removeClass("wait");
d(i);g&&b.storage.set(g,i)},function(){c.removeClass("wait")})}}}a||(a={});if(!a.root)a.root="/";if(!a.url)a.url="/treeview.json";if(!a.delay)a.delay=2E3;if(!a.ajax)a.ajax=function(c,e,d){b.ajax({url:a.url,data:{dir:c},success:e,error:d,dataType:"json"})};this.each(function(){n(b(this),a.root)})}})(jQuery);$(function(){$.translations({en:{menu:"Menu",tree:"Tree"},de:{menu:"Men\u00fc",tree:"Baumansicht"},cs:{menu:"Menu",tree:"Strom"},fr:{menu:"Menu",tree:"Arbre"}});$("#sidebar").wrapInner('<div id="sidebar-menu"/>').prepend('<div id="sidebar-tree" style="display: none"><h1>'+$.t("tree")+'</h1><div id="treeview"/></div>');$("#menu").prepend('<ul><li class="selected" id="sidebar-tab-menu"><a href="#sidebar-menu">'+$.t("menu")+'</a></li><li id="sidebar-tab-tree"><a href="#sidebar-tree">'+$.t("tree")+"</a></li></ul>");
$("#sidebar-tab-menu, #sidebar-tab-tree").tabWidget({store:"sidebar-tab"});$("#treeview").treeView({stateStore:"treeview-state",cacheStore:"treeview-cache",root:Olelo.base_path,ajax:function(b,a,l){$.ajax({url:b,data:{aspect:"treeview"},success:a,error:l,dataType:"json"})}})});
