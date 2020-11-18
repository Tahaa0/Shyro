const Funnels = require('../models/funnel');
const User = require('../models/user');
const tools = require('../utils/tools');
const cc = require('iso-country-currency');
const request = require('request');

exports.index = async function (req, res) {
    const funnels = await Funnels.find({userId:req.session['user_id']});
    res.status(200).json({funnels});
};


exports.create = async (req, res) => {
    try {
    	const {title} = req.body;
        const steps = JSON.parse(req.body.steps);
        const id = req.session['user_id'];

        var user_ = await User.findById(id);

    	var dt = {
    		userId: user_._id,
    		title:title,
    		steps:steps,
            apps:{
                paypal:false,
                currencyConverter: false,
                funnelCurrency: 'USD'
            }
    	}
    	const funnel_ = new Funnels(dt);

        await funnel_.save();

        res.status(200).json(funnel_);

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
};

exports.update = async function (req, res) {
    try {

        const update = req.body;
        update.steps = JSON.parse(update.steps); //parsing
        update.apps = JSON.parse(update.apps);

        const id = req.params.id;
        const userId = req.session['user_id'];

        //Make sure the passed id is that of the logged in user
        const funnel_ = await Funnels.findById(id);

        if (!funnel_) return res.status(401).json({message: 'Funnel does not exist'});
        if (req.session['user_id'].toString() !== funnel_.userId.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        const funnel = await Funnels.findByIdAndUpdate(id, {$set: update}, {new: true});

        return res.status(200).json({funnel: funnel, message: 'Funnel has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.headScript = async function (req, res) {
    try {
        const id = req.params.id;

        const funnel_ = await Funnels.findById(id);

        if (!funnel_) return res.status(401).json({message: 'Funnel does not exist'});
        
        var stepURLs = [];
        var steps = funnel_.steps;

        for(var i=0;i<funnel_.steps.length;i++){
            var pathParts = funnel_.steps[i].url.split('/');
            stepURLs.push(pathParts[pathParts.length-1].trim());
        }

        var dataContent = '\r\nvar funnelCurrency = "'+funnel_.apps.get('funnelCurrency').toString()+'";\r\nvar currencyAPP = '+funnel_.apps.get('currencyConverter').toString()+';\r\nvar paypalAPP = '+funnel_.apps.get('paypal').toString()+';\r\nvar isPAYPAL = false;\r\nvar STEP_URLS = '+JSON.stringify(stepURLs)+';\r\nvar STEPS = '+JSON.stringify(steps)+';\r\n\r\n';
        var fileContent = "window.onload = function(){\r\n\r\n  \/\/Hide variant box\r\n  $(\'.varibox\').hide();\r\n\r\n\r\n\tvar CHOSEN_ID = $(\'#cfAR input[name=\"purchase[product_id]\"]:first\').val();\r\n  var QUANTITY = 1;\r\n  var BUMPS = [];\r\n  \r\n  var HOST = \"http:\/\/cfapp20.herokuapp.com\";\r\n  \/\/GET FORM INTO DATA MODE TO SEND AFTER CUSTOMIZATION\r\n  var $form = $(\'#cfAR\');\r\n  var FORM = $(\"<form><\/form>\");\r\n  FORM.attr(\'target\',$form.attr(\'target\'));\r\n  FORM.attr(\'method\',$form.attr(\'method\'));\r\n  FORM.attr(\'action\',$form.attr(\'action\'));\r\n  FORM.html(serializeToForm($form.serializeArray()));\r\n\r\n  \/\/Gets the right product ID by indentifying which payment method is chosen\r\n  function calculateID() {\r\n    for(var i=0;i<STEP.products.length;i++){\r\n      if(STEP.products[i].paypal == CHOSEN_ID || STEP.products[i].stripe == CHOSEN_ID){\r\n          if(QUANTITY == 1){\r\n            if(isPAYPAL){\r\n              return STEP.products[i].paypal;\r\n            }else{\r\n              return STEP.products[i].stripe;\r\n            }\r\n          }else{\r\n            if(isPAYPAL){\r\n              return STEP.products[i].quantity[QUANTITY-2].paypal;\r\n            }else{\r\n              return STEP.products[i].quantity[QUANTITY-2].stripe;\r\n            }\r\n          }\r\n      }\r\n    }\r\n  }\r\n\r\n  function serializeToForm(arr){\r\n    var html = \"\";\r\n    for(var i=0;i<arr.length;i++){\r\n      html += \"<input name=\'\"+arr[i].name+\"\' value=\'\"+arr[i].value+\"\'>\";\r\n    }\r\n    return html;\r\n  }\r\n\r\n  \/\/After a product is chosen\r\n  function checkProd(id){\r\n    $(\'#cfAR input[name=\"purchase[product_id]\"],#cfAR input[name=\"purchase[product_ids][]\"]\').removeAttr(\'checked\');\r\n    $(\'#pid-\'+id+\'-1[name=\"purchase[product_ids][]\"]\').attr(\'checked\',\'checked\');\r\n    var hb = \"\";\r\n    for(var j=0;j<BUMPS.length;j++){\r\n      for(var i=0;i<STEP.products.length;i++){\r\n        if(STEP.products[i].paypal == BUMPS[j] || STEP.products[i].stripe == BUMPS[j]){\r\n          var b_name = STEP.products[i].title;\r\n          var b_price = STEP.products[i].price;\r\n          hb += \"<tr class=\\\"clearfix elOrderProductOptinProducts\\\"><td class=\\\"pull-left elOrderProductOptinProductName product-name\\\" style=\\\"width: inherit;\\\">\"+b_name+\"<\\\/td><td class=\\\"pull-right elOrderProductOptinPrice product-price\\\">$\"+b_price+\"<\\\/td><\\\/tr>\";\r\n            if(isPAYPAL){\r\n                $(\'#pid-\'+STEP.products[i].paypal+\'-1[name=\"purchase[product_ids][]\"]\').attr(\'checked\',\'checked\');\r\n            }else{\r\n                $(\'#pid-\'+STEP.products[i].stripe+\'-1[name=\"purchase[product_ids][]\"]\').attr(\'checked\',\'checked\');\r\n            }\r\n        }\r\n      }\r\n    }\r\n\r\n    var _name = $(\'input[name=xxprod]:checked\').attr(\'data-product-name\');\r\n    var _price= $(\'input[name=xxprod]:checked\').parent().parent().find(\'.elOrderProductOptinPrice\').html();\r\n    var hh = \"<tr class=\\\"clearfix elOrderProductOptinLabel elOrderProductOptinLabelTable\\\">\\r\\n<th class=\\\"pull-left elOrderProductOptinItem\\\" width=\\\"70%\\\">Item<\\\/th>\\r\\n<th class=\\\"pull-right elOrderProductOptinLabelPrice elOrderProductOptinPriceTable\\\" width=\\\"30%\\\">amount<\\\/th>\\r\\n<\\\/tr>\";\r\n    if($(\'input[name=xxprod]:checked\').data(\'quantity\') > 1){\r\n      _name += \" (x\"+$(\'input[name=xxprod]:checked\').data(\'quantity\')+\")\";\r\n      _price = \"$\"+$(\'input[name=xxprod]:checked\').data(\'price\');\r\n    }\r\n    var ht = \"<tr class=\\\"clearfix elOrderProductOptinProducts\\\"><td class=\\\"pull-left elOrderProductOptinProductName product-name\\\" style=\\\"width: inherit;\\\">\"+_name+\"<\\\/td><td class=\\\"pull-right elOrderProductOptinPrice product-price\\\">\"+_price+\"<\\\/td><\\\/tr>\";\r\n    \r\n    $(\'.elOrderProductOptions tbody\').html(hh+ht+hb);\r\n    FORM.html(serializeToForm($form.serializeArray()));\r\n  }\r\n\r\n  \r\n  var pathParts = window.location.pathname.split(\'\/\');\r\n  var endPath = pathParts[pathParts.length-1].trim();\r\n  var VALID = false;\r\n  for(var i=0;i<STEP_URLS.length;i++){\r\n    if(STEP_URLS[i] == endPath){\r\n      VALID = true;\r\n      break;\r\n    }\r\n  }\r\n\tif(VALID){\r\n\t\t\r\n    if(STEP.type ==\'form\'){\r\n      \/\/ADD STYLE\r\n      var styleCode= \".a_tab{\\r\\n        border: 1px solid #E0E0E0;\\r\\n        width: 100%;\\r\\n        padding: 10px;\\r\\n        font-family: \\\'Lato\\\';\\r\\n        cursor:pointer;\\r\\n    }\\r\\n    .a_body{\\r\\n        width: 100%;\\r\\n        height: auto;\\r\\n        border-right: 1px solid #E0E0E0;\\r\\n        border-left: 1px solid #E0E0E0;\\r\\n        padding: 10px;\\r\\n        background-color: #F8F8F9;\\r\\n        display:none;\\r\\n    }\\r\\n    .ttl{\\r\\n        font-weight: 500;\\r\\n    }\\r\\n    #paypalTab{\\r\\n        border-radius: 0 0 5px 5px;\\r\\n        box-shadow: 0px 1px 1px #E0E0E0;\\r\\n        margin-top: -1px;\\r\\n    }  \\r\\n    #ccTab{\\r\\n        border-radius: 5px 5px 0px 0px;\\r\\n        padding-bottom: 11px;\\r\\n    }\\r\\n    #paypalBody{\\r\\n        border-radius: 0 0 5px 5px;\\r\\n        box-shadow: 0px 1px 1px #E0E0E0;\\r\\n    }\\r\\n  \\t#ccBody{\\r\\n    \\tdisplay:block;\\r\\n    }\\r\\n    .nobottom{\\r\\n        border-radius: 0 !important;\\r\\n        box-shadow: 0 !important;\\r\\n    }\\r\\n    .a_p{\\r\\n        color:#737376;\\r\\n        font-family: \\\'Lato\\\';\\r\\n        text-align: center; \\r\\n    }\\r\\n  \\ta[href=\\\'#submit-form\\\'], a[href=\\\'#submit-form-2step-order\\\']{\\r\\n      margin-top:10px;\\r\\n    }\\r\\n\";\r\n      var styleElement = document.createElement(\'style\');\r\n      var customStyle = \"\\r\\n.ccStripeElementCard {\\r\\n    float: none;\\r\\n} #log_pp{height:28px} #log_cc{height:21px; float:right; padding-right: 4px;}\";\r\n      var radioStyle = \"\\\/* The container *\\\/\\r\\n.radlab {\\r\\n  position: relative;\\r\\n  padding-left: 35px;\\r\\n  margin-bottom: 12px;\\r\\n  cursor: pointer;\\r\\n  font-size: 12px;\\r\\n  -webkit-user-select: none;\\r\\n  -moz-user-select: none;\\r\\n  -ms-user-select: none;\\r\\n  user-select: none;\\r\\n}\\r\\n\\r\\n\\\/* Hide the browser\\\'s default radio button *\\\/\\r\\n.radlab input {\\r\\n  position: absolute;\\r\\n  opacity: 0;\\r\\n  cursor: pointer;\\r\\n}\\r\\n\\r\\n\\\/* Create a custom radio button *\\\/\\r\\n.checkmark {\\r\\n  position: absolute;\\r\\n  top: -2px;\\r\\n  left: 0;\\r\\n  height: 18px;\\r\\n  width: 18px;\\r\\n  background-color: #eee;\\r\\n  border-radius: 50%;\\r\\n}\\r\\n\\r\\n\\\/* On mouse-over, add a grey background color *\\\/\\r\\n.radlab:hover input ~ .checkmark {\\r\\n  background-color: #ccc;\\r\\n}\\r\\n\\r\\n\\\/* When the radio button is checked, add a blue background *\\\/\\r\\n.radlab input:checked ~ .checkmark {\\r\\n  background-color: #2196F3;\\r\\n}\\r\\n\\r\\n\\\/* Create the indicator (the dot\\\/circle - hidden when not checked) *\\\/\\r\\n.checkmark:after {\\r\\n  content: \\\"\\\";\\r\\n  position: absolute;\\r\\n  display: none;\\r\\n}\\r\\n\\r\\n\\\/* Show the indicator (dot\\\/circle) when checked *\\\/\\r\\n.radlab input:checked ~ .checkmark:after {\\r\\n  display: block;\\r\\n}\\r\\n\\r\\n\\\/* Style the indicator (dot\\\/circle) *\\\/\\r\\n.radlab .checkmark:after {\\r\\n \\ttop: 5px;\\r\\n\\tleft: 5px;\\r\\n\\twidth: 8px;\\r\\n\\theight: 8px;\\r\\n\\tborder-radius: 50%;\\r\\n\\tbackground: white;\\r\\n}\";\r\n      var highlightStyle = \".highlighted{\\r\\n  background-color:#FEFF04;\\r\\n  border-radius:5px;\\r\\n  width: 105% !important;\\r\\n  padding:17px;\\r\\n  margin-left: -15px;\\r\\n  border: 1px solid #A0A0A0;\\r\\n  box-shadow: 0 1px 1px #A0A0A0;\\r\\n  font-weight:bold;\\r\\n}\\r\\n.highlighted .radlab{\\r\\n\\tdisplay: inline-block;\\r\\n\\tvertical-align: top;\\r\\n\\tmargin-top: 17px;\\r\\n}\";\r\n      var bumpStyle = \".bump1{\\r\\n\\tborder: 3px solid #BE386D;\\r\\n\\tborder-radius: 5px;\\r\\n\\twidth: auto;\\r\\n\\tcolor: black;\\r\\n\\tpadding: 8px;\\r\\n       font-family:\\\'Montserrat\\\';\\r\\n       font-size:16px;\\r\\n}\\r\\n.bump1 label{\\r\\n\\tbackground-color: black;\\r\\n\\tcolor: white;\\r\\n\\twidth: 100%;\\r\\n\\tdisplay: inline-block;\\t\\r\\n\\ttext-align: center;\\r\\n\\tpadding: 5px 0;\\r\\n}\\r\\n.bump1 .x1{\\r\\n\\tfont-weight: bold;\\t\\r\\n\\ttext-decoration: underline;\\r\\n}\\r\\n.bump1 h4{\\r\\n\\tmargin: 0;\\r\\n\\ttext-align: center;\\t\\r\\n\\tfont-size: 18px;\\r\\n\\tpadding: 0 10px 10px 10px;\\r\\n\\tfont-weight:700;\\r\\n}\";\r\n      var varStyle = \".xxvar{\\r\\n\\tdisplay: inline-block;\\r\\n\\tborder: 2px solid #E0E0E0;\\r\\n\\tpadding: 10px;\\r\\n\\tborder-radius: 4px;\\r\\n\\tmargin-left: 3px;\\r\\n\\tmargin-right: 3px;\\r\\n\\tcursor: pointer;\\r\\n\\tbackground-color: white;\\r\\n}\\r\\n.varActive{\\r\\n\\tbackground-color: #2196F3;\\r\\n\\tcolor: white;\\r\\n\\tfont-weight: 900;\\r\\n\\tborder: 2px solid #2196F3;\\r\\n}\\r\\n.varibox{\\r\\n\\tmargin-top: 7px;\\r\\n\\tpadding-left: 35px;\\r\\n}\\r\\n.varilabel{\\r\\n\\tmin-width: 85px;\\r\\n\\tdisplay: inline-block;\\r\\n}\";\r\n      var qStyle = \".xxqm,.xxqp{\\r\\n\\tdisplay: inline-block;\\r\\n\\tpadding: 10px;\\r\\n\\tfont-weight: 900;\\r\\n\\tcolor: #2196F3;\\r\\n\\tcursor: pointer;\\r\\n}\\r\\n.xxquantity{\\r\\n\\tpadding: 4px 20px;\\r\\n\\tbackground-color: #EEEEEE;\\r\\n\\tfont-weight: 500;\\r\\n\\tborder-radius: 12px;\\r\\n}\\r\\n.xxqm{\\r\\n\\tmargin-left: 20px;\\r\\n}\\r\\n.qtybox{\\r\\n\\tdisplay: inline-block;\\r\\n}\";\r\n      var productChoiceStyle = \".elProductOptionsBox .elOrderProductOptinProductName {\\r\\n    padding: 12px;\\r\\n    border: 1px solid #E4E4E4;\\r\\n    border-radius: 4px;\\r\\n    margin-bottom: 0px;\\r\\n}\";\r\n      var bump2Style = \"@import url(\'https:\/\/fonts.googleapis.com\/css?family=Poppins:300,400,500,600\'); .bump2{\\r\\n\\twidth: 600px;\\r\\n\\tmargin: 0 auto;\\r\\n\\tmargin-top: 50px;\\r\\n\\tborder: 3px solid #EEEEEE;\\r\\n\\tborder-radius: 5px;\\r\\n\\tbackground-color: white;\\r\\n\\tcolor:black;\\r\\n\\tfont-family: \\\'Poppins\\\';\\r\\n}\\r\\n.bump2 img{\\r\\n\\tdisplay: inline-block;\\r\\n\\twidth: 15%;\\r\\n\\tmargin-left: 7px;\\r\\n\\tmargin-top: -15px;\\r\\n}\\r\\n.bump2 .desc_{\\r\\n\\twidth: 60%;\\r\\n\\tdisplay: inline-block;\\r\\n\\tvertical-align: top;\\r\\n}\\r\\n.bump2 .smt{\\r\\n\\tdisplay: block;\\r\\n\\tpadding-top: 14px;\\r\\n\\tfont-weight: bold;\\r\\n\\tletter-spacing: -0.2px;\\r\\n\\tfont-size: 14px;\\r\\n}\\r\\n.bump2 .smt2{\\r\\n\\tdisplay: block;\\r\\n\\tpadding-top: 2px;\\r\\n\\tfont-size: 14px;\\r\\n\\tfont-weight: 300;\\r\\n\\tcolor:#4AAF59;\\r\\n}\\r\\n.bump2 .smt2>strong{\\r\\n\\tfont-weight: bold;\\r\\n}\\r\\n.bump2 p{\\r\\n\\tdisplay: block;\\r\\n\\tmargin: 0;\\r\\n\\tpadding-top: 2px;\\r\\n\\tfont-size: 12px;\\r\\n\\tfont-weight: 400;\\r\\n\\twidth: auto;\\r\\n\\tpadding-bottom: 10px;\\r\\n}\\r\\n.bump2 .action{\\r\\n\\tdisplay: inline-block;\\r\\n\\tvertical-align: top;\\r\\n\\ttext-align: center;\\r\\n\\twidth: 20%;\\r\\n\\theight: 100%;\\r\\n}\\r\\n.bump2 button{\\r\\n\\tdisplay: inline-block;\\r\\n\\twidth: auto;\\r\\n\\tmargin-top: 32px;\\r\\n\\tborder-radius: 3px;\\r\\n\\tborder: 1px solid #E0E0E0;\\r\\n\\tbackground-color: white;\\r\\n\\tcolor: #8a8a8a;\\r\\n\\tfont-weight: bold;\\r\\n\\twidth: 80%;\\r\\n\\tfont-size: 15px;\\r\\n}\\r\\n\";\r\n      styleElement.innerHTML = styleCode+customStyle+radioStyle+highlightStyle+bumpStyle+varStyle+qStyle+productChoiceStyle+bump2Style;\r\n      var head = document.getElementsByTagName(\'head\')[0];\r\n      head.appendChild(styleElement);\r\n      \r\n      \/\/-----------------\r\n      \/\/ADD FORM \/ BUTTON\r\n      checkProd(calculateID());\r\n\r\n      \/\/MOVE THE BUY BUTTON Outside (necessary step)\r\n\r\n      window.buyButton = $(\"a[href=\'#submit-form\'], a[href=\'#submit-form-2step-order\']\");\r\n      var $parentDiv = window.buyButton.parent();\r\n        \r\n      var anc = $parentDiv.parent();\r\n      anc.append(window.buyButton);\r\n      $parentDiv.hide();\r\n      \r\n      \/\/ADD Payment method choice form\r\n\r\n      var ccForm = $(\'.elCreditCardForm\');\r\n      var parDOM = ccForm.parent();\r\n      console.log(parDOM);\r\n      var ccTab = $(\'<div id=\"ccTab\" class=\"a_tab\"><label class=\"radlab\"><input type=\"radio\" checked=\"checked\" name=\"ispp\" id=\"ccRadio\"><span class=\"checkmark\"><\/span><\/label><span class=\"ttl\">Credit Card<\/span><img id=\"log_cc\" src=\"\'+HOST+\'\/views\/app\/creditcards.png\"><\/div>\');\r\n      var ccBody = $(\'<div id=\"ccBody\" class=\"a_body\"><\/div>\');\r\n      var ppTab = $(\'<div id=\"paypalTab\" class=\"a_tab\"><label class=\"radlab\"><input type=\"radio\" name=\"ispp\" id=\"ppRadio\"><span class=\"checkmark\"><\/span><\/label><span class=\"ttl\"><img id=\"log_pp\" src=\"\'+HOST+\'\/views\/app\/paypal.png\"><\/span><\/div>\');\r\n      var ppBody = $(\'<div id=\"paypalBody\" class=\"a_body\"><p class=\"a_p\">After submitting, you will be redirected to paypal to purchase securely.<\/p><\/div>\');\r\n      localStorage.setItem(\'pmethod555\',\'stripe\');\r\n      ccTab.on(\'click\',function(){\r\n        isPAYPAL = false;\r\n        $(\'#ccRadio\').attr(\'checked\', \'checked\');\r\n        localStorage.setItem(\'pmethod555\',\'stripe\');\r\n        ppBody.slideUp(200);\r\n        ccBody.slideDown(200);\r\n        ppTab.removeClass(\'nobottom\');\r\n        window.buyButton.show();\r\n        $parentDiv.hide();\r\n        checkProd(calculateID());\r\n      });\r\n      ppTab.click(function(){\r\n        isPAYPAL = true;\r\n        localStorage.setItem(\'pmethod555\',\'paypal\');\r\n        $(\'#ppRadio\').attr(\'checked\', \'checked\');\r\n        ccBody.slideUp(200);\r\n        ppBody.slideDown(200);\r\n        ppTab.addClass(\'nobottom\');\r\n        window.buyButton.hide();\r\n        $parentDiv.show();\r\n        checkProd(calculateID());\r\n      });\r\n\r\n      \r\n      \/\/UPON CLICKING A PRODUCT slide varibox and select quantity\r\n      $(\'input[name=xxprod]\').click(function () {\r\n        $(\'.varibox\').slideUp(300);\r\n        $(this).parent().parent().find(\'.varibox\').slideDown(300);\r\n        CHOSEN_ID = $(\'input[name=xxprod]:checked\').val();\r\n        if($(\'input[name=xxprod]:checked\').data(\'quantity\')){\r\n          QUANTITY = $(\'input[name=xxprod]:checked\').data(\'quantity\');\r\n        }else{\r\n          QUANTITY = 1;\r\n        }\r\n        checkProd(calculateID());\r\n      });\r\n      \r\n      $(\'input[name=xxprod]:first\').attr(\'checked\',\'checked\');\r\n      $(\'input[name=xxprod]:first\').parent().parent().find(\'.varibox\').show();\r\n\r\n      CHOSEN_ID = $(\'input[name=xxprod]:first\').val();\r\n      \/\/HIGHLIGHT\r\n      for(var i=0;i<STEP.products.length;i++){\r\n        if(STEP.products[i].highlight){\r\n          $(\'#pid-\'+STEP.products[i].stripe+\'-0\').attr(\'checked\',\'checked\');\r\n          CHOSEN_ID = $(\'#pid-\'+STEP.products[i].stripe+\'-0\').val();\r\n          $(\'#pid-\'+STEP.products[i].stripe+\'-0\').parent().addClass(\'highlighted\');\r\n          $(\'label[for=\"pid-\'+STEP.products[i].stripe+\'-0\"]\').css(\'display\',\'inline-block\');\r\n          $(\'#pid-\'+STEP.products[i].stripe+\'-0\').css(\'display\',\'inline-block\');\r\n          $(\'#pid-\'+STEP.products[i].stripe+\'-0\').css(\'vertical-align\',\'top\');\r\n          $(\'#pid-\'+STEP.products[i].stripe+\'-0\').css(\'margin-top\',\'18px\');\r\n          var code = \"<span class=\\\'noticeon\\\' style=\\\" display:inline-block; margin-top:-5px; border-radius:4px; font-size:13px; color:white; background-color:red; padding:3px 7px;\\\">BEST SELLER<\\\/span><br style=\\\"margin-bottom:5px;\\\">\\r\\n\";\r\n          code += $(\'label[for=\"pid-\'+STEP.products[i].stripe+\'-0\"]\').html();\r\n          $(\'label[for=\"pid-\'+STEP.products[i].stripe+\'-0\"]\').html(code);\r\n        }\r\n      }\r\n      \/\/CUSTOM CHECKBOX DESIGN\r\n      $(\'input[name=xxprod]\').each(function(index){\r\n        var PARENT = $(this).parent();\r\n        var label = $(\"<label><\/label>\");\r\n        label.addClass(\'radlab\');\r\n        label.html($(this));\r\n        label.append(\'<span class=\"checkmark\"><\/span>\');\r\n        PARENT.prepend(label);\r\n      });\r\n\r\n      checkProd(calculateID());\r\n      \/\/RED NOTICE \r\n      var NOTICE_ON = true;\r\n      setInterval(function(){\r\n        NOTICE_ON = !NOTICE_ON;\r\n        if(NOTICE_ON){\r\n          $(\'.noticeon\').css(\'visibility\',\'visible\');\r\n        }else{\r\n          $(\'.noticeon\').css(\'visibility\',\'hidden\');\r\n        }\r\n      },500);\r\n      \/\/BUMP FUNCTIONALITY\r\n      $(\'[name=xxbump]\').click(function (){\r\n        BUMPS = [];\r\n        if($(this).hasClass(\'bumpButton\')){\r\n          if($(this).attr(\'checked\')){\r\n            $(this).html(\'+ ADD\');\r\n            $(this).removeAttr(\'checked\');\r\n          }else{\r\n            $(this).html(\'ADDED\');\r\n            $(this).attr(\'checked\',\'checked\');\r\n          }\r\n        }\r\n        $(\'[name=xxbump]\').each(function(index){\r\n          if($(this).is(\':checked\') || $(this).attr(\'checked\')){\r\n            BUMPS.push($(this).val());\r\n          }\r\n        });\r\n        checkProd(calculateID());\r\n      });\r\n      \/\/VARIANTS\r\n      $(\'.xxvar\').click(function(){\r\n        $(\'.xxvar\').removeClass(\'varActive\');\r\n        $(this).addClass(\'varActive\');\r\n        var I = $(this).data(\'prod\');\r\n        var J = $(this).data(\'var\');\r\n        $(\"#xxvar\"+I+\'_\'+J).val($(this).html());\r\n      });\r\n      \/\/quantity\r\n      $(\'.xxqm\').click(function(){\r\n        var I = $(this).data(\'prod\');\r\n        if($(\"#pid-\"+STEP.products[I].stripe+\"-0\").data(\'quantity\')){\r\n          var q = $(\"#pid-\"+STEP.products[I].stripe+\"-0\").data(\'quantity\');\r\n        }else{\r\n          var q = 1;\r\n        }\r\n        if(q > 1){\r\n          q--;\r\n        }\r\n        $(\"#pid-\"+STEP.products[I].stripe+\"-0\").data(\'quantity\',q);\r\n        $(\'#xxq\'+I).html(q);\r\n        \/\/\r\n        CHOSEN_ID = $(\'input[name=xxprod]:checked\').val();\r\n        if($(\'input[name=xxprod]:checked\').data(\'quantity\')){\r\n          QUANTITY = $(\'input[name=xxprod]:checked\').data(\'quantity\');\r\n          $(\'input[name=xxprod]:checked\').data(\'price\',STEP.products[I].quantity[QUANTITY-2].price);\r\n        }else{\r\n          QUANTITY = 1;\r\n        }\r\n        checkProd(calculateID());\r\n      });\r\n\r\n      $(\'.xxqp\').click(function(){\r\n        var I = $(this).data(\'prod\');\r\n        if($(\"#pid-\"+STEP.products[I].stripe+\"-0\").data(\'quantity\')){\r\n          var q = $(\"#pid-\"+STEP.products[I].stripe+\"-0\").data(\'quantity\');\r\n        }else{\r\n          var q = 1;\r\n        }\r\n        if(q <= STEP.products[I].quantity.length){\r\n          q++;\r\n        }\r\n        $(\"#pid-\"+STEP.products[I].stripe+\"-0\").data(\'quantity\',q);\r\n        $(\'#xxq\'+I).html(q);\r\n        \/\/\r\n        CHOSEN_ID = $(\'input[name=xxprod]:checked\').val();\r\n        if($(\'input[name=xxprod]:checked\').data(\'quantity\')){\r\n          QUANTITY = $(\'input[name=xxprod]:checked\').data(\'quantity\');\r\n          $(\'input[name=xxprod]:checked\').data(\'price\',STEP.products[I].quantity[QUANTITY-2].price);\r\n        }else{\r\n          QUANTITY = 1;\r\n        }\r\n        checkProd(calculateID());\r\n      });\r\n\r\n      \/\/Actually Appending the PAYMENT METHOD CHOICE FORM\r\n      if(paypalAPP){\r\n        parDOM.prepend(ppBody);\r\n        parDOM.prepend(ppTab);\r\n        parDOM.prepend(ccBody);\r\n        parDOM.prepend(ccTab);\r\n        ccBody.prepend(ccForm);\r\n      }\r\n      \r\n      \/\/FORM SUBMIT\r\n      $(\'#cfAR\').on(\'submit\',function(e){\r\n        e.preventDefault();\r\n        FORM.html(serializeToForm($form.serializeArray()));\r\n        $(\'body\').prepend(FORM);\r\n        FORM.submit();\r\n      });\r\n    \r\n    }else if(STEP.type == \'upsell\' || STEP.type == \'downsell\'){\r\n      \r\n      var $links = [];\r\n\r\n      $(\"a[href*=\'#yes-link\'], .elIMG[data-imagelink*=\'#yes-link\']\").each(function(index, link){\r\n          $link = $(link);\r\n\r\n          if(localStorage.getItem(\'pmethod555\') != \'paypal\'){\r\n            $link.show();\r\n          }else{\r\n            $link.removeAttr(\'data-purchase\');\r\n            $link.removeAttr(\'data-upsell\');\r\n          }\r\n          \r\n      });\r\n      if(localStorage.getItem(\'pmethod555\') != \'paypal\'){\r\n        $(\'.paypal-button\').hide();\r\n      }else{\r\n        $(\'#cfAR\').append(\'<input type=\"hidden\" name=\"purchase[product_id]\" value=\"\'+STEP.products[0].paypal+\'\"><input type=\"hidden\" name=\"upsell\" value=\"1\">\')\r\n      }\r\n\r\n\r\n    }\r\n\r\n    if(currencyAPP){\r\n      $.get(\'https:\/\/ipinfo.io\/?token=87ed38221c7ade\', function(data){\r\n        $.getJSON(HOST+\'\/api\/funnelscript\/getrate?country=MA&currency=USD\',function(data){\r\n          console.log(data);\r\n        });\r\n      });\r\n    }\r\n  }\r\n}\r\n";


        
        res.status(200).type('.js').send(dataContent+fileContent);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.bodyScript = async function (req, res) {
    try {
        const id = req.params.id;

        const funnel_ = await Funnels.findById(id);

        if (!funnel_) return res.status(401).json({message: 'Funnel does not exist'});

        /*var userId = funnel_.userId;
        var user = await User.findById(id);
        var membershipLevel = user.membershipLevel;
        */
        var fileContent;

        /*switch(membershipLevel){
            case 0:
                fileContent = "";
                break;
            case 1:
                fileContent = "";
                break;
            case 2:
                fileContent = "  function getTimeNow(){\r\n    var months = [\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"];\r\n    var days = [\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"];\r\n    var d = new Date();\r\n    var day = days[d.getDay()];\r\n    var hr = d.getHours();\r\n    var min = d.getMinutes();\r\n    if (min < 10) {\r\n        min = \"0\" + min;\r\n    }\r\n    var ampm = \"am\";\r\n    if( hr > 12 ) {\r\n        hr -= 12;\r\n        ampm = \"pm\";\r\n    }\r\n    var date = d.getDate();\r\n    var month = months[d.getMonth()];\r\n    var year = d.getFullYear();\r\n    return hr + \":\" + min + ampm + \" \" + date + \" \" + month + \" \" + year;\r\n  }\r\n\r\n  var pathParts = window.location.pathname.split(\'\/\');\r\n  var endPath = pathParts[pathParts.length-1].trim();\r\n  var VALID = false;\r\n  var STEP;\r\n  for(var i=0;i<STEP_URLS.length;i++){\r\n    if(STEP_URLS[i] == endPath){\r\n      VALID = true;\r\n      STEP = STEPS[i];\r\n      break;\r\n    }\r\n  }\r\n\r\nif(VALID){\r\n\r\n  console.log(STEP);\r\n  if(STEP.type == \'form\'){  \/\/ORDER FORM\r\n\r\n\r\n    \/\/change name and remove paypal products from checkout (form)\r\n    for(var i=0;i<STEP.products.length;i++){\r\n      \r\n      var PARENT_ = $(\'#pid-\'+STEP.products[i].paypal+\'-0\').parent().parent();\r\n      PARENT_.remove();\r\n\r\n      if(STEP.products[i].hidden){\r\n        $(\'#pid-\'+STEP.products[i].stripe+\'-0\').parent().parent().remove();\r\n        $(\'#pid-\'+STEP.products[i].paypal+\'-0\').parent().parent().remove();\r\n      }else{\r\n\r\n        if(STEP.products[i].bump){\r\n          $(\'#pid-\'+STEP.products[i].stripe+\'-0\').parent().parent().remove();\r\n        }\r\n        $(\'#pid-\'+STEP.products[i].stripe+\'-0\').attr(\'name\',\'xxprod\');\r\n        \r\n        \/\/QUANTITY\r\n        if(STEP.products[i].quantity){\r\n          if(STEP.products[i].quantity.length > 0){\r\n            for(var j=0;j<STEP.products[i].quantity.length;j++){\r\n                $(\'#pid-\'+STEP.products[i].quantity[j].stripe+\'-0\').parent().parent().remove();\r\n                $(\'#pid-\'+STEP.products[i].quantity[j].paypal+\'-0\').parent().parent().remove();\r\n            }\r\n            if(STEP.products[i].quantityApp){\r\n              var HTML = \"<div class=\'qtybox\'><span class=\'xxqm\' data-prod=\"+i+\"><i class=\'fas fa-minus\'><\/i><\/span><span class=\'xxquantity\' id=\'xxq\"+i+\"\' data-prod=\"+i+\">1<\/span><span class=\'xxqp\' data-prod=\"+i+\"><i class=\'fas fa-plus\'><\/i><\/span><\/div>\";\r\n              $(\'#pid-\'+STEP.products[i].stripe+\'-0\').parent().append(HTML);\r\n            }\r\n          }\r\n        }\r\n        \/\/VARIANTS\r\n        if(STEP.products[i].variantsApp){\r\n          if(STEP.products[i].variants.length > 0){\r\n            for(var j=0;j<STEP.products[i].variants.length;j++){\r\n              var HTML = $(\'#cfAR\').html();\r\n              var _name = STEP.products[i].title + \'_\' + STEP.products[i].variants[j].title + \'_\' + getTimeNow();\r\n              HTML += \'<input type=\"hidden\" id=\"xxvar\'+i+\'_\'+j+\'\" name=\"\'+_name+\'\" value=\"\">\';\r\n              $(\'#cfAR\').html(HTML);\r\n\r\n              var HTML2 = \"<div class=\'varibox\'><span class=\'varilabel\'>\"+STEP.products[i].variants[j].title+\" :<\/span>\";\r\n              for(var k=0;k<STEP.products[i].variants[j].options.length;k++){\r\n                HTML2 += \"<span class=\'xxvar\' data-prod=\"+i+\" data-var=\"+j+\" >\"+STEP.products[i].variants[j].options[k]+\"<\/span>\";\r\n              }\r\n              HTML2 += \"<\/div>\";\r\n              $(\'#pid-\'+STEP.products[i].stripe+\'-0\').parent().append(HTML2);\r\n            }\r\n          }\r\n        }\r\n\r\n      }\r\n\r\n    }\r\n\r\n    $(\'.elOrderProductOptions.elProductOptionsBox input[name=\"purchase[product_id]\"]\').parent().parent().remove();\r\n    \/\/change button and credit card form\r\n    var cForm = $(\'.elCreditCard\');\r\n        var bButton = $(\"a[href=\'#submit-form\'], a[href=\'#submit-form-2step-order\']\");\r\n        var formClone = cForm.clone();\r\n        \r\n        var cPrevious = cForm.prev();\r\n\r\n         $(function(){\r\n            console.log(cPrevious);\r\n            console.log(formClone);\r\n          cPrevious.after(formClone);\r\n            bButton.show();\r\n         });\r\n    \r\n  }else if(STEP.type == \'upsell\' || STEP.type == \'downsell\'){\r\n    console.log(\'upselll\');\r\n  }\r\n    \r\n  \r\n\r\n}";
                break;
            default:
                fileContent = "";
                break;
        }*/
        fileContent = "  function getTimeNow(){\r\n    var months = [\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"];\r\n    var days = [\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"];\r\n    var d = new Date();\r\n    var day = days[d.getDay()];\r\n    var hr = d.getHours();\r\n    var min = d.getMinutes();\r\n    if (min < 10) {\r\n        min = \"0\" + min;\r\n    }\r\n    var ampm = \"am\";\r\n    if( hr > 12 ) {\r\n        hr -= 12;\r\n        ampm = \"pm\";\r\n    }\r\n    var date = d.getDate();\r\n    var month = months[d.getMonth()];\r\n    var year = d.getFullYear();\r\n    return hr + \":\" + min + ampm + \" \" + date + \" \" + month + \" \" + year;\r\n  }\r\n\r\n  var pathParts = window.location.pathname.split(\'\/\');\r\n  var endPath = pathParts[pathParts.length-1].trim();\r\n  var VALID = false;\r\n  var STEP;\r\n  for(var i=0;i<STEP_URLS.length;i++){\r\n    if(STEP_URLS[i] == endPath){\r\n      VALID = true;\r\n      STEP = STEPS[i];\r\n      break;\r\n    }\r\n  }\r\n\r\nif(VALID){\r\n\r\n  console.log(STEP);\r\n  if(STEP.type == \'form\'){  \/\/ORDER FORM\r\n\r\n\r\n    \/\/change name and remove paypal products from checkout (form)\r\n    for(var i=0;i<STEP.products.length;i++){\r\n      \r\n      var PARENT_ = $(\'#pid-\'+STEP.products[i].paypal+\'-0\').parent().parent();\r\n      PARENT_.remove();\r\n\r\n      if(STEP.products[i].hidden){\r\n        $(\'#pid-\'+STEP.products[i].stripe+\'-0\').parent().parent().remove();\r\n        $(\'#pid-\'+STEP.products[i].paypal+\'-0\').parent().parent().remove();\r\n      }else{\r\n\r\n        if(STEP.products[i].bump){\r\n          $(\'#pid-\'+STEP.products[i].stripe+\'-0\').parent().parent().remove();\r\n        }\r\n        $(\'#pid-\'+STEP.products[i].stripe+\'-0\').attr(\'name\',\'xxprod\');\r\n        \r\n        \/\/QUANTITY\r\n        if(STEP.products[i].quantity){\r\n          if(STEP.products[i].quantity.length > 0){\r\n            for(var j=0;j<STEP.products[i].quantity.length;j++){\r\n                $(\'#pid-\'+STEP.products[i].quantity[j].stripe+\'-0\').parent().parent().remove();\r\n                $(\'#pid-\'+STEP.products[i].quantity[j].paypal+\'-0\').parent().parent().remove();\r\n            }\r\n            if(STEP.products[i].quantityApp){\r\n              var HTML = \"<div class=\'qtybox\'><span class=\'xxqm\' data-prod=\"+i+\"><i class=\'fas fa-minus\'><\/i><\/span><span class=\'xxquantity\' id=\'xxq\"+i+\"\' data-prod=\"+i+\">1<\/span><span class=\'xxqp\' data-prod=\"+i+\"><i class=\'fas fa-plus\'><\/i><\/span><\/div>\";\r\n              $(\'#pid-\'+STEP.products[i].stripe+\'-0\').parent().append(HTML);\r\n            }\r\n          }\r\n        }\r\n        \/\/VARIANTS\r\n        if(STEP.products[i].variantsApp){\r\n          if(STEP.products[i].variants.length > 0){\r\n            for(var j=0;j<STEP.products[i].variants.length;j++){\r\n              var HTML = $(\'#cfAR\').html();\r\n              var _name = STEP.products[i].title + \'_\' + STEP.products[i].variants[j].title + \'_\' + getTimeNow();\r\n              HTML += \'<input type=\"hidden\" id=\"xxvar\'+i+\'_\'+j+\'\" name=\"\'+_name+\'\" value=\"\">\';\r\n              $(\'#cfAR\').html(HTML);\r\n\r\n              var HTML2 = \"<div class=\'varibox\'><span class=\'varilabel\'>\"+STEP.products[i].variants[j].title+\" :<\/span>\";\r\n              for(var k=0;k<STEP.products[i].variants[j].options.length;k++){\r\n                HTML2 += \"<span class=\'xxvar\' data-prod=\"+i+\" data-var=\"+j+\" >\"+STEP.products[i].variants[j].options[k]+\"<\/span>\";\r\n              }\r\n              HTML2 += \"<\/div>\";\r\n              $(\'#pid-\'+STEP.products[i].stripe+\'-0\').parent().append(HTML2);\r\n            }\r\n          }\r\n        }\r\n\r\n      }\r\n\r\n    }\r\n\r\n    $(\'.elOrderProductOptions.elProductOptionsBox input[name=\"purchase[product_id]\"]\').parent().parent().remove();\r\n    \/\/change button and credit card form\r\n    var cForm = $(\'.elCreditCard\');\r\n        var bButton = $(\"a[href=\'#submit-form\'], a[href=\'#submit-form-2step-order\']\");\r\n        var formClone = cForm.clone();\r\n        \r\n        var cPrevious = cForm.prev();\r\n\r\n         $(function(){\r\n            console.log(cPrevious);\r\n            console.log(formClone);\r\n          cPrevious.after(formClone);\r\n            bButton.show();\r\n         });\r\n    \r\n  }else if(STEP.type == \'upsell\' || STEP.type == \'downsell\'){\r\n    console.log(\'upselll\');\r\n  }\r\n    \r\n  \r\n\r\n}";
                
        
        res.status(200).type('.js').send(fileContent);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.getRate = async function(req,res){
    try {
        var currency = req.query.currency;
        var country = req.query.country;

        //Get currency from country
        var currency2 = cc.getParamByISO(country, 'currency')
        var code;
        //request pair rate
        var URL = 'https://apilayer.net/api/live?access_key=3f4042d074864f92553c4c75601f2fbd&currencies='+currency2+'&source='+currency+'&format=1';
        
        await request(URL, { json: true }, (err, resp, body) => {
            if (err) { return console.log(err); }
            code = body.quotes[currency+currency2];
            return res.status(200).type('.txt').send(code);
        });

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.portal = async function (req, res) {
    try {
        if(!req.session['token']){
            return res.redirect('/');
        }
        //get user membership level
        const id = req.session['user_id']
        const user = await User.findById(id);

        var membershipLevel = user.membershipLevel;

        //switch
        switch(membershipLevel){
            case 0:
                return res.render('portal0.ejs',{id:req.params.id});
                break;
            case 1:
                return res.render('portal1.ejs',{id:req.params.id});
                break;
            case 2:
                return res.render('portal.ejs',{id:req.params.id});
                break;
            default:
                return res.render('portal0.ejs',{id:req.params.id});
                break;
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
/*
exports.updateFunnel = async (req, res)=>{
	try {
		const {id} = req.body;
        const {steps} = req.body;

        var map_ = await Maps.findById(id);
        map_.map = map;
        await map_.save();

        res.status(200).json(map_);

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}
*/
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const funnel_ = await Funnels.findById(id);

        if (!funnel_) return res.status(401).json({message: 'Funnel does not exist'});
        if (req.session['user_id'].toString() !== funnel_.userId.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        res.status(200).json({funnel_});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;

        const funnel_ = await Funnels.findById(id);

        if (!funnel_) return res.status(401).json({message: 'Funnel does not exist'});
        if (req.session['user_id'].toString() !== funnel_.userId.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

       	await Funnels.findByIdAndDelete(id);
        res.status(200).json({message: 'Funnel has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};