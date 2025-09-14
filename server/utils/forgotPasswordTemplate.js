const forgotPasswordTemplate = ({name, otp}) => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <h1 style="color: #4CAF50; margin: 0;">MealCrush</h1>
        </div>
        <div style="padding: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
          <p>We received a request to reset your password for your MealCrush account.</p>
          <p>Your One-Time Password (OTP) for password reset is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #4CAF50; color: #ffffff; font-size: 28px; font-weight: bold; padding: 15px 25px; border-radius: 5px; letter-spacing: 3px;">${otp}</span>
          </div>
          <p>This OTP is valid for a short period. Please do not share this code with anyone.</p>
          <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} MealCrush. All rights reserved.</p>
          <p>
            <a href="#" style="color: #4CAF50; text-decoration: none;">Privacy Policy</a> |
            <a href="#" style="color: #4CAF50; text-decoration: none;">Terms of Service</a>
          </p>
        </div>
      </div>
    `;
};
export default forgotPasswordTemplate;