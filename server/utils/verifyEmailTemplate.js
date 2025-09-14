const verifyEmailTemplate = ({name, url}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Hello ${name},</h2>
      <p>Thank you for registering with MealCrush! Please verify your email address by clicking the link below:</p>
      <a href="${url}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <p>Best regards,<br/>The MealCrush Team</p>
    </div>
  `;
};

export default verifyEmailTemplate;