
window.onload = function(){
	var pathParts = window.location.pathname.split('/');
  var endPath = pathParts[pathParts.length-1].trim();
  var VALID = false;
  for(var i=0;i<STEP_URLS.length;i++){
    if(STEP_URLS[i] == endPath){
      VALID = true;
      break;
    }
  }
	if(VALID){
		
    //ADD STYLE
    var styleCode= ".a_tab{\r\n        border: 1px solid #E0E0E0;\r\n        width: 100%;\r\n        padding: 10px;\r\n        font-family: \'Lato\';\r\n        cursor:pointer;\r\n    }\r\n    .a_body{\r\n        width: 100%;\r\n        height: 80px;\r\n        border-right: 1px solid #E0E0E0;\r\n        border-left: 1px solid #E0E0E0;\r\n        padding: 10px;\r\n        background-color: #F8F8F9;\r\n        display:none;\r\n    }\r\n    .ttl{\r\n        font-weight: 500;\r\n    }\r\n    #paypalTab{\r\n        border-radius: 0 0 5px 5px;\r\n        box-shadow: 0px 1px 1px #E0E0E0;\r\n        margin-top: -1px;\r\n    }  \r\n    #ccTab{\r\n        border-radius: 5px 5px 0px 0px;\r\n        padding-bottom: 11px;\r\n    }\r\n    #paypalBody{\r\n        border-radius: 0 0 5px 5px;\r\n        box-shadow: 0px 1px 1px #E0E0E0;\r\n    }\r\n  \t#ccBody{\r\n    \tdisplay:block;\r\n    }\r\n    .nobottom{\r\n        border-radius: 0 !important;\r\n        box-shadow: 0 !important;\r\n    }\r\n    .a_p{\r\n        color:#737376;\r\n        font-family: \'Lato\';\r\n        text-align: center; \r\n    }\r\n  \ta[href=\'#submit-form\'], a[href=\'#submit-form-2step-order\']{\r\n      margin-top:10px;\r\n    }\r\n";
    var styleElement = document.createElement('style');
    styleElement.innerHTML = styleCode;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(styleElement);
    
    //-----------------
    //ADD FORM / BUTTON

    window.buyButton = $("a[href='#submit-form'], a[href='#submit-form-2step-order']");
    var $parentDiv = window.buyButton.parent();
      
    var anc = $parentDiv.parent();
    anc.append(window.buyButton);
    $parentDiv.hide();
  
    var ccForm = $('.elCreditCardForm');
    var parDOM = ccForm.parent();
    console.log(parDOM);
    var ccTab = $('<div id="ccTab" class="a_tab"><span class="ttl">Credit Card</span></div>');
    var ccBody = $('<div id="ccBody" class="a_body"></div>');
    var ppTab = $('<div id="paypalTab" class="a_tab"><span class="ttl">PayPal</span></div>');
    var ppBody = $('<div id="paypalBody" class="a_body"><p class="a_p">After submitting, you will be redirected to paypal to purchase securely.</p></div>');
    
    ccTab.on('click',function(){
      isPAYPAL = false;
      ppBody.slideUp(200);
      ccBody.slideDown(200);
      ppTab.removeClass('nobottom');
      window.buyButton.show();
      $parentDiv.hide();
    });
    ppTab.click(function(){
      isPAYPAL = true;

      ccBody.slideUp(200);
      ppBody.slideDown(200);
      ppTab.addClass('nobottom');
      window.buyButton.hide();
      $parentDiv.show();
    });

    parDOM.prepend(ppBody);
    parDOM.prepend(ppTab);
    parDOM.prepend(ccBody);
    parDOM.prepend(ccTab);
    ccBody.prepend(ccForm);
    //---------------------------
    //$("#cfAR input[name='purchase[product_ids][]'], #cfAR input[name='purchase[product_id]']").removeAttr('checked');
  }

}