window.onload = function(){

	var CHOSEN_ID = $('#cfAR input[name="purchase[product_id]"]:first').val();
  var BUMPS = [];
  
  var HOST = "http://cfapp20.herokuapp.com";
  var $form = $('#cfAR');
  var FORM = $("<form></form>");
  FORM.attr('target',$form.attr('target'));
  FORM.attr('method',$form.attr('method'));
  FORM.attr('action',$form.attr('action'));
  FORM.html(serializeToForm($form.serializeArray()));

  function calculateID() {
    for(var i=0;i<STEP.products.length;i++){
      if(STEP.products[i].paypal == CHOSEN_ID || STEP.products[i].stripe == CHOSEN_ID){
          if(isPAYPAL){
              return STEP.products[i].paypal;
          }else{
              return STEP.products[i].stripe;
          }
      }
    }
  }

  function serializeToForm(arr){
    var html = "";
    for(var i=0;i<arr.length;i++){
      html += "<input name='"+arr[i].name+"' value='"+arr[i].value+"'>";
    }
    return html;
  }

  
  function checkProd(id){
    $('#cfAR input[name="purchase[product_id]"],#cfAR input[name="purchase[product_ids][]"]').removeAttr('checked');
    $('#pid-'+id+'-1[name="purchase[product_ids][]"]').attr('checked','checked');
    var hb = "";
    for(var j=0;j<BUMPS.length;j++){
      for(var i=0;i<STEP.products.length;i++){
        if(STEP.products[i].paypal == BUMPS[j] || STEP.products[i].stripe == BUMPS[j]){
          var b_name = STEP.products[i].title;
          var b_price = STEP.products[i].price;
          hb += "<tr class=\"clearfix elOrderProductOptinProducts\"><td class=\"pull-left elOrderProductOptinProductName product-name\" style=\"width: inherit;\">"+b_name+"<\/td><td class=\"pull-right elOrderProductOptinPrice product-price\">$"+b_price+"<\/td><\/tr>";
            if(isPAYPAL){
                $('#pid-'+STEP.products[i].paypal+'-1[name="purchase[product_ids][]"]').attr('checked','checked');
            }else{
                $('#pid-'+STEP.products[i].stripe+'-1[name="purchase[product_ids][]"]').attr('checked','checked');
            }
        }
      }
    }

    var _name = $('input[name=xxprod]:checked').attr('data-product-name');
    var _price= $('input[name=xxprod]:checked').parent().find('.elOrderProductOptinPrice').html();
    var hh = "<tr class=\"clearfix elOrderProductOptinLabel elOrderProductOptinLabelTable\">\r\n<th class=\"pull-left elOrderProductOptinItem\" width=\"70%\">Item<\/th>\r\n<th class=\"pull-right elOrderProductOptinLabelPrice elOrderProductOptinPriceTable\" width=\"30%\">amount<\/th>\r\n<\/tr>";
    var ht = "<tr class=\"clearfix elOrderProductOptinProducts\"><td class=\"pull-left elOrderProductOptinProductName product-name\" style=\"width: inherit;\">"+_name+"<\/td><td class=\"pull-right elOrderProductOptinPrice product-price\">"+_price+"<\/td><\/tr>";
    
    $('.elOrderProductOptions tbody').html(hh+ht+hb);
    FORM.html(serializeToForm($form.serializeArray()));
  }

  
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
		
    if(STEP.type =='form'){
      //ADD STYLE
      var styleCode= ".a_tab{\r\n        border: 1px solid #E0E0E0;\r\n        width: 100%;\r\n        padding: 10px;\r\n        font-family: \'Lato\';\r\n        cursor:pointer;\r\n    }\r\n    .a_body{\r\n        width: 100%;\r\n        height: auto;\r\n        border-right: 1px solid #E0E0E0;\r\n        border-left: 1px solid #E0E0E0;\r\n        padding: 10px;\r\n        background-color: #F8F8F9;\r\n        display:none;\r\n    }\r\n    .ttl{\r\n        font-weight: 500;\r\n    }\r\n    #paypalTab{\r\n        border-radius: 0 0 5px 5px;\r\n        box-shadow: 0px 1px 1px #E0E0E0;\r\n        margin-top: -1px;\r\n    }  \r\n    #ccTab{\r\n        border-radius: 5px 5px 0px 0px;\r\n        padding-bottom: 11px;\r\n    }\r\n    #paypalBody{\r\n        border-radius: 0 0 5px 5px;\r\n        box-shadow: 0px 1px 1px #E0E0E0;\r\n    }\r\n  \t#ccBody{\r\n    \tdisplay:block;\r\n    }\r\n    .nobottom{\r\n        border-radius: 0 !important;\r\n        box-shadow: 0 !important;\r\n    }\r\n    .a_p{\r\n        color:#737376;\r\n        font-family: \'Lato\';\r\n        text-align: center; \r\n    }\r\n  \ta[href=\'#submit-form\'], a[href=\'#submit-form-2step-order\']{\r\n      margin-top:10px;\r\n    }\r\n";
      var styleElement = document.createElement('style');
      var customStyle = "\r\n.ccStripeElementCard {\r\n    float: none;\r\n} #log_pp{height:28px} #log_cc{height:21px; float:right; padding-right: 4px;}";
      var radioStyle = "\/* The container *\/\r\n.radlab {\r\n  position: relative;\r\n  padding-left: 35px;\r\n  margin-bottom: 12px;\r\n  cursor: pointer;\r\n  font-size: 22px;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n}\r\n\r\n\/* Hide the browser\'s default radio button *\/\r\n.radlab input {\r\n  position: absolute;\r\n  opacity: 0;\r\n  cursor: pointer;\r\n}\r\n\r\n\/* Create a custom radio button *\/\r\n.checkmark {\r\n  position: absolute;\r\n  top: -2px;\r\n  left: 0;\r\n  height: 18px;\r\n  width: 18px;\r\n  background-color: #eee;\r\n  border-radius: 50%;\r\n}\r\n\r\n\/* On mouse-over, add a grey background color *\/\r\n.radlab:hover input ~ .checkmark {\r\n  background-color: #ccc;\r\n}\r\n\r\n\/* When the radio button is checked, add a blue background *\/\r\n.radlab input:checked ~ .checkmark {\r\n  background-color: #2196F3;\r\n}\r\n\r\n\/* Create the indicator (the dot\/circle - hidden when not checked) *\/\r\n.checkmark:after {\r\n  content: \"\";\r\n  position: absolute;\r\n  display: none;\r\n}\r\n\r\n\/* Show the indicator (dot\/circle) when checked *\/\r\n.radlab input:checked ~ .checkmark:after {\r\n  display: block;\r\n}\r\n\r\n\/* Style the indicator (dot\/circle) *\/\r\n.radlab .checkmark:after {\r\n \ttop: 5px;\r\n\tleft: 5px;\r\n\twidth: 8px;\r\n\theight: 8px;\r\n\tborder-radius: 50%;\r\n\tbackground: white;\r\n}";
      var highlightStyle = ".highlighted{\r\n\tbackground-color: yellow;\r\n}";
      styleElement.innerHTML = styleCode+customStyle+radioStyle+highlightStyle;
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(styleElement);
      
      //-----------------
      //ADD FORM / BUTTON
      checkProd(calculateID());



      window.buyButton = $("a[href='#submit-form'], a[href='#submit-form-2step-order']");
      var $parentDiv = window.buyButton.parent();
        
      var anc = $parentDiv.parent();
      anc.append(window.buyButton);
      $parentDiv.hide();
    
      var ccForm = $('.elCreditCardForm');
      var parDOM = ccForm.parent();
      console.log(parDOM);
      var ccTab = $('<div id="ccTab" class="a_tab"><label class="radlab"><input type="radio" checked="checked" name="ispp" id="ccRadio"><span class="checkmark"></span></label><span class="ttl">Credit Card</span><img id="log_cc" src="'+HOST+'/views/app/creditcards.png"></div>');
      var ccBody = $('<div id="ccBody" class="a_body"></div>');
      var ppTab = $('<div id="paypalTab" class="a_tab"><label class="radlab"><input type="radio" name="ispp" id="ppRadio"><span class="checkmark"></span></label><span class="ttl"><img id="log_pp" src="'+HOST+'/views/app/paypal.png"></span></div>');
      var ppBody = $('<div id="paypalBody" class="a_body"><p class="a_p">After submitting, you will be redirected to paypal to purchase securely.</p></div>');
      localStorage.setItem('pmethod555','stripe');
      ccTab.on('click',function(){
        isPAYPAL = false;
        $('#ccRadio').attr('checked', 'checked');
        localStorage.setItem('pmethod555','stripe');
        ppBody.slideUp(200);
        ccBody.slideDown(200);
        ppTab.removeClass('nobottom');
        window.buyButton.show();
        $parentDiv.hide();
        checkProd(calculateID());
      });
      ppTab.click(function(){
        isPAYPAL = true;
        localStorage.setItem('pmethod555','paypal');
        $('#ppRadio').attr('checked', 'checked');
        ccBody.slideUp(200);
        ppBody.slideDown(200);
        ppTab.addClass('nobottom');
        window.buyButton.hide();
        $parentDiv.show();
        checkProd(calculateID());
      });

      $('input[name=xxprod]').click(function () {
        CHOSEN_ID = $('input[name=xxprod]:checked').val();
        checkProd(calculateID());
      });
      
      $('input[name=xxprod]:first').attr('checked','checked');

      CHOSEN_ID = $('input[name=xxprod]:first').val();
      for(var i=0;i<STEP.products.length;i++){
        if(STEP.products[i].highlight){
          CHOSEN_ID = $('#pid-'+STEP.products[i].stripe+'-0').val();
          $('#pid-'+STEP.products[i].stripe+'-0').parent().addClass('highlighted');
        }
      }
      checkProd(calculateID());

      $('input[name=xxbump]').click(function (){
        BUMPS = [];
        $('input[name=xxbump]').each(function(index){
          if($(this).is(':checked')){
            BUMPS.push($(this).val());
          }
        });
        checkProd(calculateID());
      });

      parDOM.prepend(ppBody);
      parDOM.prepend(ppTab);
      parDOM.prepend(ccBody);
      parDOM.prepend(ccTab);
      ccBody.prepend(ccForm);
      
      //---------------------------
      $('#cfAR').on('submit',function(e){
        e.preventDefault();
        FORM.html(serializeToForm($form.serializeArray()));
        $('body').prepend(FORM);
        FORM.submit();
      });
    
    }else if(STEP.type == 'upsell'){
      
      var $links = [];

      $("a[href*='#yes-link'], .elIMG[data-imagelink*='#yes-link']").each(function(index, link){
          $link = $(link);

          if(localStorage.getItem('pmethod555') != 'paypal'){
            $link.show();
          }else{
            $link.removeAttr('data-purchase');
            $link.removeAttr('data-upsell');
          }
          
      });
      if(localStorage.getItem('pmethod555') != 'paypal'){
        $('.paypal-button').hide();
      }else{
        $('#cfAR').append('<input type="hidden" name="purchase[product_id]" value="'+STEP.products[0].paypal+'"><input type="hidden" name="upsell" value="1">')
      }


    }
  }
}

/*
      $(function () {
        var CREATE_PAYMENT_URL  = 'https://imadbitgold.clickfunnels.com/pages/hk7l8wi2p1q4jcxl/payment_gateways/paypal/payment/create/';
        var EXECUTE_PAYMENT_URL = 'https://imadbitgold.clickfunnels.com/pages/hk7l8wi2p1q4jcxl/payment_gateways/paypal/payment/execute/';

        $("a[href*='#yes-link'], .elIMG[data-imagelink*='#yes-link']").each(function(index, link){
          $link = $(link);
          $parent = $link.parent();
          $link.hide();
          parent_id = 'pp_button_' + index;
          $parent.attr("id",parent_id);
          paypal.Button.render({
            env: 'production',
            client: {
              parent_id: parent_id,
              production: 'test',
              sandbox: 'test'
            },
            commit: true, // Show a 'Pay Now' button
            style: {
              size:  'responsive',
              shape: 'rect',
              color: 'blue',
              layout: 'vertical'
            },
            funding: {
              allowed: [ paypal.FUNDING.CREDIT ],
              disallowed: [ paypal.FUNDING.CARD ]
            },
            payment: function(resolve, reject) {
              parent_id = this.props.client.parent_id;
              yes_link_selector = '#' + parent_id + ' ' + "a[href*='#yes-link']";
              // Set a variable that will prevent the normal on-submit handler
              // from submitting the form. (But allow it to do validations.) After
              // we've obtained a token from PayPal we'll submit the form directly.
              window.isPayPalOrderForm = true;
              // Trigger a click on the now-hidden buyButton so that validations and other
              // on-submit type actions are fired
              $(yes_link_selector).trigger("click", function(){
                if(window.cfARIsValid){
                  $('#cf_contact_email').val($('input[name="email"]').val());
                  return $.post(CREATE_PAYMENT_URL, $('#cfAR').serialize()).then(function(data) {
                    resolve(data.id);
                  });
                }else{
                  // TODO : Should we somehow handle this?
                  // We have to `reject` in order to make PayPal do the right thing
                  // but this error surfaces in console. Maybe that's OK?
                  reject('The order form has not validated. Please correct any errors.');
                }
              });
            },

            onAuthorize: function(data) {
              return paypal.request.post(EXECUTE_PAYMENT_URL, {
                paymentID: data.paymentID,
                payerID:   data.payerID
              }).then(function() {
                // The payment is complete!
                var $form = $('#cfAR');
                $form.append($('<input type="hidden" name="purchase[payment_gateway_token]" />').val(data.paymentID));
                //$form.append($('<a href="#submit-form"></a>'));
                //$("a[href='#submit-form']").trigger('click');
                $form.submit();
              });
            },

            onCancel: function (data, actions) {
                $('.otoloading').hide();
            }

          }, '#' + parent_id);
        });
      });
*/