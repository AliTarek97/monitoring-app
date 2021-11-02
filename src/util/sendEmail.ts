import nodemailer from "nodemailer";

export const sendEmail = async (email:string, subject:string, text:string) => {
    try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: testAccount.user, // generated ethereal user
              pass: testAccount.pass, // generated ethereal password
            },
          });
    
        const info = await transporter.sendMail({
            from: "\"Fred Foo 👻\" <foo@example.com>", // sender address
            to: email, // list of receivers
            subject, // Subject line
            text,
        });
    
        console.log("Message sent: %s", info.messageId);
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
  
};