import transporter from '../utils/emailTransporter.js';
import templates from './templates.js';

const sendEmail = async (mailOptions) => {
  const { to, from, content } = mailOptions;
  const contacts = {
    from,
    to,
  };
  const email = Object.assign({}, content, contacts);
  const info = await transporter.sendMail(email);
  return info;
};

export default sendEmail;
