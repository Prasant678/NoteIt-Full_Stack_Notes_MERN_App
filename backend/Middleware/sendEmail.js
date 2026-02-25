// import nodeMailer from 'nodemailer';

// const sendEmail = async (to, subject, html) => {
//     try {
//         const transport = nodeMailer.createTransport({
//             host: "smtp-relay.brevo.com",
//             port: 587,
//             secure: false,
//             auth: {
//                 user: process.env.BREVO_USER,
//                 pass: process.env.BREVO_PASS
//             }
//         })

//         const mailOptions = {
//             from: `Note App <${process.env.BREVO_USER}>`,
//             to,
//             subject,
//             html
//         }

//         await transport.sendMail(mailOptions);
//     } catch (error) {
//         console.error("Email error:", error);
//         throw error;
//     }

// }

// export default sendEmail

import * as Brevo from "@getbrevo/brevo";

const sendEmail = async (to, subject, html) => {
    try {
        const apiInstance = new Brevo.TransactionalEmailsApi();

        apiInstance.setApiKey(
            Brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );

        const sendSmtpEmail = {
            sender: { email: "your_verified_email@gmail.com", name: "Note App" },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html,
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email error:", error);
        throw error;
    }
};

export default sendEmail;