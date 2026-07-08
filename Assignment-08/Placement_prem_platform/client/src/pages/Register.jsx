import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [yearOfStudy, setYearOfStudy] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, yearOfStudy }, config);
            
            if (data.success) {
                login(data.user, data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Create an Account</h2>
            {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Create a password (min 6 chars)"
                        required
                        minLength="6"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Year of Study</label>
                    <select 
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        required
                    >
                        <option value="" disabled>Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <button 
                    type="submit"  
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="mt-4 text-center text-gray-600">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
            </p>
        </div>
    );
};

export default Register;
