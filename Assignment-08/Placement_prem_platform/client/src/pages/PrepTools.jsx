import { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaFileAlt, FaSpellCheck, FaSpinner } from 'react-icons/fa';

const PrepTools = () => {
    const [activeTab, setActiveTab] = useState('evaluate'); // 'evaluate' or 'resume'
    
    // Evaluate State
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [evalResult, setEvalResult] = useState(null);
    const [evalLoading, setEvalLoading] = useState(false);
    
    // Resume State
    const [resumeText, setResumeText] = useState('');
    const [resumeResult, setResumeResult] = useState(null);
    const [resumeLoading, setResumeLoading] = useState(false);

    const handleEvaluate = async () => {
        if (!question.trim() || !answer.trim()) return;
        setEvalLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/ai/evaluate-answer', { question, answer });
            setEvalResult(res.data);
        } catch (error) {
            console.error(error);
            alert("Failed to evaluate answer.");
        } finally {
            setEvalLoading(false);
        }
    };

    const handleResume = async () => {
        if (!resumeText.trim()) return;
        setResumeLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/ai/analyze-resume', { resumeText });
            setResumeResult(res.data);
        } catch (error) {
            console.error(error);
            alert("Failed to analyze resume.");
        } finally {
            setResumeLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">AI Prep Tools</h1>
                <p className="text-xl text-gray-600 mb-8">Fine-tune your skills with our specialized AI evaluators.</p>
                
                <div className="inline-flex bg-gray-100 p-1 rounded-xl shadow-sm">
                    <button 
                        onClick={() => setActiveTab('evaluate')}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === 'evaluate' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <FaSpellCheck /> Answer Evaluator
                    </button>
                    <button 
                        onClick={() => setActiveTab('resume')}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === 'resume' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <FaFileAlt /> Resume Analyzer
                    </button>
                </div>
            </div>

            {/* ANSWER EVALUATOR TAB */}
            {activeTab === 'evaluate' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-900 flex items-center gap-2 border-b pb-2"><FaSpellCheck className="text-indigo-500" /> Input Answer</h2>
                        <div className="flex-1 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Interview Question</label>
                                <textarea 
                                    className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                                    rows="3" 
                                    placeholder="e.g. Tell me about a time you failed."
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Answer</label>
                                <textarea 
                                    className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-1 min-h-[150px]" 
                                    placeholder="Type your answer here..."
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            </div>
                        </div>
                        <button 
                            disabled={evalLoading}
                            onClick={handleEvaluate}
                            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            {evalLoading ? <><FaSpinner className="animate-spin" /> Evaluating...</> : <><FaPaperPlane /> Evaluate Answer</>}
                        </button>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-300 pb-2">AI Evaluation</h2>
                        {evalResult ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className={`text-4xl font-black ${evalResult.Score >= 8 ? 'text-emerald-500' : evalResult.Score >= 5 ? 'text-amber-500' : 'text-red-500'}`}>
                                        {evalResult.Score}<span className="text-xl text-gray-400">/10</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Correctness</p>
                                        <p className={`font-semibold ${evalResult.Correctness === 'High' ? 'text-emerald-600' : evalResult.Correctness === 'Medium' ? 'text-amber-600' : 'text-red-600'}`}>{evalResult.Correctness}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <p className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wide">Feedback</p>
                                    <p className="text-gray-700">{evalResult.Feedback}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <p className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wide flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Improvement Tips</p>
                                    <p className="text-gray-700">{evalResult.ImprovementTips}</p>
                                </div>
                                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                    <p className="font-bold text-indigo-900 mb-1 text-sm uppercase tracking-wide">Model Answer / Ideal Approach</p>
                                    <p className="text-indigo-800 italic">{evalResult.ModelAnswer}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
                                <p>Submit your answer for AI feedback.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* RESUME ANALYZER TAB */}
            {activeTab === 'resume' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col">
                        <h2 className="text-2xl font-bold mb-4 text-emerald-900 flex items-center gap-2 border-b pb-2"><FaFileAlt className="text-emerald-500" /> Paste Resume</h2>
                        <div className="flex-1">
                            <textarea 
                                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none h-full min-h-[300px]" 
                                placeholder="Paste the text of your resume here to get ats-friendly insights..."
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                            />
                        </div>
                        <button 
                            disabled={resumeLoading}
                            onClick={handleResume}
                            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            {resumeLoading ? <><FaSpinner className="animate-spin" /> Analyzing...</> : <><FaPaperPlane /> Analyze Resume</>}
                        </button>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-300 pb-2">Analysis Results</h2>
                        {resumeResult ? (
                            <div className="space-y-4">
                                <div className="bg-white p-5 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                                    <h3 className="font-bold text-emerald-800 text-lg mb-2">Strengths Identified</h3>
                                    <p className="text-gray-700 leading-relaxed">{resumeResult.Strengths}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl border-l-4 border-rose-500 shadow-sm">
                                    <h3 className="font-bold text-rose-800 text-lg mb-2">Areas for Improvement</h3>
                                    <p className="text-gray-700 leading-relaxed">{resumeResult.Weaknesses}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                                    <h3 className="font-bold text-blue-800 text-lg mb-2">Best Matching Roles</h3>
                                    <p className="text-gray-700 leading-relaxed font-semibold text-blue-900">{resumeResult.MatchingRoles}</p>
                                </div>
                                <div className="bg-gray-100 p-5 rounded-xl border border-gray-200">
                                    <h3 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">🚀 Preparation Strategies</h3>
                                    <p className="text-gray-700 italic">{resumeResult.PrepStrategies}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
                                <p>Submit your resume text for analysis.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrepTools;
