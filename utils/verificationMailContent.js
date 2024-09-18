const verificationMailContent = (name, link) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; padding-bottom: 20px;">
        <h2 style="color: #2c3e50;">Welcome to Our Platform, ${name}!</h2>
      </div>
      <div style="font-size: 16px;">
        <p style="line-height: 1.6;">Thank you for signing up! To complete your registration and activate your account, we just need to verify your email address.</p>
        <p style="line-height: 1.6;">Please click the button below to confirm your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #3498db; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify My Email</a>
        </div>
        <p style="line-height: 1.6;">If the button above doesn't work, you can copy and paste the following link into your browser:</p>
        <p style="line-height: 1.6; word-break: break-all;"><a href="${link}" style="color: #3498db;">${link}</a></p>
      </div>
      <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #777; font-size: 14px;">
        <p>Need help? Feel free to <a href="mailto:support@yourdomain.com" style="color: #3498db;">contact us</a>.</p>
        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
    </div>
  `;
}

module.exports = verificationMailContent;