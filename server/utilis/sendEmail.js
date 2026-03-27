import nodemailer from "nodemailer";

export default async(email,subject,text)=>{
    try {
        const transporter=nodemailer.createTransport({
         
            service:process.env.SERVICE,
            auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },

        });
        
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log(`Email sent to ${email}`);
    } catch (error) {
          console.error("Email error:", error);
    return false;
    }
    
}
