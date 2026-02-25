import nodeMailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
    try {
        const transport = nodeMailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_PASS
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