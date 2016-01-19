
appAPI.ready(function() {

  var buttonHidden = false;
  
  if (appAPI.browser.name !== 'safari') {
    appAPI.browserAction.setResourceIcon('btn.jpg');
  } 
 

  appAPI.browserAction.setTitle('Quran');

  function updateButton(show){
    if (show || buttonHidden) {
      if (appAPI.browser.name !== 'safari') {
        appAPI.browserAction.setResourceIcon('iconshown.jpg');
      } else {
        
      }
      buttonHidden = false;
    } else {
      if (appAPI.browser.name !== 'safari') {
        // Reset the icon for the image
        appAPI.browserAction.setResourceIcon('iconhidden.jpg');
      }
      buttonHidden = true;
    }
  }

  function update(show){
    if (show) {
      if (appAPI.browser.name !== 'safari') {
        appAPI.browserAction.setResourceIcon('iconshown.jpg');
      } else {
        
      }
      buttonHidden = false;
    } else {
      if (appAPI.browser.name !== 'safari') {
        // Reset the icon for the image
        appAPI.browserAction.setResourceIcon('iconhidden.jpg');
      }
      buttonHidden = true;
    }
  }


  appAPI.browserAction.onClick(function(){
      appAPI.message.toActiveTab({action: 'toggle'});
      

    //updateButton();
  });

    // object that passed back to the callback function
  appAPI.contextMenu.add('searchQuran', 'Search in Quran', function (data) {
    //updateButton(true);
    appAPI.message.toActiveTab({action: 'search', text:data.selectedText});
  }, ['textSelection']);

  var lid = appAPI.message.addListener(function(msg) {
    switch(msg.action) {
      case 'shown':
        console.log("shown");
        //update(false);
      break;
      case 'hidden':
        //update(true);
        console.log("hidden");
      break; 
    }
  });
});










