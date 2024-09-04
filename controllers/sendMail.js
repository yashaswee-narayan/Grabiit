const nodemailer=require('nodemailer');
// const { google }=require('googleapis')
// const { OAuth2 }=google.auth;
// const OAUTH_PLAYGROUND='https://developers.google.com/oauthplayground';


const {
    MAILING_USERNAME,
    MAILING_PASSWORD,
    SENDER_EMAIL_ADDRESS
}=process.env

// send mail
module.exports.sendEmail=(to, user_name, url) => {
    const smtpTransport=nodemailer.createTransport({
        host: "mail.grabitt.haxworld.net",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: MAILING_USERNAME, // generated ethereal user
            pass: MAILING_PASSWORD, // generated ethereal password
        },
    });

    const mailOptions={
        from: `Grabitt ${SENDER_EMAIL_ADDRESS}`,
        to: to,
        subject: `🔑 Reset Password`,
        html: `<div style="width:60%;margin:auto;font-family:'Poppins';">
        <img src="https://grabitt.haxworld.net/logo/logo.png" height="35" alt="Grabitt"/>
        <h2>Hi, ${user_name}</h2>
        <p style = "color:gray;">Forgot your password? Let&rsquo;s set up a new one!</p>
        <p style="color:black; font-weight:bold">Click this link: </p>
        ${url}
        
        <p style = "color:gray;">If you didn&rsquo;t mean to reset your password, you can disregard this email and nothing will change.</p>
      </div>`
    }

    smtpTransport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err.message);
            return;
        }

        console.log("naman", info);
        return;
    })
}