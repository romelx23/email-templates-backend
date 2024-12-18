const express = require('express');
const { models } = require('../db/sequelize');
const { config } = require('../config/config');
// const { MercadoPagoConfig, Payment }=require('mercadopago');
const mercadopago = require('mercadopago');
const { validateJWT } = require('../middlewares/jwt.handler');
const router = express.Router();

// const client =new MercadoPagoConfig({
//   accessToken: config.mp_access_token,
// });
// const client =mercadopago.configure({
//   accessToken: config.mp_access_token,
// });

router.post('/create-payment', validateJWT, async (req, res, next) => {
  // const payment = new Payment(client);
  mercadopago.configure({
    access_token: config.mp_access_token,
  });
  try {
    const { amount, tokenReward, planId, planType, paymentMethodId } = req.body;

    const userId = req.user.sub;

    console.log({
      userId,
      amount,
      tokenReward,
      planId,
      planType,
      paymentMethodId,
    });

    // Generar preferencia de pago
    const preference = {
      items: [
        {
          title: 'Compra de tokens',
          description: planType,
          unit_price: parseFloat(amount),
          currency_id:"PEN",
          quantity: 1,
        },
      ],
      // payer: {
      //   email: "test_user_835859355@testuser.com",
      // },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/success`,
        failure: `${process.env.FRONTEND_URL}/failure`,
        pending: `${process.env.FRONTEND_URL}/pending`,
      },
      notification_url: `${config.notification_url}/api/v1/mp/webhook`,
      // auto_return: 'approved',
      // binary_mode: true,
      metadata: {
        userId,
        tokenReward,
        planId,
      },
      // payment_methods: {
      //   excluded_payment_methods: [
      //     {
      //       id: 'amex',
      //     },
      //   ],
      //   excluded_payment_types: [
      //     {
      //       id: 'atm',
      //     },
      //   ],
      //   installments: 6,
      // },
    };

    // const response = await payment.create({
    //   body: preference,
    // });
    const response = await mercadopago.preferences.create(preference);
    console.log({ response });
    res
      .status(200)
      .json({ body: response.body, init_point: response.body.init_point });
  } catch (error) {
    next(error);
  }
});

// router.post('/webhook', async (req, res, next) => {
//   // const payment = new Payment(client);
//   console.log('webhook');
//   mercadopago.configure({
//     access_token: config.mp_access_token,
//   });
//   try {
//     // console.log(req.body);
//     const payment = req.query;

//     if(payment.type !== 'payment'){
//       console.log('No es un pago', payment);
//       return res.status(200).send('OK');
//     }

//     const paymentId = req.query['data.id'];
//     console.log('query', req.query);
//     console.log('body', req.body);

//     console.log({ paymentId });

//     // Obtiene detalles del pago
//     const response = await mercadopago.payment.findById(paymentId);
//     const { metadata } = response.body;

//     if (response.body.status === 'approved') {
//       // Registrar el pago en la base de datos
//       await models.Payment.create({
//         userId: metadata.userId,
//         paymentId,
//         status: response.body.status,
//         amount: response.body.transaction_details.total_paid_amount,
//       });

//       // Aumentar créditos al usuario
//       const user = await models.User.findByPk(metadata.userId);
//       if (user) {
//         user.amount += metadata.tokenReward;
//         await user.save();
//       }
//     }

//     res.status(200).send('OK');
//   } catch (error) {
//     next(error);
//   }

//   // console.log('webhook');
//   // console.log(req.query);
//   // res.send('OK');
// });
router.post('/webhook', async (req, res, next) => {
  try {
    console.log("Webhook received");

    // Configura Mercado Pago
    mercadopago.configure({
      access_token: config.mp_access_token,
    });

    // Asegúrate de tener habilitado express.json() en tu app para procesar JSON
    console.log("Query params:", req.query);
    console.log("Request body:", req.body);

    const payment= req.query;

    if(payment.topic === 'merchant_order'){
      console.log('No es un pago', payment);
      return res.status(200).send('OK');
    }

    const type = req.query.type; // merchant_order, payment, etc.
    const id = req.query["data.id"]; // ID del evento

    if (type === "payment") {
      // Obtiene detalles de la merchant order
      const response = await mercadopago.payment.findById(id);
      console.log("Merchant order details:", response.body);

      const merchantOrder = response.body;

      // Procesa la orden de pago aprobada
      // const approvedPayment = merchantOrder.payments.find(
      //   (payment) => payment.status === "approved"
      // );

      const approvedPayment = merchantOrder.status === "approved" ? merchantOrder : null;

      if (approvedPayment) {
        const metadata = approvedPayment.metadata;

        console.log("Metadata:", metadata);

        // Guarda el pago en la base de datos
        await models.Payment.create({
          // userId: metadata.userId,
          userId: metadata.user_id,
          // paymentId: approvedPayment.id,
          paymentId: metadata.plan_id,
          status: approvedPayment.status,
          amount: approvedPayment.transaction_details.total_paid_amount,
        });

        // Aumenta créditos al usuario
        // const user = await models.User.findByPk(metadata.userId);
        // if (user) {
        //   user.amount += metadata.tokenReward;
        //   await user.save();
        // }
        const userCredits = await models.Credits.findOne({ where: { userId: metadata.user_id } });
        if (userCredits) {
          userCredits.amount += metadata.token_reward;
          await userCredits.save();
        }

        console.log("Payment processed successfully.");
      } else {
        console.log("No approved payments found in the merchant order.");
      }
    } else {
      console.log("Unhandled topic:", type);
    }

    res.status(200).json({ 
      status: "OK",
      msg: "Webhook processed successfully.",
     });
     console.log("Webhook processed successfully.");
  } catch (error) {
    console.error("Error processing webhook:", error);
    next(error);
  }
});

router.get('/success', (req, res) => {
  res.send('Pago aprobado');
});

router.get('/failure', (req, res) => {
  console.log({ req });
  res.send('Pago rechazado');
});

router.get('/pending', (req, res) => {
  res.send('Pago pendiente');
});

module.exports = router;
