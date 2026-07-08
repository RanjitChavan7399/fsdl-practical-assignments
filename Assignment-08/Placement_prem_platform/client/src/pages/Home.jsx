import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaBuilding, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleAnalyze = async (e) => {
        e.preventDefault();
        
        if (!user) {
            navigate('/login');
            return;
        }

        if (!companyName.trim()) {
            setError('Please enter a company name');
            return;
        }

        setLoading(true);
        setError('');
        setAnalysis(null);

        try {
            // In a real app we might fetch basic details first
            // const companyRes = await axios.get(`http://localhost:5000/api/company/${companyName}`);
            
            // Get AI Analysis
            const aiRes = await axios.post('http://localhost:5000/api/ai/analyze', { companyName });
            setAnalysis({
                name: companyName,
                ...aiRes.data
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze company. Please ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 animation-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-dark mb-4 tracking-tight">
                    Master Your Next <span className="text-primary">Interview</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Get instant AI-driven insights, preparation tips, and verified interview questions for your dream company.
                </p>

                <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto flex items-center shadow-lg rounded-full overflow-hidden bg-white mt-8 border border-gray-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                    <div className="pl-6 text-gray-400">
                        <FaSearch />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter company name (e.g., Google, Microsoft, TCS)..."
                        className="w-full py-4 px-4 outline-none text-lg text-gray-700 bg-transparent"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-indigo-700 text-white font-bold py-4 px-8 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[140px]"
                    >
                        {loading ? <FaSpinner className="animate-spin text-xl" /> : 'Analyze'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
            </div>

            {/* Analysis Results Display */}
            {analysis && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-slide-up">
                    <div className="bg-gradient-to-r from-primary to-indigo-600 px-8 py-6 text-white flex items-center gap-4">
                        <div className="bg-white text-primary p-3 rounded-xl shadow-inner">
                            <FaBuilding className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">{analysis.name}</h2>
                            <p className="text-indigo-100 font-medium">Company Analysis Profile</p>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 border-gray-100 flex items-center gap-2">Overview</h3>
                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">{analysis.overview}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
                                <h3 className="text-xl font-bold text-indigo-900 mb-4">Interview Process</h3>
                                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {analysis.interviewProcess}
                                </div>
                            </div>
                            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                                <h3 className="text-xl font-bold text-emerald-900 mb-4">Preparation Tips</h3>
                                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {analysis.preparationTips}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 text-center">
                            <button
                                onClick={() => navigate(`/dashboard?company=${encodeURIComponent(analysis.name)}`)}
                                className="bg-dark hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2"
                            >
                                Generate Mock Questions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;