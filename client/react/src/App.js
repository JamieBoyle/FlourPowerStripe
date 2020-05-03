import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CheckoutForm from './CheckoutForm';

//TODO: load the products from the server


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_A0WApnZwBIN7PU3vH4kqxl1u00rJuOk9oV");

function loadProducts() {
  console.log("Implement server side product selection");

}

function App() {
  {loadProducts()}

  return (
    
    <div className="App">
      <h1>Welcome to FlourPower</h1>
      <h2>Authentic artisan bread flour made from real wheat</h2>
 
      <ProductCard productName="White Flour"
        productDescription="Perfect flour when you want that beautiful whiteness"
        price="$11.99"
        productId="1"
      ></ProductCard>


  {/*
  // skipping this as short on time so just showing one product
  <ProductCard productName="Brown Flour"
        productDescription="A darker colour - perfect for midnight snacks"
        price="$11.99"
        productId="2"
  />*/}

      <div>
{/*TODO: make this conditional on actually purchasing etc, but want to see it work.*/}
        <StripeCheckout />

      </div>

    </div>
    
  );
}

class ProductCard extends React.Component {
   purchaseProduct = (productId)=> {
    alert("buying isn't implemented yet");

  }



  render(){
    return (
      <div className="product-card">
        <h3>{this.props.productName}</h3>
        
        <div className="product-description">
          {this.props.productDescription}
        </div>
        <div className="price">
          {this.props.price}

        </div>
        {/* // skipping this as short on time, and moving to one product
         <button className="buy-button"
          onClick={() => 
              {this.purchaseProduct(this.props.productId);}
            }
          >BUY NOW</button> */}
      </div>


    )

  }


}


class StripeCheckout extends React.Component {
  getClientSecret = () => {
    var response = fetch('/secret').then(function(response) {
      return response.json();
    }).then(function(responseJson) {
      var clientSecret = responseJson.client_secret;
      // Call stripe.confirmCardPayment() with the client secret.
    });
  }

  render() {
    return (
    <div id="checkoutForm" className="checkout-form">

    
      <Elements stripe={stripePromise}> {/* in the example this is in index for some reason*/}
        <CheckoutForm />
      </Elements>
    </div>);
  }

}

export default App;
