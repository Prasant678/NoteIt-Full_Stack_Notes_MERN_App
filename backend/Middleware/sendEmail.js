import nodeMailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
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
}

export default sendEmail