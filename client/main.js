Template.main.events({
  "submit Payment": function(event) {
    //event.preventDefault();
    //pay();
  }
});

Template.main.onRendered(function() {
  Meteor.call('getClientToken', function(err, token) {
    console.log('set session');
    Session.set('btClientToken', null);
    console.log('btClientToken defined');

    if (err) {
      notifyError(err.reason);
    } else {
      Session.set('btClientToken', token);

      console.log('token set ', token);
    }

    braintree.setup(token, 'dropin', {
      container: 'dropin-container',
      form: 'Payment',
      paypal: {
        button: {
          type: 'checkout'
        },
        singleUse: true,
        amount: $('#Amount').val(),
        currency: 'AUD'
      },
      onPaymentMethodReceived: function(obj) {
        console.log("Start Payment Method Received");
        console.log(obj);

        var data = {
          amount: 4.11,
          nonce: obj.nonce
        };

        Meteor.call('createTransaction', data, function(err,
          result) {
          console.log("Payment in progress");
          console.log(result);
          Session.set('paymentInProgress', null);
          //      Router.go('paymentConfirm');
        });
      }
    });

  });
});
