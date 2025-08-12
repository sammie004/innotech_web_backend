// const connection  = require('../connection/connection');
const nodemailer = require('nodemailer')
const dotenv = require("dotenv");
dotenv.config();
// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,           // <—— instead of 465
  secure: false,       // <—— TLS, not SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const contact = (req,res)=>{
  const { name, email, subject ,message } = req.body;
  if(!email || !name || !subject || !message){
    return res.status(400).json({error: "All fields are required"});
  }
  else{
const mailOptions = {
  from: email,
  to: process.env.EMAIL_USER,
  subject: `New Contact Message - ${subject}`,
  text: `
New Contact Form Submission
===========================

Name: ${name}
Email: ${email}

Message:
${message}

---------------------
Submitted on: ${new Date().toLocaleString()}
  `
};

    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({error: "Failed to send email"});
      }
      console.log('Email sent:', info.response);
      return res.status(200).json({message: "Email sent successfully"});
    });
  }
}
const Quote = (req,res) =>{
  const {name,email,company,project_type,budget,timeline,project_description} = req.body
  if(!name || !email || !company||!project_type ||!budget||!timeline|| !project_description){
    return res.status(400).json({error: "All fields are required"});
  }
const mailOptions = {
  from: email,
  to: process.env.EMAIL_USER,
  subject: `Quote Request - ${project_type} (${company})`,
  text: `
Quote Request Details
=====================

Name: ${name}
Email: ${email}
Company: ${company}

Project Type: ${project_type}
Budget: ${budget}
Timeline: ${timeline}

Project Description:
${project_description}

---------------------
Submitted on: ${new Date().toLocaleString()}
  `
};

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({error: "Failed to send email"});
    }
    console.log('Email sent:', info.response);
    return res.status(200).json({message: "Quote request sent successfully"});
  });
}
module.exports = {
  contact,
  Quote
}