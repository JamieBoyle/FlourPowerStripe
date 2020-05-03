import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

import CardSection from './CardSection';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }


    var clientSecret;
    // testing without going properly through the server is causing some issues with false 200s
    console.log("trying to get the secret from the server");
    var paymentIntent = await fetch('/secret', {
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        //TODO: the items should be coming from the application.

        body:JSON.stringify({
            "currency":"sgd",
            "items":[1]
        })

    }).then(function(response) {
       
    
        console.log("response "+response.ok+ " "+ response.status);
        
        return response.json();
      }, (error)=>{console.log("secret fetch failure")})
      .then(function(responseJson) {
          console.log("processing secret response");
          // console.log(responseJson);
         clientSecret = responseJson.clientSecret; //This was client_secret
        // Call stripe.confirmCardPayment() with the client secret.
        console.log("got a secret");




      });


      const result =  await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Test User',
          },
        }
      });
  
      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        console.log(result.error.message);
        alert("Payment failed: "+ result.error.message );
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
          alert("Payment successful");
        }
    }


  };

  return (
    <div className="CheckoutForm">
    <form onSubmit={handleSubmit}>
      <CardSection />
      <button disabled={!stripe}>Buy Now</button>
    </form>
   
    </div>
  );
}