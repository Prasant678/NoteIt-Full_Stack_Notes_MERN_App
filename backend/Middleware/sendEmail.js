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

import * as brevo from '@getbrevo/brevo';

const sendEmail = async (to, subject, html) => {
    try {
        const apiInstance = new brevo.TransactionalEmailsApi();

        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );

        const emailData = new brevo.SendSmtpEmail();

        emailData.sender = {
            email: "your_verified_email@gmail.com",
            name: "Note App"
        };

        emailData.to = [{ email: to }];
        emailData.subject = subject;
        emailData.htmlContent = html;

        await apiInstance.sendTransacEmail(emailData);

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email error:", error.response?.body || error);
        throw error;
    }
};

export default sendEmail;