import nodeMailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
    try {
        const transport = nodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailOptions = {
            from: `Note App <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        }

        await transport.sendMail(mailOptions);
    } catch (error) {
        console.error("Email error:", error);
        throw error;
    }

}

export default sendEmail