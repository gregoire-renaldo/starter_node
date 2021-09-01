const nodemailer = require('nodemailer')


const sendEmail = async options => {
  // transporter
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASSWORD_EMAIL
    }
  });
  // define the email options
  const mailOptions = {
    from 'Greg <greg@boatnbreakfast.io>',
    to: options.email,
    subjext: options.subject,
    text: options.message,
    // html
  }
  // actually send the email
  // transporter.sendMail returns a promise, so async function :-)
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;

// const sendEmail = options => {
//   // transporter
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.USER_EMAIL,
//       pass: process.env.PASSWORD_EMAIL
//     }
//     // activate in gmail less secure app option
//   })
//   // define the email

//   // actually send the email
// }
