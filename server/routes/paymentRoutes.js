const axios = require('axios');
const { createSubscriptionByUsd } = require('../controllers/paymentController');
const router = require('express').Router();

// const API_KEY = '06HN0HS-4F7MEP5-HT7Q95Y-WNSFEY6';
const API_KEY = 'D77HQ6E-JCDMZQJ-QZWQ524-GGPK0T1';

router.get('/done' , (req , res) => {
    console.log('done');
    console.log(req);
})

// sandbox
router.post('/', (req , res) => {
    console.log({ body : req.body })
    const paymentData = {
        "price_amount": 50 ,
        "price_currency": "USDTTRC20" ,
        "pay_amount": 50 ,
        "pay_currency": "USDTTRC20" ,
        "ipn_callback_url": "http://localhost:3300/api/payment/done" , 
        "order_id": req.body.packageId ,
        "order_description": req.body.pacakgeName ,
        case: 'success'
    }
    axios.post('https://api-sandbox.nowpayments.io/v1/payment', paymentData, {
        headers: {
            'x-api-key': '1N4KF6A-FFPMQQG-PVPN7GN-R141FQ1'
        }
    })
    .then(response => {
        console.log({ response })
        res.send(response.data);
    })
    .catch(error => {
        console.log(error);
    });
});

router.post('/done' , createSubscriptionByUsd)

module.exports = router;

// 5831523967

// router.post('/', (req , res) => {
//     console.log({ body : req.body })
//     const paymentData = {
//         "price_amount": 50 ,
//         "price_currency": "USDTTRC20" ,
//         "pay_amount": 50 ,
//         "pay_currency": "USDTTRC20" ,
//         "ipn_callback_url": "http://localhost:3300/api/payment/done" , 
//         "order_id": req.body.packageId ,
//         "order_description": req.body.pacakgeName ,
//     }
//     axios.post('https://api.nowpayments.io/v1/payment', paymentData, {
//         headers: {
//             'x-api-key': API_KEY
//         }
//     })
//     .then(response => {
//         console.log({ response })
//         res.send(response.data);
//     })
//     .catch(error => {
//         console.log(error);
//     });
// });
