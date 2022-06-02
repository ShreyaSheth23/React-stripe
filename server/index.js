const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const bodyParser = require("body-parser");
const cors = require("cors");
const { response } = require("express");

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors())

app.post("/payment", cors(), async(req, res) => {
    let { amount, id} = req.body
    console.log("🚀 ~ file: index.js ~ line 16 ~ app.post ~ req.body", amount)
    try {
        const payment = await stripe.paymentIntents.create({
            amount : amount,
            currency: 'inr',
            description: "Titan watches",
            payment_method: id,
            confirm: true,
            setup_future_usage: 'off_session',
        })

        console.log("PAYMENT", payment)

        res.json({
            message: "Payment Successful",
            success: true
        })
    } catch (error) {
        console.log("Error: ",error);
        res.json({
            message: "Payment Failed",
            success: false
        })
    }
})

app.listen(process.env.PORT || 4000, () => {
    console.log("Listening!")
})