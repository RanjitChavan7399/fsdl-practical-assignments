import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaBriefcase, FaCode, FaUsers, FaCalculator, FaSpinner } from 'react-icons/fa';

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        companyName: '',
        aptitudeQuestions: '',
        codingQuestions: '',
        hrQuestions: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch Experiences Output
    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/experiences');
            setExperiences(res.data);
        } catch (err) {
            console.error("Error fetching experiences:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            await axios.post('http://localhost:5000/api/experience', formData);
            setMessage({ type: 'success', text: 'Experience shared successfully!' });
            setFormData({ companyName: '', aptitudeQuestions: '', codingQuestions: '', hrQuestions: '' });
            fetchExperiences(); // Refresh list
            
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Error submitting experience.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-dark mb-4">
                    Student <span className="text-primary">Experiences</span>
                </h1>
                <p className="text-xl text-gray-600">
                    Learn from peers or share your own interview journey.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Submit Form Section */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-fit sticky top-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaPlus className="text-primary" /> Share Experience
                    </h2>
                    
                    {message.text && (
                        <div className={`p-4 rounded-xl mb-6 text-center font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
                            <input 
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50"
                                placeholder="E.g. Amazon"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Aptitude Questions</label>
                            <textarea 
                                name="aptitudeQuestions"
                                value={formData.aptitudeQuestions}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50"
                                placeholder="Describe the aptitude rounds..."
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Coding Questions</label>
                            <textarea 
                                name="codingQuestions"
                                value={formData.codingQuestions}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50"
                                placeholder="What coding challenges were asked?"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">HR Questions</label>
                            <textarea 
                                name="hrQuestions"
                                value={formData.hrQuestions}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50"
                                placeholder="Managerial and HR questions..."
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {submitting ? <FaSpinner className="animate-spin" /> : 'Submit Experience'}
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                        <FaBriefcase className="text-gray-500" /> Recent Submissions
                    </h2>

                    {loading ? (
                        <div className="text-center py-20 text-gray-500">
                            <FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-primary" />
                            <p>Loading experiences...</p>
                        </div>
                    ) : experiences.length === 0 ? (
                        <div className="bg-gray-50 p-10 rounded-2xl text-center border border-gray-200">
                            <p className="text-gray-500 text-lg">No experiences found. Be the first to share one!</p>
                        </div>
                    ) : (
                        experiences.map((exp) => (
                            <div key={exp._id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-primary">{exp.companyName}</h3>
                                    <span className="text-sm text-gray-400 font-medium">
                                        {new Date(exp.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                
                                <div className="space-y-4 mt-6">
                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                        <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                            <FaCalculator /> Aptitude
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-wrap text-sm">{exp.aptitudeQuestions}</p>
                                    </div>

                                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                        <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                                            <FaCode /> Coding
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-wrap text-sm font-mono">{exp.codingQuestions}</p>
                                    </div>

                                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                        <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                            <FaUsers /> HR
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-wrap text-sm italic">{exp.hrQuestions}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Experience;
