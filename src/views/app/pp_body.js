  function getTimeNow(){
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d = new Date();
    var day = days[d.getDay()];
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = "am";
    if( hr > 12 ) {
        hr -= 12;
        ampm = "pm";
    }
    var date = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();
    return hr + ":" + min + ampm + " " + date + " " + month + " " + year;
  }

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
  if(STEP.type == 'form'){


    //change name and remove paypal products from checkout (form)
    for(var i=0;i<STEP.products.length;i++){
      var PARENT_ = $('#pid-'+STEP.products[i].paypal+'-0').parent().parent()
      if(STEP.products[i].bump){
        $('#pid-'+STEP.products[i].stripe+'-0').parent().parent().remove();
      }
      PARENT_.remove();
      $('#pid-'+STEP.products[i].stripe+'-0').attr('name','xxprod');
      if(STEP.products[i].variants){
        if(STEP.products[i].variants.length > 0){
          for(var j=0;j<STEP.products[i].variants.length;j++){
            var HTML = $('#cfAR').html();
            var _name = STEP.products[i].title + '_' + STEP.products[i].variants[j].title + '_' + getTimeNow();
            HTML += '<input type="hidden" id="xxvar'+i+'_'+j+'" name="'+_name+'" value="">';
            $('#cfAR').html(HTML);
          }
        }
      }
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
    
  }else if(STEP.type == 'upsell'){
    console.log('upselll');
  }
    
  

}