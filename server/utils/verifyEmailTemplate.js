const verifyEmailTemplate = ({ name, url }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background:#f4f4f4;">
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding:20px 0;">
            <tr>
                <td align="center">
                    
                    <table width="600" cellpadding="0" cellspacing="0" 
                        style="background:#ffffff; border-radius:10px; padding:40px; text-align:center;">

                        <tr>
                            <td style="font-size:24px; font-weight:600; color:#333;">
                                Verify Your Email
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:20px 0; font-size:16px; color:#555;">
                                Hi <strong>${name}</strong>,<br /><br />
                                Thank you for registering. Please verify your email address by clicking the button below.
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:20px 0;">
                                <a href="${url}" 
                                    style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; 
                                    border-radius:6px; display:inline-block; font-size:16px;">
                                    Verify Email
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding-top:20px; font-size:14px; color:#777;">
                                If the button above doesn’t work, copy and paste this link into your browser:
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:10px 0;">
                                <a href="${url}" style="font-size:14px; color:#4f46e5; word-break:break-all;">
                                    ${url}
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding-top:30px; font-size:12px; color:#aaa;">
                                © ${new Date().getFullYear()} Your App Name. All rights reserved.
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `;
};

export default verifyEmailTemplate;