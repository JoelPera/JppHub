import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return (
        <Router>
            <div className="min-h-screen bg-gray-900 text-white">
                <Navbar />
                <div className="flex">
                    {user && <Sidebar />}
                    <main className={`flex-1 p-6 ${user ? '' : 'ml-0'}`}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                            <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" />} />
                            <Route path="/posts" element={<Posts />} />
                            <Route path="/posts/:id" element={<PostDetail />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;