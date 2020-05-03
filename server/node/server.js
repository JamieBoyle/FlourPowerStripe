const express = require("express");
const app = express();
const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


var fs = require('fs');  // using for logging transactions

app.use(express.static(process.env.STATIC_DIR));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);


/*
app.get("/checkout", (req, res) => {
  // Display checkout page
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

*/

app.post("/testpost", async (req, res) => {
  console.log("got "+ req.body);
  res.send("mouse "+req.rawBody+ " I was hoping would be useful");

});

app.post('/testpost2', function(request, response){
  console.log(request.body);      // your JSON
  response.send(request.body);    // echo the result back
});


app.get("/testget", async (req, res) => {
  res.send("mouse");

});

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client

  //Amount must be in cents (not dollars)
  productsPrices = {
    1:1199,
    2:1199
  }
  var orderTotal=0;
  items.forEach(a => {
    if(a in productsPrices) {
      orderTotal += productsPrices[a];
    }
    else {
      console.log("got bad item "+a);
      
    }
  });



  return orderTotal;
};

app.post("/secret", async (req, res) => { //this was called create-payment-intent or sthg, matching the example / tutorial
  console.log("processing /secret")
  const { items, currency } = req.body;
  // Create a PaymentIntent with the order amount and currency
  console.log("currency: "+currency);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: currency,
    metadata: {integration_check: 'accept_a_payment'}, //This is only for debugging
  });

  // Send publishable key and PaymentIntent details to client
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    clientSecret: paymentIntent.client_secret,

    // TODO: remove - just for debugging.  It's for verifying the payments as per https://stripe.com/docs/payments/accept-a-payment#web-create-payment-intent
    metadata: {integration_check: 'accept_a_payment'},
  });
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
app.post("/webhook", async (req, res) => {
  let data, eventType;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    
    var paymentMessage = "Payment captured for id "+data.object.id+" value "+ data.object.amount + " "+  data.object.currency;
    console.log(paymentMessage);
    fs.appendFile(process.env.TRANSACTION_LOG_FILE, paymentMessage + "\n", function (err, file) {
      if (err) throw err;
      console.log('Saved!');
    });
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
  }
  res.sendStatus(200);
});










app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
