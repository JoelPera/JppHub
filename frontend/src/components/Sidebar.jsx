import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 p-4 min-h-screen">
            <ul className="space-y-2">
                <li>
                    <Link to="/dashboard" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                        📊 Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/posts" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                        📝 Posts
                    </Link>
                </li>
                <li>
                    <Link to="/categories" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                        🏷️ Categories
                    </Link>
                </li>
                <li>
                    <Link to="/subscriptions" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                        💳 Subscriptions
                    </Link>
                </li>
                <li>
                    <Link to="/payments" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                        💰 Payments
                    </Link>
                </li>
                <li>
                    <Link to="/admin" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                        ⚙️ Admin
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;