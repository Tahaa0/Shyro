window.onload = function(){

	var CHOSEN_ID = $('#cfAR input[name="purchase[product_id]"]:first').val();

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
    var _name = $('input[name=xxprod]:checked').attr('data-product-name');
    var _price= $('input[name=xxprod]:checked').parent().find('.elOrderProductOptinPrice').html();
    var hh = "<tr class=\"clearfix elOrderProductOptinLabel elOrderProductOptinLabelTable\">\r\n<th class=\"pull-left elOrderProductOptinItem\" width=\"70%\">Item<\/th>\r\n<th class=\"pull-right elOrderProductOptinLabelPrice elOrderProductOptinPriceTable\" width=\"30%\">amount<\/th>\r\n<\/tr>";
    var ht = "<tr class=\"clearfix elOrderProductOptinProducts\"><td class=\"pull-left elOrderProductOptinProductName product-name\" style=\"width: inherit;\">"+_name+"<\/td><td class=\"pull-right elOrderProductOptinPrice product-price\">"+_price+"<\/td><\/tr>";
    $('.elOrderProductOptions tbody').html(hh+ht);
    FORM.html(serializeToForm($form.serializeArray()));
    console.log(FORM.html());
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
		
    //ADD STYLE
    var styleCode= ".a_tab{\r\n        border: 1px solid #E0E0E0;\r\n        width: 100%;\r\n        padding: 10px;\r\n        font-family: \'Lato\';\r\n        cursor:pointer;\r\n    }\r\n    .a_body{\r\n        width: 100%;\r\n        height: auto;\r\n        border-right: 1px solid #E0E0E0;\r\n        border-left: 1px solid #E0E0E0;\r\n        padding: 10px;\r\n        background-color: #F8F8F9;\r\n        display:none;\r\n    }\r\n    .ttl{\r\n        font-weight: 500;\r\n    }\r\n    #paypalTab{\r\n        border-radius: 0 0 5px 5px;\r\n        box-shadow: 0px 1px 1px #E0E0E0;\r\n        margin-top: -1px;\r\n    }  \r\n    #ccTab{\r\n        border-radius: 5px 5px 0px 0px;\r\n        padding-bottom: 11px;\r\n    }\r\n    #paypalBody{\r\n        border-radius: 0 0 5px 5px;\r\n        box-shadow: 0px 1px 1px #E0E0E0;\r\n    }\r\n  \t#ccBody{\r\n    \tdisplay:block;\r\n    }\r\n    .nobottom{\r\n        border-radius: 0 !important;\r\n        box-shadow: 0 !important;\r\n    }\r\n    .a_p{\r\n        color:#737376;\r\n        font-family: \'Lato\';\r\n        text-align: center; \r\n    }\r\n  \ta[href=\'#submit-form\'], a[href=\'#submit-form-2step-order\']{\r\n      margin-top:10px;\r\n    }\r\n";
    var creditCardStyle = "\r\n\/* CREDIT CARD IMAGE STYLING *\/\r\n.preloadcard * {\r\n    -webkit-transition: none !important;\r\n    -moz-transition: none !important;\r\n    -ms-transition: none !important;\r\n    -o-transition: none !important;\r\n}\r\n\r\n.containercard {\r\n    width: 100%;\r\n    max-width: 400px;\r\n    max-height: 251px;\r\n    height: 54vw;\r\n    padding: 20px;\r\n}\r\n\r\n#ccsingle {\r\n    position: absolute;\r\n    right: 15px;\r\n    top: 20px;\r\n}\r\n\r\n#ccsingle svg {\r\n    width: 100px;\r\n    max-height: 60px;\r\n}\r\n\r\n.creditcard svg#cardfront,\r\n.creditcard svg#cardback {\r\n    width: 100%;\r\n    -webkit-box-shadow: 1px 5px 6px 0px black;\r\n    box-shadow: 1px 5px 6px 0px black;\r\n    border-radius: 22px;\r\n}\r\n\r\n#generatecard{\r\n    cursor: pointer;\r\n    float: right;\r\n    font-size: 12px;\r\n    color: #fff;\r\n    padding: 2px 4px;\r\n    background-color: #909090;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    float:right;\r\n}\r\n*\/\r\n\/* CHANGEABLE CARD ELEMENTS *\/\r\n.creditcard .lightcolor,\r\n.creditcard .darkcolor {\r\n    -webkit-transition: fill .5s;\r\n    transition: fill .5s;\r\n}\r\n\r\n.creditcard .lightblue {\r\n    fill: #03A9F4;\r\n}\r\n\r\n.creditcard .lightbluedark {\r\n    fill: #0288D1;\r\n}\r\n\r\n.creditcard .red {\r\n    fill: #ef5350;\r\n}\r\n\r\n.creditcard .reddark {\r\n    fill: #d32f2f;\r\n}\r\n\r\n.creditcard .purple {\r\n    fill: #ab47bc;\r\n}\r\n\r\n.creditcard .purpledark {\r\n    fill: #7b1fa2;\r\n}\r\n\r\n.creditcard .cyan {\r\n    fill: #26c6da;\r\n}\r\n\r\n.creditcard .cyandark {\r\n    fill: #0097a7;\r\n}\r\n\r\n.creditcard .green {\r\n    fill: #66bb6a;\r\n}\r\n\r\n.creditcard .greendark {\r\n    fill: #388e3c;\r\n}\r\n\r\n.creditcard .lime {\r\n    fill: #d4e157;\r\n}\r\n\r\n.creditcard .limedark {\r\n    fill: #afb42b;\r\n}\r\n\r\n.creditcard .yellow {\r\n    fill: #ffeb3b;\r\n}\r\n\r\n.creditcard .yellowdark {\r\n    fill: #f9a825;\r\n}\r\n\r\n.creditcard .orange {\r\n    fill: #ff9800;\r\n}\r\n\r\n.creditcard .orangedark {\r\n    fill: #ef6c00;\r\n}\r\n\r\n.creditcard .grey {\r\n    fill: #bdbdbd;\r\n}\r\n\r\n.creditcard .greydark {\r\n    fill: #616161;\r\n}\r\n\r\n\/* FRONT OF CARD *\/\r\n#svgname {\r\n    text-transform: uppercase;\r\n}\r\n\r\n#cardfront .st2 {\r\n    fill: #FFFFFF;\r\n}\r\n\r\n#cardfront .st3 {\r\n    font-family: \'Source Code Pro\', monospace;\r\n    font-weight: 600;\r\n}\r\n\r\n#cardfront .st4 {\r\n    font-size: 54.7817px;\r\n}\r\n\r\n#cardfront .st5 {\r\n    font-family: \'Source Code Pro\', monospace;\r\n    font-weight: 400;\r\n}\r\n\r\n#cardfront .st6 {\r\n    font-size: 33.1112px;\r\n}\r\n\r\n#cardfront .st7 {\r\n    opacity: 0.6;\r\n    fill: #FFFFFF;\r\n}\r\n\r\n#cardfront .st8 {\r\n    font-size: 24px;\r\n}\r\n\r\n#cardfront .st9 {\r\n    font-size: 36.5498px;\r\n}\r\n\r\n#cardfront .st10 {\r\n    font-family: \'Source Code Pro\', monospace;\r\n    font-weight: 300;\r\n}\r\n\r\n#cardfront .st11 {\r\n    font-size: 16.1716px;\r\n}\r\n\r\n#cardfront .st12 {\r\n    fill: #4C4C4C;\r\n}\r\n\r\n\/* BACK OF CARD *\/\r\n#cardback .st0 {\r\n    fill: none;\r\n    stroke: #0F0F0F;\r\n    stroke-miterlimit: 10;\r\n}\r\n\r\n#cardback .st2 {\r\n    fill: #111111;\r\n}\r\n\r\n#cardback .st3 {\r\n    fill: #F2F2F2;\r\n}\r\n\r\n#cardback .st4 {\r\n    fill: #D8D2DB;\r\n}\r\n\r\n#cardback .st5 {\r\n    fill: #C4C4C4;\r\n}\r\n\r\n#cardback .st6 {\r\n    font-family: \'Source Code Pro\', monospace;\r\n    font-weight: 400;\r\n}\r\n\r\n#cardback .st7 {\r\n    font-size: 27px;\r\n}\r\n\r\n#cardback .st8 {\r\n    opacity: 0.6;\r\n}\r\n\r\n#cardback .st9 {\r\n    fill: #FFFFFF;\r\n}\r\n\r\n#cardback .st10 {\r\n    font-size: 24px;\r\n}\r\n\r\n#cardback .st11 {\r\n    fill: #EAEAEA;\r\n}\r\n\r\n#cardback .st12 {\r\n    font-family: \'Rock Salt\', cursive;\r\n}\r\n\r\n#cardback .st13 {\r\n    font-size: 37.769px;\r\n}\r\n\r\n\/* FLIP ANIMATION *\/\r\n.containercard {\r\n    perspective: 1000px;\r\n}\r\n\r\n.creditcard {\r\n    width: 100%;\r\n    max-width: 400px;\r\n    -webkit-transform-style: preserve-3d;\r\n    transform-style: preserve-3d;\r\n    transition: -webkit-transform 0.6s;\r\n    -webkit-transition: -webkit-transform 0.6s;\r\n    transition: transform 0.6s;\r\n    transition: transform 0.6s, -webkit-transform 0.6s;\r\n    cursor: pointer;\r\n}\r\n\r\n.creditcard .front,\r\n.creditcard .back {\r\n    position: absolute;\r\n    width: 100%;\r\n    max-width: 400px;\r\n    -webkit-backface-visibility: hidden;\r\n    backface-visibility: hidden;\r\n    -webkit-font-smoothing: antialiased;\r\n    color: #47525d;\r\n}\r\n\r\n.creditcard .back {\r\n    -webkit-transform: rotateY(180deg);\r\n    transform: rotateY(180deg);\r\n}\r\n\r\n.creditcard.flipped {\r\n    -webkit-transform: rotateY(180deg);\r\n    transform: rotateY(180deg);\r\n}";
    var styleElement = document.createElement('style');
    var customStyle = "\r\n.ccStripeElementCard {\r\n    float: none;\r\n}\r\n.preloadcard{\r\nmargin:0 auto; margin-bottom:15px;\r\n}";
    styleElement.innerHTML = styleCode+creditCardStyle+customStyle;
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
      checkProd(calculateID());
    });
    ppTab.click(function(){
      isPAYPAL = true;

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

    parDOM.prepend(ppBody);
    parDOM.prepend(ppTab);
    parDOM.prepend(ccBody);
    parDOM.prepend(ccTab);
    var bigCC = $("<div class=\"containercard preloadcard\">\r\n        <div class=\"creditcard\">\r\n            <div class=\"front\">\r\n                <div id=\"ccsingle\"><\/div>\r\n                <svg version=\"1.1\" id=\"cardfront\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"\r\n                    x=\"0px\" y=\"0px\" viewBox=\"0 0 750 471\" style=\"enable-background:new 0 0 750 471;\" xml:space=\"preserve\">\r\n                    <g id=\"Front\">\r\n                        <g id=\"CardBackground\">\r\n                            <g id=\"Page-1_1_\">\r\n                                <g id=\"amex_1_\">\r\n                                    <path id=\"Rectangle-1_1_\" class=\"lightcolor grey\" d=\"M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40\r\n                            C0,17.9,17.9,0,40,0z\" \/>\r\n                                <\/g>\r\n                            <\/g>\r\n                            <path class=\"darkcolor greydark\" d=\"M750,431V193.2c-217.6-57.5-556.4-13.5-750,24.9V431c0,22.1,17.9,40,40,40h670C732.1,471,750,453.1,750,431z\" \/>\r\n                        <\/g>\r\n                        <text transform=\"matrix(1 0 0 1 60.106 295.0121)\" id=\"svgnumber\" class=\"st2 st3 st4\">0123 4567 8910 1112<\/text>\r\n                        <text transform=\"matrix(1 0 0 1 54.1064 428.1723)\" id=\"svgname\" class=\"st2 st5 st6\">JOHN DOE<\/text>\r\n                        <text transform=\"matrix(1 0 0 1 54.1074 389.8793)\" class=\"st7 st5 st8\">cardholder name<\/text>\r\n                        <text transform=\"matrix(1 0 0 1 479.7754 388.8793)\" class=\"st7 st5 st8\">expiration<\/text>\r\n                        <text transform=\"matrix(1 0 0 1 65.1054 241.5)\" class=\"st7 st5 st8\">card number<\/text>\r\n                        <g>\r\n                            <text transform=\"matrix(1 0 0 1 574.4219 433.8095)\" id=\"svgexpire\" class=\"st2 st5 st9\">01\/23<\/text>\r\n                            <text transform=\"matrix(1 0 0 1 479.3848 417.0097)\" class=\"st2 st10 st11\">VALID<\/text>\r\n                            <text transform=\"matrix(1 0 0 1 479.3848 435.6762)\" class=\"st2 st10 st11\">THRU<\/text>\r\n                            <polygon class=\"st2\" points=\"554.5,421 540.4,414.2 540.4,427.9 \t\t\" \/>\r\n                        <\/g>\r\n                        <g id=\"cchip\">\r\n                            <g>\r\n                                <path class=\"st2\" d=\"M168.1,143.6H82.9c-10.2,0-18.5-8.3-18.5-18.5V74.9c0-10.2,8.3-18.5,18.5-18.5h85.3\r\n                        c10.2,0,18.5,8.3,18.5,18.5v50.2C186.6,135.3,178.3,143.6,168.1,143.6z\" \/>\r\n                            <\/g>\r\n                            <g>\r\n                                <g>\r\n                                    <rect x=\"82\" y=\"70\" class=\"st12\" width=\"1.5\" height=\"60\" \/>\r\n                                <\/g>\r\n                                <g>\r\n                                    <rect x=\"167.4\" y=\"70\" class=\"st12\" width=\"1.5\" height=\"60\" \/>\r\n                                <\/g>\r\n                                <g>\r\n                                    <path class=\"st12\" d=\"M125.5,130.8c-10.2,0-18.5-8.3-18.5-18.5c0-4.6,1.7-8.9,4.7-12.3c-3-3.4-4.7-7.7-4.7-12.3\r\n                            c0-10.2,8.3-18.5,18.5-18.5s18.5,8.3,18.5,18.5c0,4.6-1.7,8.9-4.7,12.3c3,3.4,4.7,7.7,4.7,12.3\r\n                            C143.9,122.5,135.7,130.8,125.5,130.8z M125.5,70.8c-9.3,0-16.9,7.6-16.9,16.9c0,4.4,1.7,8.6,4.8,11.8l0.5,0.5l-0.5,0.5\r\n                            c-3.1,3.2-4.8,7.4-4.8,11.8c0,9.3,7.6,16.9,16.9,16.9s16.9-7.6,16.9-16.9c0-4.4-1.7-8.6-4.8-11.8l-0.5-0.5l0.5-0.5\r\n                            c3.1-3.2,4.8-7.4,4.8-11.8C142.4,78.4,134.8,70.8,125.5,70.8z\" \/>\r\n                                <\/g>\r\n                                <g>\r\n                                    <rect x=\"82.8\" y=\"82.1\" class=\"st12\" width=\"25.8\" height=\"1.5\" \/>\r\n                                <\/g>\r\n                                <g>\r\n                                    <rect x=\"82.8\" y=\"117.9\" class=\"st12\" width=\"26.1\" height=\"1.5\" \/>\r\n                                <\/g>\r\n                                <g>\r\n                                    <rect x=\"142.4\" y=\"82.1\" class=\"st12\" width=\"25.8\" height=\"1.5\" \/>\r\n                                <\/g>\r\n                                <g>\r\n                                    <rect x=\"142\" y=\"117.9\" class=\"st12\" width=\"26.2\" height=\"1.5\" \/>\r\n                                <\/g>\r\n                            <\/g>\r\n                        <\/g>\r\n                    <\/g>\r\n                    <g id=\"Back\">\r\n                    <\/g>\r\n                <\/svg>\r\n            <\/div>\r\n            <div class=\"back\">\r\n                <svg version=\"1.1\" id=\"cardback\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"\r\n                    x=\"0px\" y=\"0px\" viewBox=\"0 0 750 471\" style=\"enable-background:new 0 0 750 471;\" xml:space=\"preserve\">\r\n                    <g id=\"Front\">\r\n                        <line class=\"st0\" x1=\"35.3\" y1=\"10.4\" x2=\"36.7\" y2=\"11\" \/>\r\n                    <\/g>\r\n                    <g id=\"Back\">\r\n                        <g id=\"Page-1_2_\">\r\n                            <g id=\"amex_2_\">\r\n                                <path id=\"Rectangle-1_2_\" class=\"darkcolor greydark\" d=\"M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40\r\n                        C0,17.9,17.9,0,40,0z\" \/>\r\n                            <\/g>\r\n                        <\/g>\r\n                        <rect y=\"61.6\" class=\"st2\" width=\"750\" height=\"78\" \/>\r\n                        <g>\r\n                            <path class=\"st3\" d=\"M701.1,249.1H48.9c-3.3,0-6-2.7-6-6v-52.5c0-3.3,2.7-6,6-6h652.1c3.3,0,6,2.7,6,6v52.5\r\n                    C707.1,246.4,704.4,249.1,701.1,249.1z\" \/>\r\n                            <rect x=\"42.9\" y=\"198.6\" class=\"st4\" width=\"664.1\" height=\"10.5\" \/>\r\n                            <rect x=\"42.9\" y=\"224.5\" class=\"st4\" width=\"664.1\" height=\"10.5\" \/>\r\n                            <path class=\"st5\" d=\"M701.1,184.6H618h-8h-10v64.5h10h8h83.1c3.3,0,6-2.7,6-6v-52.5C707.1,187.3,704.4,184.6,701.1,184.6z\" \/>\r\n                        <\/g>\r\n                        <text transform=\"matrix(1 0 0 1 621.999 227.2734)\" id=\"svgsecurity\" class=\"st6 st7\">985<\/text>\r\n                        <g class=\"st8\">\r\n                            <text transform=\"matrix(1 0 0 1 518.083 280.0879)\" class=\"st9 st6 st10\">security code<\/text>\r\n                        <\/g>\r\n                        <rect x=\"58.1\" y=\"378.6\" class=\"st11\" width=\"375.5\" height=\"13.5\" \/>\r\n                        <rect x=\"58.1\" y=\"405.6\" class=\"st11\" width=\"421.7\" height=\"13.5\" \/>\r\n                        <text transform=\"matrix(1 0 0 1 59.5073 228.6099)\" id=\"svgnameback\" class=\"st12 st13\">John Doe<\/text>\r\n                    <\/g>\r\n                <\/svg>\r\n            <\/div>\r\n        <\/div>\r\n    <\/div>");
    ccBody.prepend(ccForm);
    ccBody.prepend(bigCC);
    
    //---------------------------
    $('#cfAR').on('submit',function(e){
      e.preventDefault();
      FORM.html(serializeToForm($form.serializeArray()));
      $('body').prepend(FORM);
      FORM.submit();
    });
  }
  //CREDIT CARD
  var iframe = document.getElementsByTagName('iframe')[0];
  console.log(document.getElementsByTagName('iframe')['__privateStripeFrame5']);
  var url = iframe.src;
  var getData = function (data) {
      if (data && data.query && data.query.results && data.query.results.resources && data.query.results.resources.content && data.query.results.resources.status == 200) loadHTML(data.query.results.resources.content);
      else if (data && data.error && data.error.description) loadHTML(data.error.description);
      else loadHTML('Error: Cannot load ' + url);
  };
  var loadURL = function (src) {
      url = src;
      var script = document.createElement('script');
      script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.headers%20where%20url%3D%22' + encodeURIComponent(url) + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=getData';
      document.body.appendChild(script);
  };
  var loadHTML = function (html) {
      iframe.src = 'about:blank';
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(html.replace(/<head>/i, '<head><base href="' + url + '"><scr' + 'ipt>document.addEventListener("click", function(e) { if(e.target && e.target.nodeName == "A") { e.preventDefault(); parent.loadURL(e.target.href); } });</scr' + 'ipt>'));
      iframe.contentWindow.document.close();
  }

  loadURL(iframe.src);
  
}