exports.roomInviteTemplate = (hostName, roomId, joinLink) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; color: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #333;">
        <div style="background-color: #111; padding: 20px; text-align: center; border-bottom: 1px solid #222;">
            <h1 style="color: #ff5c00; margin: 0; letter-spacing: 2px;">WATCH PARTY</h1>
        </div>
        <div style="padding: 30px; background-color: #161616;">
            <h2 style="margin-top: 0;">You've been invited! 🍿</h2>
            <p style="color: #bbbbbb; line-height: 1.6; font-size: 16px;">
                Your friend <strong>${hostName}</strong> has invited you to join a Watch Party room to watch videos and chat in real-time.
            </p>
            <div style="background-color: #111; border: 1px solid #333; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="color: #888; margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; tracking-widest;">Room Code</p>
                <h3 style="color: #ff5c00; font-size: 24px; margin: 0; letter-spacing: 3px;">${roomId}</h3>
            </div>
            <a href="${joinLink}" style="display: block; background-color: #ff5c00; color: #ffffff; text-decoration: none; padding: 15px; text-align: center; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 20px;">
                Join the Room
            </a>
        </div>
        <div style="padding: 15px; text-align: center; background-color: #0a0a0a; color: #666; font-size: 12px;">
            <p style="margin: 0;">Built by Aditya • Watch Party 2026</p>
        </div>
    </div>
    `;
};