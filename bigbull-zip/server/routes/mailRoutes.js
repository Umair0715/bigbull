const router = require('express').Router();
const nodemailer = require('nodemailer');

router.post('/send-email' , async(req ,res ) => {
    const { name , email , subject , message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject ,
            html: `
            <div> <p><b>NAME : </b></p> <p>${name}</p> </div> 
            <div> <p><b>EMAIL : </b></p> <p>${email}</p> </div>
            <div> <p><b>MESSAGE : </b></p> <p>${message}</p> </div>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error" + error)
            } else {
                console.log("Email sent:" + info.response);
                res.status(200).json({
                    message : 'Email Sent.'
                })
            }
        })
    } catch (error) {
        console.log({ mailError : error })
        res.status(500).json({
            message : 'internal server error',
            error ,
        })
    }
})

module.exports = router;