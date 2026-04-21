import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gray-800 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-400">JppHub</Link>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {user ? (
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300">Welcome, User</span>
                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-2">
                            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;