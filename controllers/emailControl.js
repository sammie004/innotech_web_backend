const connection  = require('../connection/connection');
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

const Fetch_body = (req,res)=>{
    const {name, email, subject, message} = req.body;
    const check = `SELECT * FROM contact_form_submissions WHERE email = ?`;
    connection.query(check, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const insertQuery = `INSERT INTO contact_form_submissions (full_name, email, subject, message) VALUES (?, ?, ?, ?)`;
        connection.query(insertQuery, [name, email, subject, message], (err, result) => {
            if (err) {
                    console.error('Insert error:', err);
                return res.status(500).json({ error: 'Failed to insert data' });
            }

            // Send email

           const mailOptions = {
  from: `"InnoTech Website" <${process.env.EMAIL_USER}>`,  // your “from”
  to: process.env.EMAIL_USER,                             // who receives the form
  replyTo: email,                                          // user’s address
  subject: `[Contact Form] ${subject}`,                   
  text: `
You’ve got a new contact‑form submission:
Name:    ${name}
Email:   ${email}
Subject: ${subject}
Message:
${message}
  `,
  html: `
    <h2>New Contact‑Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Subject:</strong> ${subject}</p>
    <hr/>
    <p>${message.replace(/\n/g, '<br/>')}</p>
  `
};
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Email send error:', error);
                    return res.status(500).json({ error: 'Failed to send email' });
                }
                res.status(200).json({ message: 'Email sent successfully', info });
            });
        });
    });

}
const project_inquiries = (req,res)=>{
    const{name,email,company,project_type,budget_range,timeline,project_description} = req.body
    const check = `SELECT * FROM project_inquiries WHERE email = ?`;
    connection.query(check, [email], (err, result) => {
        if(result.length > 0){
            return res.status(400).json({ error: 'you reached out to us already kindly wait for a response from us' });
            
        }
    })
    const insert = `INSERT INTO project_inquiries (name, email, company, project_type, budget_range, timeline, project_description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(insert, [name, email, company, project_type, budget_range, timeline, project_description], (err, result) => {
        if(err){
            console.error('Insert error:', err);
            return res.status(500).json({ error: 'Failed to insert data' });
        }
        // Send email
        const mailOptions = {
  from: `"Website Inquiry" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,               // e.g. your sales or projects inbox
  replyTo: `${name} <${email}>`,        // user’s address, so replies go to them
  subject: `New Project Inquiry: ${project_type} by ${name}`,

  text: `
You have received a new project inquiry.

Full Name:           ${name}
Email Address:       ${email}
Company/Organization:${company || '—'}
Project Type:        ${project_type}
Budget Range:        ${budget_range || '—'}
Timeline:            ${timeline || '—'}

Project Description:
${project_description}

Submitted At:        ${(new Date()).toLocaleString()}
  `.trim(),

  html: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
    <h2 style="color: #0052cc;">New Project Inquiry Received</h2>
    <table cellpadding="4" cellspacing="0" border="0" style="width:100%; max-width:600px;">
      <tr>
        <td style="font-weight:bold; width:180px;">Full Name:</td>
        <td>${name}</td>
      </tr>
      <tr style="background:#f9f9f9;">
        <td style="font-weight:bold;">Email Address:</td>
        <td><a href="mailto:${email}">${email}</a></td>
      </tr>
      <tr>
        <td style="font-weight:bold;">Company/Organization:</td>
        <td>${company || '<em>Not provided</em>'}</td>
      </tr>
      <tr style="background:#f9f9f9;">
        <td style="font-weight:bold;">Project Type:</td>
        <td>${project_type}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">Budget Range:</td>
        <td>${budget_range || '<em>Not specified</em>'}</td>
      </tr>
      <tr style="background:#f9f9f9;">
        <td style="font-weight:bold;">Timeline:</td>
        <td>${timeline || '<em>Not specified</em>'}</td>
      </tr>
    </table>
    <h3 style="margin-top:20px; color:#0052cc;">Project Description</h3>
    <p style="white-space: pre-wrap; background:#f5f5f5; padding:10px; border-radius:4px;">
      ${project_description}
    </p>
    <p style="font-size:0.85em; color:#666; margin-top:20px;">
      Submitted at ${(new Date()).toLocaleString()}
    </p>
  </div>
  `
};

        

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email send error:', error);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            res.status(200).json({ message: 'Project inquiry submitted successfully', info });
        });
    })
}
module.exports = {
    Fetch_body,
    project_inquiries
}