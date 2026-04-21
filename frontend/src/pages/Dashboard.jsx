import { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPosts: 0,
        userPlan: 'Free',
        subscriptionStatus: 'Active'
    });
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Assuming endpoints exist
                const postsRes = await api.get('/articles');
                const userRes = await api.get('/auth/profile');
                setStats({
                    totalPosts: postsRes.data.length,
                    userPlan: userRes.data.plan || 'Free',
                    subscriptionStatus: userRes.data.subscription || 'Active'
                });
                // Dummy activity
                setActivity([
                    { id: 1, action: 'Viewed post', time: '2 hours ago' },
                    { id: 2, action: 'Subscribed to category', time: '1 day ago' },
                ]);
            } catch (err) {
                console.error('Error fetching dashboard:', err);
            }
        };
        fetchDashboard();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
                    <p className="text-3xl font-bold text-blue-400">{stats.totalPosts}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-2">User Plan</h3>
                    <p className="text-3xl font-bold text-green-400">{stats.userPlan}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-2">Subscription</h3>
                    <p className="text-3xl font-bold text-purple-400">{stats.subscriptionStatus}</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <ul className="space-y-2">
                    {activity.map(item => (
                        <li key={item.id} className="flex justify-between py-2 border-b border-gray-700">
                            <span>{item.action}</span>
                            <span className="text-gray-400">{item.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;