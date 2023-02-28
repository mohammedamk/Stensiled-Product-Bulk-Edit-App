import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@vowelweb.net',
    pass: '4hkEiycNhjHV',
  },
});

export default transporter;
