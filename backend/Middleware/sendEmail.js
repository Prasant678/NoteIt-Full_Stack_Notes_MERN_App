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