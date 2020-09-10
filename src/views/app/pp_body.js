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

for(var i=0;i<STEP.products.length;i++){
  var PARENT_ = $('#pid-'+STEP.products[i].paypal+'-0').parent().parent()
  console.log(PARENT_);
  PARENT_.remove();
  $('#pid-'+STEP.products[i].stripe+'-0').attr('name','xxprod');
}



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
  

    
  

}