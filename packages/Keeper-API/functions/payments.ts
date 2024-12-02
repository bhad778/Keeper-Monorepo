// import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
// import Stripe from 'stripe';

// import connectToDatabase from '../db';
// import Joi = require('joi');
// import ValidateBody from './validateBody';

// const stripe = new Stripe(
//   'sk_test_51NVCzvK8qF18Gnn7AffswQdufYkdul86TOsEZCKRGtZwJMwYYnJxHh09UAfJPUc7hAExNPnYQFsKJgW1lqv1SBIg00F4WCWCvn',
//   {
//     apiVersion: '2022-11-15',
//   }
// );

// module.exports.paymentSheet = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const paymentSheetSchema = Joi.object({
//     customerId: Joi.string(),
//   });

//   const isError = ValidateBody(event, paymentSheetSchema, callback);

//   if (isError) return;

//   const body = JSON.parse(event.body);

//   connectToDatabase().then(async () => {
//     try {
//       // Use an existing Customer ID if this is a returning customer.
//       let customer;
//       if (body.customerId) {
//         customer = await stripe.customers.retrieve(body.customerId);
//       }
//       customer = await stripe.customers.create();
//       const ephemeralKey = await stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: '2022-11-15' });
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: 1099,
//         currency: 'usd',
//         customer: customer.id,
//         automatic_payment_methods: {
//           enabled: true,
//         },
//       });
//       callback(null, {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify({
//           paymentIntent: paymentIntent.client_secret,
//           ephemeralKey: ephemeralKey.secret,
//           customer: customer.id,
//           publishableKey:
//             'pk_test_51NVCzvK8qF18Gnn7xxGZuU3QTFIBvGjAQX6ikcKf6SRKrIcR9IkKYWnjvUuTQnye8i7h66aeN3GDBoQGyMZOlHHN005bfiIRkl',
//         }),
//       });
//     } catch (err) {
//       console.warn('paymentSheet api call error: ', err);
//       callback(new Error(err));
//     }
//   });
// };
