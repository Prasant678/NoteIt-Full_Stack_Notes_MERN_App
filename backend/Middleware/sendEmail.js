import nodeMailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
    try {
        const transport = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
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