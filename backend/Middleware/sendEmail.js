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

const sendEmail = async (to, subject, html) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: {
                    name: "Note App",
                    email: "prasantrao917@gmail.com"
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject: subject,
                htmlContent: html
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Brevo Error:", data);
            throw new Error("Email failed");
        }

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email error:", error);
        throw error;
    }
};

export default sendEmail;