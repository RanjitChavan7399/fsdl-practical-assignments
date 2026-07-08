import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path ? "text-primary font-bold" : "text-gray-600 hover:text-primary transition-colors";
    };

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-10 w-full">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-blue-900 tracking-tight">
                    <FaGraduationCap className="text-primary text-3xl" />
                    Placement Preparation Platform <span className="text-primary">PPP</span>
                </Link>

                <ul className="flex gap-6 items-center font-medium">
                    <li>
                        <Link to="/" className={isActive('/')}>Home</Link>
                    </li>
                    <li>
                        <Link to="/experience" className={isActive('/experience')}>Experiences</Link>
                    </li>
                    <li>
                        <Link to="/prep-tools" className={isActive('/prep-tools')}>AI Prep Tools</Link>
                    </li>
                    {user ? (
                        <>
                            <li className="font-semibold text-blue-800">
                                Welcome, {user.name}
                            </li>
                            <li>
                                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md font-medium transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
