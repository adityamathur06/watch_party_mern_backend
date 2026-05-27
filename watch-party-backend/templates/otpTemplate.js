exports.otpTemplate = (otpCode) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; color: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #333;">
        <div style="background-color: #111; padding: 20px; text-align: center; border-bottom: 1px solid #222;">
            <h1 style="color: #ff5c00; margin: 0; letter-spacing: 2px;">WATCH PARTY</h1>
        </div>
        <div style="padding: 30px; background-color: #161616; text-align: center;">
            <h2 style="margin-top: 0; color: #ffffff;">Verify your email address</h2>
            <p style="color: #bbbbbb; line-height: 1.6; font-size: 16px;">
                You are almost ready to start watching! Enter the code below to verify your account. This code will expire in <strong>5 minutes</strong>.
            </p>
            <div style="background-color: #111; border: 1px solid #333; padding: 20px; border-radius: 8px; margin: 30px auto; max-width: 250px; letter-spacing: 8px;">
                <h1 style="color: #ff5c00; font-size: 32px; margin: 0;">${otpCode}</h1>
            </div>
            <p style="color: #666; font-size: 13px;">
                If you did not request this email, you can safely ignore it.
            </p>
        </div>
    </div>
    `;
};