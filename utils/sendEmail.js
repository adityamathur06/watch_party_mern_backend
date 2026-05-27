const axios = require('axios');

const sendEmail = async (options) => {
    try {
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: options.templateId, // We will pass this from the controller
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: options.templateParams // Variables like email and OTP
        });
        
        return response.data;
    } catch (error) {
        console.error("EmailJS Error:", error.response?.data || error.message);
        throw new Error("Failed to send email via EmailJS");
    }
};

module.exports = sendEmail;