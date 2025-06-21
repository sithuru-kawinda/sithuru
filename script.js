const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;
    
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-password'
        }
    });
    
    const mailOptions = {
        from: email,
        to: 'jigarsable21@gmail.com',
        subject: `New Contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));