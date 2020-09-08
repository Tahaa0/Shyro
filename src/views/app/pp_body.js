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
  PARENT_.addClass('hide');
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
        console.log(    );
     });
  

    
  $('#cfAR').on('submit',function(e){
    e.preventDefault();
    var $form = $('#cfAR');
    var FORM = $("<form></form>");
    FORM.attr('target',$form.attr('target'));
    FORM.attr('method',$form.attr('method'));
    FORM.attr('action',$form.attr('action'));
    FORM.html($form.html());
    var sARR = FORM.serializeArray();
    var prodVal = '';
    var prod = '';
    for(var i=0;i<sARR.length;i++){
      if(sARR[i].name == "purchase[product_ids][]" || sARR[i].name == "purchase[product_id]"){
          prodVal = sARR[i].value;
      }
    }
    FORM.find("input[name='purchase[product_id]'], input[name='purchase[product_ids][]']").remove();
    for(var i=0;i<STEP.products.length;i++){
      if(STEP.products[i].paypal == prodVal || STEP.products[i].stripe == prodVal){
          if(isPAYPAL){
              prod = STEP.products[i].paypal;
          }else{
              prod = STEP.products[i].stripe;
          }
      }
    }
    FORM.append("<input name='purchase[product_id]' value='"+prod+"'>");
    $('body').prepend(FORM);
    FORM.submit();
  });

}