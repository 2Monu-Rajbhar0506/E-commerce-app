const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

      <h2 style="text-align: center; color: #333;">Password Reset Request</h2>

      <p style="font-size: 15px; color: #555;">
        Hi <strong>${name}</strong>,  
      </p>

      <p style="font-size: 15px; color: #555;">
        We received a request to reset your password for your <strong>E-commerce store</strong> account.
      </p>

      <p style="font-size: 15px; color: #555; margin-bottom: 20px;">
        Please use the following One-Time Password (OTP) to reset your password:
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <div style="display: inline-block; padding: 15px 25px; background-color: #4F46E5; color: #fff; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 3px;">
          ${otp}
        </div>
      </div>

      <p style="font-size: 14px; color: #888; text-align: center;">
        This OTP is valid for <strong>1 hour</strong>.  
      </p>

      <p style="font-size: 14px; color: #888; text-align: center;">
        If you didn't request this, please ignore this email.  
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">

      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} E-Commerce store. All rights reserved.
      </p>

    </div>
  </div>
  `;
};

export default forgotPasswordTemplate;
