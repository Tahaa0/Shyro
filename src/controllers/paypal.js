const request = require('request');

var CLIENT =
  'AVakVQOQBs9z-SvHoHnqyxHkp4uRw3IZ3fvC2dojfTs3hvE3Di1DrHijrvn20A393M_QNLt16jerb2BS';
var SECRET =
  'EEw6ZPdOMgYBk0QbJGQ-WLTZqcbefysjMi7v1nN8BWXrCooad-8CabH6PMLJt3Gnl-lCglRug_5yHYoU';
var PAYPAL_API = 'https://api-m.sandbox.paypal.com';

exports.createPayment = async function(req,res){
    try{
        request.post(PAYPAL_API+'/v1/payments/payment',
            {
              auth:
              {
                user: CLIENT,
                pass: SECRET
              },
              body:
              {
                intent: 'sale',
                payer:
                {
                  payment_method: 'paypal'
                },
                transactions: [
                {
                  amount:
                  {
                    total: '5.99',
                    currency: 'USD'
                  }
                }],
                redirect_urls:
                {
                  return_url: 'https://example.com',
                  cancel_url: 'https://example.com'
                }
              },
              json: true
            }, function(err, response)
            {
              if (err)
              {
                console.error(err);
                return res.sendStatus(500);
              }
              // 3. Return the payment ID to the client
              res.json(
              {
                id: response.body.id
              });
            });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
    
exports.executePayment = async function(req,res){
    try{
        var paymentID = req.body.paymentID;
        var payerID = req.body.payerID;
        // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
        request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
          '/execute',
          {
            auth:
            {
              user: CLIENT,
              pass: SECRET
            },
            body:
            {
              payer_id: payerID,
              transactions: [
              {
                amount:
                {
                  total: '10.99',
                  currency: 'USD'
                }
              }]
            },
            json: true
          },
          function(err, response)
          {
            if (err)
            {
              console.error(err);
              return res.sendStatus(500);
            }
            // 4. Return a success response to the client
            res.json(
            {
              status: 'success'
            });
          });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
