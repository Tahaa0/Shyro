window.onload = function(){
	var pathParts = window.location.pathname.split('/');
	console.log('yes');
	if(pathParts[pathParts.length-1].trim() == END_URL){
		
		var styleCode= ".a_tab{\r\n        border: 1px solid #E0E0E0;\r\n        width: 100%;\r\n        padding: 10px;\r\n        font-family: \'Lato\';\r\n        cursor:pointer;\r\n    }\r\n    .a_body{\r\n        width: 100%;\r\n        height: 80px;\r\n        border-right: 1px solid #E0E0E0;\r\n        border-left: 1px solid #E0E0E0;\r\n        padding: 10px;\r\n        background-color: #F8F8F9;\r\n        display:none;\r\n    }\r\n    .ttl{\r\n        font-weight: 500;\r\n    }\r\n    #paypalTab{\r\n        border-radius: 0 0 5px 5px;\r\n        box-shadow: 0px 1px 1px #E0E0E0;\r\n        margin-top: -1px;\r\n    }  \r\n    #ccTab{\r\n        border-radius: 5px 5px 0px 0px;\r\n        padding-bottom: 11px;\r\n    }\r\n    #paypalBody{\r\n        border-radius: 0 0 5px 5px;\r\n        box-shadow: 0px 1px 1px #E0E0E0;\r\n    }\r\n  \t#ccBody{\r\n    \tdisplay:block;\r\n    }\r\n    .nobottom{\r\n        border-radius: 0 !important;\r\n        box-shadow: 0 !important;\r\n    }\r\n    .a_p{\r\n        color:#737376;\r\n        font-family: \'Lato\';\r\n        text-align: center; \r\n    }\r\n  \ta[href=\'#submit-form\'], a[href=\'#submit-form-2step-order\']{\r\n      margin-top:10px;\r\n    }\r\n";
		var styleElement = document.createElement('style');
		styleElement.innerHTML = styleCode;
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(styleElement);

		console.log(PAYPAL_URL);
		console.log(END_URL);

		$('.o2step_step2 .elCreditCardForm').remove();
        window.buyButton = $("a[href='#submit-form'], a[href='#submit-form-2step-order']");
        var $parentDiv = window.buyButton.parent();
        //window.buyButton.hide();
        $parentDiv.addClass('paypal-button');
      
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
          console.log('E');
      ppBody.slideUp(200);
            ccBody.slideDown(200);
            ppTab.removeClass('nobottom');
            window.buyButton.show();
            $parentDiv.hide();
        });
        ppTab.click(function(){
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

      var $form = $('#cfAR');
      $form.attr('action',PP_LINK);
      $("#cfAR input[name='purchase[product_id]']").val(PP_PRODUCT);
      $("#cfAR input[name='purchase[product_ids][]']").val(PP_PRODUCT);

		$(function () {
        function isPayPalSubscription() {
          return $('.activeRadioProduct input').data('product-payment-type') == 'subscription';
        }

        var CREATE_PAYMENT_URL  = 'https://imadbitgold.clickfunnels.com/pages/'+PAYPAL_URL+'/payment_gateways/paypal/payment/create/';
        var EXECUTE_PAYMENT_URL = 'https://imadbitgold.clickfunnels.com/pages/'+PAYPAL_URL+'/payment_gateways/paypal/payment/execute/';
        var CREATE_SUBSCRIPTION_PAYMENT_URL  = 'https://imadbitgold.clickfunnels.com/pages/'+PAYPAL_URL+'/payment_gateways/paypal/subscription/create/';
        var EXECUTE_SUBSCRIPTION_PAYMENT_URL = 'https://imadbitgold.clickfunnels.com/pages/'+PAYPAL_URL+'/payment_gateways/paypal/subscription/execute/';

        paypal.Button.render({
          env: 'production',
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
            // Set a variable that will prevent the normal on-submit handler
            // from submitting the form. (But allow it to do validations.) After
            // we've obtained a token from PayPal we'll submit the form directly.
            window.isPayPalOrderForm = true;
            // Trigger a click on the now-hidden buyButton so that validations and other
            // on-submit type actions are fired
            window.buyButton.trigger("click", function(){

              if(window.cfARIsValid){
                $('#cf_contact_email').val($('input[name="email"]').val());
                if(isPayPalSubscription()) {
                  return $.post(CREATE_SUBSCRIPTION_PAYMENT_URL, $('#cfAR').serialize()).then(function(data) {
                    var link = data.links[0].href;
                    var token = link.split("token=")[1];
                    resolve(token);
                  });
                } else {
                  return $.post(CREATE_PAYMENT_URL, $('#cfAR').serialize()).then(function(data) {
                    resolve(data.id);
                  });
                }
              }else{
                // TODO : Should we somehow handle this?
                // We have to `reject` in order to make PayPal do the right thing
                // but this error surfaces in console. Maybe that's OK?
                reject('The order form has not validated. Please correct any errors.');
              }
            });
          },

          onAuthorize: function(data) {
            console.log(data);
            if(isPayPalSubscription()) {
              return paypal.request.post(EXECUTE_SUBSCRIPTION_PAYMENT_URL, data).then(function() {
                // The payment is complete!
                var $form = $('#cfAR');
                $form.append($('<input type="hidden" name="purchase[payment_gateway_token]" />').val(data.paymentToken));
                $form.append($('<a href="#submit-form"></a>'));
                $form.submit();
              });
            } else {
              return paypal.request.post(EXECUTE_PAYMENT_URL, {
                  paymentID: data.paymentID,
                  payerID:   data.payerID
              }).then(function() {
                // The payment is complete!
                console.log('PAYMENT complete!');
                var $form = $('#cfAR');
                $form.append($('<input type="hidden" name="purchase[payment_gateway_token]" />').val(data.paymentID));
                
                $form.submit();
              });
            }
          }
        }, '.paypal-button');
      });
	}else{
		console.log(false);
	};

}

