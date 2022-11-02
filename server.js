const express = require("express");
var cors = require('cors')
const app = express();
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require("stripe")('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

app.use(express.static("public"));
app.use(express.json());
app.use(cors())

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};
app.get("/", async (req, res) => {
  res.send("Hello");
});

app.post("/create-payment-intent", async (req, res) => {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-08-01'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
      payment_method_types: [
      'bancontact',
      'card',
      'eps',
      'giropay',
      'ideal',
      'p24',
      'sepa_debit',
      'sofort',
    ],
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx'
  });
  // const { items } = req.body;
  // const customer = await stripe.customers.create();

  // // Create a PaymentIntent with the order amount and currency
  // const paymentIntent = await stripe.paymentIntents.create({
  //   customer: customer.id,
  //   currency: 'EUR',
  //   amount: 1999,
  //   // automatic_payment_methods: { enabled: true },
  //   // payment_method_types: ['card', 'afterpay_clearpay', ''],
  //   payment_method_types: [
  //     'bancontact',
  //     'card',
  //     'eps',
  //     'giropay',
  //     'ideal',
  //     'p24',
  //     'sepa_debit',
  //     'sofort',
  //   ],
  //   // billing_address_collection: 'required'
  // });

  // res.send({
  //   clientSecret: paymentIntent.client_secret,
  // });
});

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});