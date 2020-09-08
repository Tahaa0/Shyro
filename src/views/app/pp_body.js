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
  

    
  $('#cfAR').on('submit',function(e){
    e.preventDefault();
    var $form = $('#cfAR');
    var FORM = $("<form></form>");
    FORM.attr('target',$form.attr('target'));
    FORM.attr('method',$form.attr('method'));
    FORM.attr('action',$form.attr('action'));
    FORM.html($form.html());
    $('body').prepend(FORM);
    FORM.submit();
  });