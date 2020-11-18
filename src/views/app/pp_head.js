window.onload = function(){

  //Hide variant box
  $('.varibox').hide();


	var CHOSEN_ID = $('#cfAR input[name="purchase[product_id]"]:first').val();
  var QUANTITY = 1;
  var BUMPS = [];
  
  var HOST = "http://cfapp20.herokuapp.com";
  //GET FORM INTO DATA MODE TO SEND AFTER CUSTOMIZATION
  var $form = $('#cfAR');
  var FORM = $("<form></form>");
  FORM.attr('target',$form.attr('target'));
  FORM.attr('method',$form.attr('method'));
  FORM.attr('action',$form.attr('action'));
  FORM.html(serializeToForm($form.serializeArray()));

  //Gets the right product ID by indentifying which payment method is chosen
  function calculateID() {
    for(var i=0;i<STEP.products.length;i++){
      if(STEP.products[i].paypal == CHOSEN_ID || STEP.products[i].stripe == CHOSEN_ID){
          if(QUANTITY == 1){
            if(isPAYPAL){
              return STEP.products[i].paypal;
            }else{
              return STEP.products[i].stripe;
            }
          }else{
            if(isPAYPAL){
              return STEP.products[i].quantity[QUANTITY-2].paypal;
            }else{
              return STEP.products[i].quantity[QUANTITY-2].stripe;
            }
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

  //After a product is chosen
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
    var _price= $('input[name=xxprod]:checked').parent().parent().find('.elOrderProductOptinPrice').html();
    var hh = "<tr class=\"clearfix elOrderProductOptinLabel elOrderProductOptinLabelTable\">\r\n<th class=\"pull-left elOrderProductOptinItem\" width=\"70%\">Item<\/th>\r\n<th class=\"pull-right elOrderProductOptinLabelPrice elOrderProductOptinPriceTable\" width=\"30%\">amount<\/th>\r\n<\/tr>";
    if($('input[name=xxprod]:checked').data('quantity') > 1){
      _name += " (x"+$('input[name=xxprod]:checked').data('quantity')+")";
      _price = "$"+$('input[name=xxprod]:checked').data('price');
    }
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
      var radioStyle = "\/* The container *\/\r\n.radlab {\r\n  position: relative;\r\n  padding-left: 35px;\r\n  margin-bottom: 12px;\r\n  cursor: pointer;\r\n  font-size: 12px;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n}\r\n\r\n\/* Hide the browser\'s default radio button *\/\r\n.radlab input {\r\n  position: absolute;\r\n  opacity: 0;\r\n  cursor: pointer;\r\n}\r\n\r\n\/* Create a custom radio button *\/\r\n.checkmark {\r\n  position: absolute;\r\n  top: -2px;\r\n  left: 0;\r\n  height: 18px;\r\n  width: 18px;\r\n  background-color: #eee;\r\n  border-radius: 50%;\r\n}\r\n\r\n\/* On mouse-over, add a grey background color *\/\r\n.radlab:hover input ~ .checkmark {\r\n  background-color: #ccc;\r\n}\r\n\r\n\/* When the radio button is checked, add a blue background *\/\r\n.radlab input:checked ~ .checkmark {\r\n  background-color: #2196F3;\r\n}\r\n\r\n\/* Create the indicator (the dot\/circle - hidden when not checked) *\/\r\n.checkmark:after {\r\n  content: \"\";\r\n  position: absolute;\r\n  display: none;\r\n}\r\n\r\n\/* Show the indicator (dot\/circle) when checked *\/\r\n.radlab input:checked ~ .checkmark:after {\r\n  display: block;\r\n}\r\n\r\n\/* Style the indicator (dot\/circle) *\/\r\n.radlab .checkmark:after {\r\n \ttop: 5px;\r\n\tleft: 5px;\r\n\twidth: 8px;\r\n\theight: 8px;\r\n\tborder-radius: 50%;\r\n\tbackground: white;\r\n}";
      var highlightStyle = ".highlighted{\r\n  background-color:#FEFF04;\r\n  border-radius:5px;\r\n  width: 105% !important;\r\n  padding:17px;\r\n  margin-left: -15px;\r\n  border: 1px solid #A0A0A0;\r\n  box-shadow: 0 1px 1px #A0A0A0;\r\n  font-weight:bold;\r\n}\r\n.highlighted .radlab{\r\n\tdisplay: inline-block;\r\n\tvertical-align: top;\r\n\tmargin-top: 17px;\r\n}";
      var bumpStyle = ".bump1{\r\n\tborder: 3px solid #BE386D;\r\n\tborder-radius: 5px;\r\n\twidth: auto;\r\n\tcolor: black;\r\n\tpadding: 8px;\r\n       font-family:\'Montserrat\';\r\n       font-size:16px;\r\n}\r\n.bump1 label{\r\n\tbackground-color: black;\r\n\tcolor: white;\r\n\twidth: 100%;\r\n\tdisplay: inline-block;\t\r\n\ttext-align: center;\r\n\tpadding: 5px 0;\r\n}\r\n.bump1 .x1{\r\n\tfont-weight: bold;\t\r\n\ttext-decoration: underline;\r\n}\r\n.bump1 h4{\r\n\tmargin: 0;\r\n\ttext-align: center;\t\r\n\tfont-size: 18px;\r\n\tpadding: 0 10px 10px 10px;\r\n\tfont-weight:700;\r\n}";
      var varStyle = ".xxvar{\r\n\tdisplay: inline-block;\r\n\tborder: 2px solid #E0E0E0;\r\n\tpadding: 10px;\r\n\tborder-radius: 4px;\r\n\tmargin-left: 3px;\r\n\tmargin-right: 3px;\r\n\tcursor: pointer;\r\n\tbackground-color: white;\r\n}\r\n.varActive{\r\n\tbackground-color: #2196F3;\r\n\tcolor: white;\r\n\tfont-weight: 900;\r\n\tborder: 2px solid #2196F3;\r\n}\r\n.varibox{\r\n\tmargin-top: 7px;\r\n\tpadding-left: 35px;\r\n}\r\n.varilabel{\r\n\tmin-width: 85px;\r\n\tdisplay: inline-block;\r\n}";
      var qStyle = ".xxqm,.xxqp{\r\n\tdisplay: inline-block;\r\n\tpadding: 10px;\r\n\tfont-weight: 900;\r\n\tcolor: #2196F3;\r\n\tcursor: pointer;\r\n}\r\n.xxquantity{\r\n\tpadding: 4px 20px;\r\n\tbackground-color: #EEEEEE;\r\n\tfont-weight: 500;\r\n\tborder-radius: 12px;\r\n}\r\n.xxqm{\r\n\tmargin-left: 20px;\r\n}\r\n.qtybox{\r\n\tdisplay: inline-block;\r\n}";
      var productChoiceStyle = ".elProductOptionsBox .elOrderProductOptinProductName {\r\n    padding: 12px;\r\n    border: 1px solid #E4E4E4;\r\n    border-radius: 4px;\r\n    margin-bottom: 0px;\r\n}";
      var bump2Style = ".bump2{\r\n\twidth: 100%;\r\n\tmargin: 0 auto;\r\n\tmargin-top: 50px;\r\n\tborder: 3px solid #EEEEEE;\r\n\tborder-radius: 5px;\r\n\tbackground-color: white;\r\n\tcolor:black;\r\n\tfont-family: \'Poppins\';\r\n\tdisplay: flex;\r\n\talign-items: flex-start;\r\n}\r\n.bump2 img{\r\n\tdisplay: inline-block;\r\n\tmin-width: 125px;\r\n\tmargin-left: 7px;\r\n\tmargin-top: -15px;\r\n}\r\n.bump2 .desc_{\r\n\twidth: 60%;\r\n\tdisplay: inline-block;\r\n\tvertical-align: top;\r\n}\r\n.bump2 .smt{\r\n\tdisplay: block;\r\n\tpadding-top: 14px;\r\n\tfont-weight: bold;\r\n\tletter-spacing: -0.2px;\r\n\tfont-size: 14px;\r\n}\r\n.bump2 .smt2{\r\n\tdisplay: block;\r\n\tpadding-top: 2px;\r\n\tfont-size: 14px;\r\n\tfont-weight: 300;\r\n\tcolor:#4AAF59;\r\n}\r\n.bump2 .smt2>strong{\r\n\tfont-weight: bold;\r\n}\r\n.bump2 p{\r\n\tdisplay: block;\r\n\tmargin: 0;\r\n\tpadding-top: 2px;\r\n\tfont-size: 12px;\r\n\tfont-weight: 400;\r\n\twidth: auto;\r\n\tpadding-bottom: 10px;\r\n}\r\n.bump2 .action{\r\n\tdisplay: inline-block;\r\n\tvertical-align: top;\r\n\ttext-align: center;\r\n\tmin-width: 115px;\r\n\theight: 100%;\r\n}\r\n.bump2 button{\r\n\tdisplay: inline-block;\r\n\twidth: auto;\r\n\tmargin: 5px auto;\r\n\tmargin-top: 32px;\r\n\tborder-radius: 3px;\r\n\tborder: 1px solid #E0E0E0;\r\n\tbackground-color: white;\r\n\tcolor: #8a8a8a;\r\n\tfont-weight: bold;\r\n\twidth: 80%;\r\n\tfont-size: 15px;\r\n\tpadding: 10px;\r\n\t-webkit-transition: \t400ms all;\r\n\t-o-transition: \t400ms all;\r\n\ttransition: \t400ms all;\r\n\r\n}\r\n.bump2 button:hover{\r\n\tbackground-color: #B4EDC4;\r\n\tcolor: #348A36;\r\n}\r\n.bumpChecked{\r\n\tbackground-color: #6DCC70;\r\n\tcolor: #FFF;\r\n}";
      
      styleElement.innerHTML = styleCode+customStyle+radioStyle+highlightStyle+bumpStyle+varStyle+qStyle+productChoiceStyle+bump2Style;
      var head = document.getElementsByTagName('head')[0];
      head.innerHTML +="<link rel=\"preconnect\" href=\"https:\/\/fonts.gstatic.com\">\r\n<link href=\"https:\/\/fonts.googleapis.com\/css2?family=Poppins:wght@400;500;600&display=swap\" rel=\"stylesheet\">";
      head.appendChild(styleElement);
      
      //-----------------
      //ADD FORM / BUTTON
      checkProd(calculateID());

      //MOVE THE BUY BUTTON Outside (necessary step)

      window.buyButton = $("a[href='#submit-form'], a[href='#submit-form-2step-order']");
      var $parentDiv = window.buyButton.parent();
        
      var anc = $parentDiv.parent();
      anc.append(window.buyButton);
      $parentDiv.hide();
      
      //ADD Payment method choice form

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

      
      //UPON CLICKING A PRODUCT slide varibox and select quantity
      $('input[name=xxprod]').click(function () {
        $('.varibox').slideUp(300);
        $(this).parent().parent().find('.varibox').slideDown(300);
        CHOSEN_ID = $('input[name=xxprod]:checked').val();
        if($('input[name=xxprod]:checked').data('quantity')){
          QUANTITY = $('input[name=xxprod]:checked').data('quantity');
        }else{
          QUANTITY = 1;
        }
        checkProd(calculateID());
      });
      
      $('input[name=xxprod]:first').attr('checked','checked');
      $('input[name=xxprod]:first').parent().parent().find('.varibox').show();

      CHOSEN_ID = $('input[name=xxprod]:first').val();
      //HIGHLIGHT
      for(var i=0;i<STEP.products.length;i++){
        if(STEP.products[i].highlight){
          $('#pid-'+STEP.products[i].stripe+'-0').attr('checked','checked');
          CHOSEN_ID = $('#pid-'+STEP.products[i].stripe+'-0').val();
          $('#pid-'+STEP.products[i].stripe+'-0').parent().addClass('highlighted');
          $('label[for="pid-'+STEP.products[i].stripe+'-0"]').css('display','inline-block');
          $('#pid-'+STEP.products[i].stripe+'-0').css('display','inline-block');
          $('#pid-'+STEP.products[i].stripe+'-0').css('vertical-align','top');
          $('#pid-'+STEP.products[i].stripe+'-0').css('margin-top','18px');
          var code = "<span class=\'noticeon\' style=\" display:inline-block; margin-top:-5px; border-radius:4px; font-size:13px; color:white; background-color:red; padding:3px 7px;\">BEST SELLER<\/span><br style=\"margin-bottom:5px;\">\r\n";
          code += $('label[for="pid-'+STEP.products[i].stripe+'-0"]').html();
          $('label[for="pid-'+STEP.products[i].stripe+'-0"]').html(code);
        }
      }
      //CUSTOM CHECKBOX DESIGN
      $('input[name=xxprod]').each(function(index){
        var PARENT = $(this).parent();
        var label = $("<label></label>");
        label.addClass('radlab');
        label.html($(this));
        label.append('<span class="checkmark"></span>');
        PARENT.prepend(label);
      });

      checkProd(calculateID());
      //RED NOTICE 
      var NOTICE_ON = true;
      setInterval(function(){
        NOTICE_ON = !NOTICE_ON;
        if(NOTICE_ON){
          $('.noticeon').css('visibility','visible');
        }else{
          $('.noticeon').css('visibility','hidden');
        }
      },500);
      //BUMP FUNCTIONALITY
      $('[name=xxbump]').click(function (){
        BUMPS = [];
        if($(this).hasClass('bumpButton')){
          if($(this).attr('checked')){
            $(this).html('<i class="fas fa-plus-circle"></i> ADD');
            $(this).removeAttr('checked');
            $(this).removeClass('bumpChecked');
          }else{
            $(this).html('<i class="fas fa-plus-circle"></i> ADDED');
            $(this).attr('checked','checked');
            $(this).addClass('bumpChecked');
          }
        }
        $('[name=xxbump]').each(function(index){
          if($(this).is(':checked') || $(this).attr('checked')){
            BUMPS.push($(this).val());
          }
        });
        checkProd(calculateID());
      });
      //VARIANTS
      $('.xxvar').click(function(){
        $('.xxvar').removeClass('varActive');
        $(this).addClass('varActive');
        var I = $(this).data('prod');
        var J = $(this).data('var');
        $("#xxvar"+I+'_'+J).val($(this).html());
      });
      //quantity
      $('.xxqm').click(function(){
        var I = $(this).data('prod');
        if($("#pid-"+STEP.products[I].stripe+"-0").data('quantity')){
          var q = $("#pid-"+STEP.products[I].stripe+"-0").data('quantity');
        }else{
          var q = 1;
        }
        if(q > 1){
          q--;
        }
        $("#pid-"+STEP.products[I].stripe+"-0").data('quantity',q);
        $('#xxq'+I).html(q);
        //
        CHOSEN_ID = $('input[name=xxprod]:checked').val();
        if($('input[name=xxprod]:checked').data('quantity')){
          QUANTITY = $('input[name=xxprod]:checked').data('quantity');
          $('input[name=xxprod]:checked').data('price',STEP.products[I].quantity[QUANTITY-2].price);
        }else{
          QUANTITY = 1;
        }
        checkProd(calculateID());
      });

      $('.xxqp').click(function(){
        var I = $(this).data('prod');
        if($("#pid-"+STEP.products[I].stripe+"-0").data('quantity')){
          var q = $("#pid-"+STEP.products[I].stripe+"-0").data('quantity');
        }else{
          var q = 1;
        }
        if(q <= STEP.products[I].quantity.length){
          q++;
        }
        $("#pid-"+STEP.products[I].stripe+"-0").data('quantity',q);
        $('#xxq'+I).html(q);
        //
        CHOSEN_ID = $('input[name=xxprod]:checked').val();
        if($('input[name=xxprod]:checked').data('quantity')){
          QUANTITY = $('input[name=xxprod]:checked').data('quantity');
          $('input[name=xxprod]:checked').data('price',STEP.products[I].quantity[QUANTITY-2].price);
        }else{
          QUANTITY = 1;
        }
        checkProd(calculateID());
      });

      //Actually Appending the PAYMENT METHOD CHOICE FORM
      if(paypalAPP){
        parDOM.prepend(ppBody);
        parDOM.prepend(ppTab);
        parDOM.prepend(ccBody);
        parDOM.prepend(ccTab);
        ccBody.prepend(ccForm);
      }
      
      //FORM SUBMIT
      $('#cfAR').on('submit',function(e){
        e.preventDefault();
        FORM.html(serializeToForm($form.serializeArray()));
        $('body').prepend(FORM);
        FORM.submit();
      });
    
    }else if(STEP.type == 'upsell' || STEP.type == 'downsell'){
      
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

    if(currencyAPP){
      $.get('https://ipinfo.io/?token=87ed38221c7ade', function(data){
        $.getJSON(HOST+'/api/funnelscript/getrate?country=MA&currency=USD',function(data){
          console.log(data);
        });
      });
    }
  }
}
