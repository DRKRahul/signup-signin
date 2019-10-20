import nodemailer from 'nodemailer';

export default class Emailer {

  constructor() {
    this.smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      }
    });
  }

  async sendVerificationMail(userEmail, token) {
    if (!userEmail || !token) {
      throw new Error('Missing info for verification');
    }
    try {
      const link = `http://localhost:8000/api/v1/users/verify?id=${token}`
      const mailOptions = {
        to: userEmail,
        subject: "Please confirm your Email account",
        html: `Hello,<br> Please Click on the link to verify your email.<br><a href="${link}">Click here to verify</a>`
      }
      await this.smtpTransport.sendMail(mailOptions);
    } catch (e) {
      throw e;
    }
  }
}