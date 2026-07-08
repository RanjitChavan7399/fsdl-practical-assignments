import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLaptopCode, FaCalculator, FaUsers, FaArrowLeft, FaSpinner } from 'react-icons/fa';

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const companyName = searchParams.get('company');
    const navigate = useNavigate();
    
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!companyName) {
            navigate('/');
            return;
        }

        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const res = await axios.post('http://localhost:5000/api/ai/questions', { companyName });
                setQuestions(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch AI questions.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [companyName, navigate]);

    if (!companyName) return null;

    return (
        <div className="max-w-5xl mx-auto py-8">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-medium"
            >
                <FaArrowLeft /> Back to Search
            </button>

            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-dark mb-2">
                    Interview Preparation Dashboard
                </h1>
                <p className="text-xl text-gray-600">
                    Generated Mock Questions for <span className="font-bold text-primary">{companyName}</span>
                </p>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-indigo-500">
                    <FaSpinner className="animate-spin text-5xl mb-4" />
                    <p className="text-xl font-medium animate-pulse">AI is crafting questions for {companyName}...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center font-medium">
                    {error}
                </div>
            )}

            {questions && !loading && (
                <div>
                    <div className="mb-6 flex justify-center">
                        <span className="bg-rose-100 text-rose-800 text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow border border-rose-200">
                            Difficulty Level: {questions.difficulty || "Hard"}
                        </span>
                    </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Technical Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-primary hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-100 p-3 rounded-lg text-primary">
                                <FaLaptopCode className="text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Technical Questions</h2>
                        </div>
                        <ul className="space-y-4">
                            {questions.technical?.map((q, idx) => (
                                <li key={idx} className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed border border-gray-100 font-mono text-sm shadow-inner">
                                    <span className="font-bold text-primary mr-2 block mb-1">Challenge {idx + 1}:</span> {q}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* HR Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-emerald-500 hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
                                <FaUsers className="text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">HR / Behavioral</h2>
                        </div>
                        <ul className="space-y-4">
                            {questions.hr?.map((q, idx) => (
                                <li key={idx} className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed border border-gray-100 italic">
                                    "{q}"
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
