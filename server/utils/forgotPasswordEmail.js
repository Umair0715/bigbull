const nodemailer = require("nodemailer");
// const url = 'http://localhost:5173/new-password'
const url = 'https://bigbullworld.com/new-password'

const sendForgotPasswordEmail = async (email , token , subject = 'Forgot Password Request') => {
   
   let transporter = nodemailer.createTransport({
      name : process.env.EMAIL_USERNAME ,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure : false ,
      tls: {
         rejectUnauthorized: false // Disable certificate verification
      },
      auth: {
         user: process.env.EMAIL_USERNAME, 
         pass: process.env.EMAIL_PASSWORD,
      },
   });

   const mailOptions = {
      from:process.env.EMAIL_FROM ,
      to: email,
      subject ,
      html : `<html>
      <body style="font-family : sans-serif; ">
      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
               Forgot Password?
            </h1>
            </ br>
            <p>Please click on the button given below to reset your password</p>
            </br>
            </br>
            <a href="${url}?token=${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; background : red ; ">
               Reset Password
            </a>
            </br />
            </br />
      </br />
            </br />
            <div style="margin-top : 16px"><b>NOTE:</b> Password Reset Link will expire in 10 minutes.</div>
            <div style="margin-top : 16px; ">
         <p style="margin: 0 ; padding : 0;">Kindest Regards,</p>
            <h3 style="margin: 0 ; padding : 0; margin-top : 5px;">
            BigBull World Team.</h3>
            </div>
      
      </body>
      </html>
      `
   };

   return await transporter.sendMail(mailOptions);
};

module.exports = sendForgotPasswordEmail;