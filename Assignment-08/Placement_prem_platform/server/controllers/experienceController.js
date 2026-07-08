const Experience = require('../models/Experience');

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ createdAt: -1 });
        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new experience
// @route   POST /api/experience
// @access  Public
const createExperience = async (req, res) => {
    try {
        const { companyName, aptitudeQuestions, codingQuestions, hrQuestions } = req.body;

        if (!companyName || !aptitudeQuestions || !codingQuestions || !hrQuestions) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const experience = await Experience.create({
            companyName,
            aptitudeQuestions,
            codingQuestions,
            hrQuestions,
        });

        res.status(201).json(experience);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getExperiences,
    createExperience,
};
