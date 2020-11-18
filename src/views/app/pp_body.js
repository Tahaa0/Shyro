  function getTimeNow(){  //Function to Format Now's DATETIME (Used to store variants in CF)
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

  //STEP URLS TO GET THEM

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

if(VALID){ //IF THIS IS A STEP

  console.log(STEP);
  if(STEP.type == 'form'){  //ORDER FORM


    //change name and remove paypal products from checkout (form)
    for(var i=0;i<STEP.products.length;i++){
      
      //REMOVE  paypal products
      var PARENT_ = $('#pid-'+STEP.products[i].paypal+'-0').parent().parent();
      PARENT_.remove();


      if(STEP.products[i].hidden){ //REMOVE HIDDEN PRODUCTS
        $('#pid-'+STEP.products[i].stripe+'-0').parent().parent().remove();
        $('#pid-'+STEP.products[i].paypal+'-0').parent().parent().remove();
      }else{

        if(STEP.products[i].bump){ //REMOVE IT IF It's an order bump
          $('#pid-'+STEP.products[i].stripe+'-0').parent().parent().remove();
        }
        $('#pid-'+STEP.products[i].stripe+'-0').attr('name','xxprod'); //ADD ATTRIBUTE XXPROD TO the product (stripe)
        $('#pid-'+STEP.products[i].stripe+'-0').data('price',STEP.products[i].price);  //SET DATA PRICE
        //QUANTITY
        if(STEP.products[i].quantity){
          if(STEP.products[i].quantity.length > 0){
            //REMOVE Quantity Product (pp & stripe)
            for(var j=0;j<STEP.products[i].quantity.length;j++){
                $('#pid-'+STEP.products[i].quantity[j].stripe+'-0').parent().parent().remove();
                $('#pid-'+STEP.products[i].quantity[j].paypal+'-0').parent().parent().remove();
            }
            if(STEP.products[i].quantityApp){ //IF QTY is ACTIVE display
              var HTML = "<div class='qtybox'><span class='xxqm' data-prod="+i+"><i class='fas fa-minus'></i></span><span class='xxquantity' id='xxq"+i+"' data-prod="+i+">1</span><span class='xxqp' data-prod="+i+"><i class='fas fa-plus'></i></span></div>";
              $('#pid-'+STEP.products[i].stripe+'-0').parent().append(HTML);
            }
          }
        }
        //VARIANTS
        if(STEP.products[i].variantsApp){
          if(STEP.products[i].variants.length > 0){
            for(var j=0;j<STEP.products[i].variants.length;j++){
              //ADD VARIANT FIELD in #cfAR
              var HTML = $('#cfAR').html();
              var _name = STEP.products[i].title + '_' + STEP.products[i].variants[j].title + '_' + getTimeNow();
              HTML += '<input type="hidden" id="xxvar'+i+'_'+j+'" name="'+_name+'" value="">';
              $('#cfAR').html(HTML);
              //ADD VARIANT SELECT
              var HTML2 = "<div class='varibox'><span class='varilabel'>"+STEP.products[i].variants[j].title+" :</span>";
              for(var k=0;k<STEP.products[i].variants[j].options.length;k++){
                HTML2 += "<span class='xxvar' data-prod="+i+" data-var="+j+" >"+STEP.products[i].variants[j].options[k]+"</span>";
              }
              HTML2 += "</div>";
              $('#pid-'+STEP.products[i].stripe+'-0').parent().append(HTML2);
            }
          }
        }

      }

    }

    $('.elOrderProductOptions.elProductOptionsBox input[name="purchase[product_id]"]').parent().parent().remove();
    //change button and credit card form
    var cForm = $('.elCreditCard');
        var bButton = $("a[href='#submit-form'], a[href='#submit-form-2step-order']");
        var formClone = cForm.clone(); //clone credit card form
        
        var cPrevious = cForm.prev();
          //THIS happens after load and shows stripe button and the new form
         $(function(){
            console.log(cPrevious);
            console.log(formClone);
          cPrevious.after(formClone);
            bButton.show();
         });
    
  }else if(STEP.type == 'upsell' || STEP.type == 'downsell'){
    console.log('upselll');
  }
    
  

}