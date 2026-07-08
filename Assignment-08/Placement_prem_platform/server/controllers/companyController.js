// @desc    Get company info
// @route   GET /api/company/:name
// @access  Public
const getCompanyInfo = async (req, res) => {
    const companyName = req.params.name;
    
    // We mock the basic data here to meet the requirement. 
    // In a real app, this could call a company API like Clearbit.
    try {
        const mockData = {
            name: companyName,
            industry: 'Technology',
            website: `https://www.${companyName.toLowerCase().replace(/\s/g, '')}.com`,
            logo: `https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s/g, '')}.com`,
        };
        
        res.status(200).json(mockData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getCompanyInfo,
};
