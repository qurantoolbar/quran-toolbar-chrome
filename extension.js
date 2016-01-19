function createSidebar(){
    var sidebar;
    sidebar = new appAPI.sidebar({
        position:'right', // Sidebar position (right, left, top, bottom) - currently only right is supported
        html: appAPI.resources.get('index.html'), // URL of the iframe that will show inside the sidebar (your site's content)
        //url:'resource://index.html',
        opacity:1.0, // Sidebar's opacity
        width:'300px', // Sidebar width (can be px or %)
        height:'100%', // Sidebar height (can be px or %)
        //preloader:true, // Show spinning loader until content has loaded (apply only if url parameter is specified)
        sticky:false, 
        slide:0, // Slide speed in ms
  
        openAction:['click', 'mouseover'], 
       // closeAction:'click', 
        theme:'default', // Sidebar theme (currently only default is supported)
        scrollbars:true, // Show / Hide scrollbars
        openOnInstall:true, // Auto open sidebar after installation
        events:{
          // onShow fires when the sidebar is opened
          onShow:function () {
            shown = true;
             console.log("show");
              appAPI.message.toBackground({
              action:'shown',
              shortcut:'Ctrl+X'
            });
          },
          onHide:function () {
            shown = false;
            console.log('hide');
            
            appAPI.message.toBackground({
               scope: 'all-tabs',
               action:'hidden'
            });
          }
        }
      });
      return sidebar;
}
var sidebar;
if (!appAPI.dom.isIframe())   {
  sidebar = createSidebar();
}     
var shown = false;
var first = true;
appAPI.ready(function($) {
    
  var lid = appAPI.message.addListener(function(msg) {
    switch(msg.action) {
      case 'search':
        if (appAPI.dom.isIframe() ){
        } else if (!appAPI.dom.isIframe()) {
          console.log('w');
          if (first && $('div[class^="crossrider-sidebar-"],div[class*=" crossrider-sidebar-"]').length && $('body>*').length) {
            $($('div[class^="crossrider-sidebar-"],div[class*=" crossrider-sidebar-"]').get(0)).insertAfter('body>*:last');
            first = false;
          }
          sidebar.open(true);
          sidebar.show(true);
          var qse = document.getElementById('quran-search-engine');
          qse.getElementsByClassName('search')[0].value = msg.text;
          qse.getElementsByClassName('searchbn')[0].click();


        }
        break;
      case 'toggle': 
        if (!appAPI.dom.isIframe()) {
          if (first && $('div[class^="crossrider-sidebar-"],div[class*=" crossrider-sidebar-"]').length && $('body>*').length) {
            $($('div[class^="crossrider-sidebar-"],div[class*=" crossrider-sidebar-"]').get(0)).insertAfter('body>*:last');
            first = false;
          }
          if (!shown) {
            sidebar.open(true);
            sidebar.show(true);
          } else {
            sidebar.hide(false);
            sidebar.close(false);
          }
        }
        break;
    }

  });
console.log("a");

$(document).on('dblclick', function(e){
  if ($(e.target).parents('div[class^="crossrider-sidebar-"],div[class*=" crossrider-sidebar-"]').length == 0){
    sidebar.hide(false);
    sidebar.close(false);
  }
});

$('#quran-search-engine .close').live('click', function(){
  sidebar.hide(false);
  sidebar.close(false);
});
var div;
var lastFocused;
$('#quran-search-engine .add').live('click', function(){
  if (div){
    lastFocused.focus();
    pasteHtmlAtCaret($('#quran-search-engine .text').val());
  } else {
    insertText($('#quran-search-engine .text').val());
  }
});

$("input[type='text']").live('focus', function() {
  if($(this).parents('#quran-search-engine').length == 0){
    lastFocused = document.activeElement;
    div = false;
  }
});

$("textarea").live('focus', function() {
  if($(this).parents('#quran-search-engine').length == 0) {
    lastFocused = document.activeElement;
    div = false;
  }
});

$("div[contenteditable='true']").live('focus', function() {
  if($(this).parents('#quran-search-engine').length == 0) {
    lastFocused = document.activeElement;
    div = true;
  }

});

function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}
//http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
function insertText(text) {
  var input = lastFocused;
  console.log(input);
  if (input == undefined) { return; }
  var scrollPos = input.scrollTop;
  var pos = 0;
  var browser = ((input.selectionStart || input.selectionStart == "0") ? 
    "ff" : (document.selection ? "ie" : false ) );
  if (browser == "ie") { 
    input.focus();
    var range = document.selection.createRange();
    range.moveStart ("character", -input.value.length);
    pos = range.text.length;
  }
  else if (browser == "ff") { pos = input.selectionStart };

  var front = (input.value).substring(0, pos);  
  var back = (input.value).substring(pos, input.value.length); 
  input.value = front+text+back;
  pos = pos + text.length;
  if (browser == "ie") { 
    input.focus();
    var range = document.selection.createRange();
    range.moveStart ("character", -input.value.length);
    range.moveStart ("character", pos);
    range.moveEnd ("character", 0);
    range.select();
  }
  else if (browser == "ff") {
    input.selectionStart = pos;
    input.selectionEnd = pos;
    input.focus();
  }
  input.scrollTop = scrollPos;
}
});
