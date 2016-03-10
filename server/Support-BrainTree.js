  // Define gateway variable
  var gateway;
  Meteor.startup(function() {
    var env;
    // Pick Braintree environment based on environment defined in Meteor settings.
    env = Braintree.Environment.Sandbox;

    // Initialize Braintree connection:
    gateway = BrainTreeConnect({
      environment: env,
      publicKey: "publickey",
      privateKey: "privatekey",
      merchantId: "merchantid"
    });
  });

  Meteor.methods({
    getClientToken: function(clientId) {
      var generateToken = Meteor.wrapAsync(gateway.clientToken.generate,
        gateway.clientToken);
      var options = {};

      if (clientId) {
        options.clientId = clientId;
      }

      var response = generateToken(options);

      return response.clientToken;
    },

    createTransaction: function(data) {
      var transaction = Meteor.wrapAsync(gateway.transaction.sale,
        gateway.transaction);

      var response = transaction({
        amount: data.amount,
        paymentMethodNonce: data.nonce
      });

      return response;
    }
  });
