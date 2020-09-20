  var pathParts = window.location.pathname.split('/');
  var endPath = pathParts[pathParts.length-1].trim();
  var VALID = false;
  var STEP;
  for(var i=0;i<STEP_URLS.length;i++){
    if(STEP_URLS[i] == endPath){
      VALID = true;
      STEP = STEPS[i];
      break;
    }
  }

if(VALID){

  console.log(STEP);
  if(STEP.type = 'form'){


    //change name and remove paypal products from checkout (form)
    for(var i=0;i<STEP.products.length;i++){
      var PARENT_ = $('#pid-'+STEP.products[i].paypal+'-0').parent().parent()
      if(STEP.products[i].bump){
        $('#pid-'+STEP.products[i].stripe+'-0').parent().parent().remove();
      }
      PARENT_.remove();
      $('#pid-'+STEP.products[i].stripe+'-0').attr('name','xxprod');
    }


    //change button and credit card form
    var cForm = $('.elCreditCard');
        var bButton = $("a[href='#submit-form'], a[href='#submit-form-2step-order']");
        var formClone = cForm.clone();
        
        var cPrevious = cForm.prev();

         $(function(){
            console.log(cPrevious);
            console.log(formClone);
          cPrevious.after(formClone);
            bButton.show();
         });
    
  }else if(STEP.type = 'upsell'){
    console.log('upselll');
  }
    
  

}