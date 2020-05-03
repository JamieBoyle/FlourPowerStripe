# FlourPower Online Shop

## Background

This is a super basic website to demonstrate Stripe payments integrations working on something that resembles an e-commerce store.

It is comprises:
* A react frontend 
* A node / express backend

The frontend is based off https://github.com/facebook/create-react-app 


And it was created while following https://stripe.com/docs/payments/accept-a-payment, plus https://stripe.com/docs/payments/handling-payment-events#build-your-own-webhook,  and these gives suggestions for testing.

https://github.com/stripe-samples/react-elements-card-payment was also used in its development.



## Getting Started

### Requirements

* node
* npm
* a stripe account and test keys (see stripe links above)

While it should run on multiple platforms, it has only been tested on Windows 10.

### Configuration

The main configuration is in `./server/node/.env` where you can set up your stripe keys.

It also allows you to set the transaction log file location where a history of payments are stored.

### Building the frontend
```
>> cd ./client/
>> npm install
>> npm run-script build
```


### Setting up the server

```
>> npm install
>> npm run

```


### View in your browser

It should now appear on https://localhost:4242



## Testing

You should be presented with a very basic site with some details about the product and the ability to pay.

The simplest test card for checkout is with 4242 4242 4242 4242 (with the other fields being flexible).


If you want to test the webhooks and log of transactions, then you should follow the installation and running steps as per https://stripe.com/docs/payments/handling-payment-events.  In summary:

```
1) install the stripe command line tool.

>> stripe login

>> stripe listen --forward-to http://localhost:4242/webhook
```

then in a different terminal you can trigger an event 

```
>> stripe trigger payment_intent.succeeded

```

You should then be able to see the events both in the server log and in the listen console.

## Known Limitations

* A better version would include better handling of multiple languages and currencies.  Stripe provides some such examples.
* The shop is pretty bad - you can't select different products, the products are hardcoded on the frontend (even if prices are done independently on the backend), and it's all very visibly one page.
