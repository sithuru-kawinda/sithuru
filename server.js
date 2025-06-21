const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // For serving static files

// Database connection
mongoose.connect('mongodb://localhost:27017/portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const Project = require('./models/Project');
const Education = require('./models/Education');
const Skill = require('./models/Skill');
const Contact = require('./models/Contact');

// Routes
// Projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/projects', async (req, res) => {
    const project = new Project(req.body);
    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Education
app.get('/api/education', async (req, res) => {
    try {
        const education = await Education.find();
        res.json(education);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/education', async (req, res) => {
    const education = new Education(req.body);
    try {
        const newEducation = await education.save();
        res.status(201).json(newEducation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Skills
app.get('/api/skills', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/skills', async (req, res) => {
    const skill = new Skill(req.body);
    try {
        const newSkill = await skill.save();
        res.status(201).json(newSkill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Contact
app.post('/api/contact', async (req, res) => {
    const contact = new Contact(req.body);
    try {
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});