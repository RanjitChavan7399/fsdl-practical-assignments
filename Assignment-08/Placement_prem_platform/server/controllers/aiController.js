const { HfInference } = require('@huggingface/inference');
const { extractAndParseJSON, validateKeys } = require('../utils/aiParser');

// HF Client
const hf = process.env.HF_API_KEY ? new HfInference(process.env.HF_API_KEY) : null;
const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2";

// Mock Fallbacks
const getMockAnalysis = (companyName) => ({
    overview: `${companyName} is a leading technology company known for its innovative solutions and dynamic work environment. They focus on software engineering, data science, and cloud computing.`,
    interviewProcess: `1. Online Assessment (Aptitude + Coding)\n2. Technical Round 1 (Data Structures & Algorithms)\n3. Technical Round 2 (System Design & Core Subjects)\n4. HR Round (Cultural Fit)`,
    preparationTips: `Focus heavily on LeetCode Mediums. Revise CS core subjects (OS, DBMS, Computer Networks). Practice mock interviews and be prepared to discuss your projects in depth.`,
});

const getMockQuestions = (companyName) => ({
    aptitude: [
        "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
        "If A and B together can complete a piece of work in 15 days, and B alone in 20 days, in how many days can A alone complete the work?"
    ],
    coding: [
        "Write a function to reverse a linked list.",
        "Given an array of integers, find the maximum subarray sum (Kadane's Algorithm)."
    ],
    hr: [
        "Tell me about a time you faced a significant challenge in a project and how you overcame it.",
        "Why do you want to join this company specifically?"
    ]
});

const getMockEvaluation = () => ({
    Score: 8,
    Correctness: "High",
    Feedback: "Good explanation of the core concept. You touched upon the most critical points.",
    ImprovementTips: "Try to include real-world examples to make your answer more concrete.",
    ModelAnswer: "A comprehensive answer would mention X, Y, and Z clearly."
});

const getMockResumeAnalysis = () => ({
    Strengths: "Strong programming background, good academic projects.",
    Weaknesses: "Lack of professional experience, minimal focus on soft skills.",
    MatchingRoles: "Junior Software Engineer, Backend Developer, Data Analyst.",
    PrepStrategies: "Focus on building a portfolio. Work on systemic design concepts."
});

// Helper for HF calls
const callHfModel = async (systemPrompt, userPrompt) => {
    if (!hf) throw new Error("No HF API Key");
    
    let prompt = `<s>[INST] ${systemPrompt}\n\n${userPrompt} [/INST]`;
    
    try {
        const response = await hf.textGeneration({
            model: MODEL_NAME,
            inputs: prompt,
            parameters: {
                max_new_tokens: 1000,
                temperature: 0.3, // Low temp for more deterministic output
                return_full_text: false
            }
        });
        return response.generated_text;
    } catch (apiError) {
        console.error("\n[HF API Failure Details]:", apiError.message, "\n");
        throw apiError;
    }
};

// @desc    Analyze a company
// @route   POST /api/ai/analyze
// @access  Public
const analyzeCompany = async (req, res) => {
    const { companyName } = req.body;
    if (!companyName) return res.status(400).json({ message: 'Company name is required' });

    try {
        if (!hf) return res.status(200).json(getMockAnalysis(companyName));

        const systemPrompt = `You are a helpful career advisor. Provide a brief company overview, interview process, and preparation tips for candidates applying. 
STRICT INSTRUCTION: Respond ONLY with a valid JSON object. Do not include markdown formatting or conversational text.
JSON Structure:
{
  "overview": "text",
  "interviewProcess": "text",
  "preparationTips": "text"
}`;
        const outputText = await callHfModel(systemPrompt, `Company: ${companyName}`);
        
        let data = extractAndParseJSON(outputText);
        if(!validateKeys(data, ['overview', 'interviewProcess', 'preparationTips'])) {
             throw new Error("Missing keys in generation");
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('AI Analysis Error:', error.message);
        res.status(200).json(getMockAnalysis(companyName));
    }
};

// @desc    Generate questions for a company
// @route   POST /api/ai/questions
// @access  Public
const generateQuestions = async (req, res) => {
    const { companyName } = req.body;
    if (!companyName) return res.status(400).json({ message: 'Company name is required' });

    try {
        if (!hf) {
            return res.status(200).json({
                technical: ["Design a rate limiter.", "Explain Paxos vs Raft.", "Implement an LRU cache."],
                hr: ["Tell me about a time you had to disagree with your manager.", "Why this company?"],
                difficulty: "Hard"
            });
        }

        const systemPrompt = `You are a senior technical interviewer with 10+ years of experience at top tech companies like Google, Amazon, and Microsoft.

Task:
Generate high-quality, non-generic interview questions for a candidate.

Context:
* Role: Software Engineering
* Company: ${companyName}

Instructions:
* If the company is unknown or niche, DO NOT say "I don't know"
* Instead, generate industry-level software engineering questions
* Avoid basic or repeated questions
* Focus on:
  • Data Structures & Algorithms
  • System Design (if role is experienced)
  • Real-world problem solving
* Questions must be challenging and realistic
* Do NOT generate textbook or trivial questions

Output Format (STRICT — follow exactly as a pure JSON object):
{
  "technical": ["q1", "q2", "q3"],
  "hr": ["q1", "q2"],
  "difficulty": "Hard"
}

Important:
* Do NOT add explanations
* Do NOT add extra text outside this format
* Do NOT repeat questions`;
        const outputText = await callHfModel(systemPrompt, `Company: ${companyName}`);
        
        const data = extractAndParseJSON(outputText);
        if(!validateKeys(data, ['technical', 'hr', 'difficulty'])) throw new Error("Missing newly requested keys");
        res.status(200).json(data);
    } catch (error) {
        console.error('AI Question Generation Error:', error.message);
        res.status(200).json({
            technical: ["How do you detect a cycle in a distributed graph?", "Design a high-throughput messaging queue.", "Implement Trie with prefix matching."],
            hr: ["Tell me about a project that failed and what you learned.", "How do you handle scope creep?"],
            difficulty: "Hard"
        });
    }
};

// @desc    Evaluate a candidate's answer
// @route   POST /api/ai/evaluate-answer
// @access  Public
const evaluateAnswer = async (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ message: 'Question and answer are required' });

    try {
        if (!hf) return res.status(200).json(getMockEvaluation());

        const systemPrompt = `You are a strict and helpful AI interviewer evaluator. Read the interview question and the candidate's answer. Evaluate it accurately.
STRICT INSTRUCTION: Respond ONLY with a valid JSON object. Do not provide any conversational text.
JSON Structure:
{
  "Score": number (1-10),
  "Correctness": "Low/Medium/High",
  "Feedback": "string",
  "ImprovementTips": "string",
  "ModelAnswer": "string"
}`;
        const outputText = await callHfModel(systemPrompt, `Question: ${question}\nCandidate Answer: ${answer}`);
        
        const data = extractAndParseJSON(outputText);
        if(!validateKeys(data, ['Score', 'Correctness', 'Feedback', 'ImprovementTips', 'ModelAnswer'])) throw new Error("Missing keys");
        res.status(200).json(data);
    } catch (error) {
        console.error('API Evaluation Error:', error.message);
        res.status(200).json(getMockEvaluation());
    }
};

// @desc    Analyze a resume
// @route   POST /api/ai/analyze-resume
// @access  Public
const analyzeResume = async (req, res) => {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ message: 'Resume text is required' });

    try {
        if (!hf) return res.status(200).json(getMockResumeAnalysis());

        const systemPrompt = `You are an expert tech recruiter and ATS system. Analyze the provided resume text and extract insights.
STRICT INSTRUCTION: Respond ONLY with a valid JSON object.
JSON Structure:
{
  "Strengths": "string",
  "Weaknesses": "string",
  "MatchingRoles": "string",
  "PrepStrategies": "string"
}`;
        const outputText = await callHfModel(systemPrompt, `Resume Text:\n${resumeText}`);
        
        const data = extractAndParseJSON(outputText);
        if(!validateKeys(data, ['Strengths', 'Weaknesses', 'MatchingRoles', 'PrepStrategies'])) throw new Error("Missing keys");
        res.status(200).json(data);
    } catch (error) {
        console.error('Resume Analysis Error:', error.message);
        res.status(200).json(getMockResumeAnalysis());
    }
};

module.exports = {
    analyzeCompany,
    generateQuestions,
    evaluateAnswer,
    analyzeResume
};
