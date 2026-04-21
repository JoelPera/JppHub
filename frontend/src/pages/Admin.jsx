import { useState, useEffect } from 'react';
import api from '../services/api';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Assuming admin endpoints
                const usersRes = await api.get('/admin/users');
                const postsRes = await api.get('/articles');
                const paymentsRes = await api.get('/admin/payments');
                setUsers(usersRes.data);
                setPosts(postsRes.data);
                setPayments(paymentsRes.data);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                // Fallback dummy data
                setUsers([{ id: 1, name: 'User 1', email: 'user1@example.com' }]);
                setPosts([{ id: 1, title: 'Post 1', author: 'Author 1' }]);
                setPayments([{ id: 1, amount: 10, user: 'User 1' }]);
            }
        };
        fetchAdminData();
    }, []);

    const handleDelete = async (type, id) => {
        try {
            await api.delete(`/admin/${type}/${id}`);
            // Refresh data
            if (type === 'users') setUsers(users.filter(u => u.id !== id));
            if (type === 'articles') setPosts(posts.filter(p => p.id !== id));
            if (type === 'payments') setPayments(payments.filter(p => p.id !== id));
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Admin Panel</h1>

            {/* Users Table */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Users</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-2">ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-700">
                                <td className="py-2">{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button className="text-blue-400 mr-2">Edit</button>
                                    <button onClick={() => handleDelete('users', user.id)} className="text-red-400">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Posts Table */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Posts</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-2">ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id} className="border-b border-gray-700">
                                <td className="py-2">{post.id}</td>
                                <td>{post.title}</td>
                                <td>{post.author}</td>
                                <td>
                                    <button className="text-blue-400 mr-2">Edit</button>
                                    <button onClick={() => handleDelete('articles', post.id)} className="text-red-400">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payments Table */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Payments</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-2">ID</th>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment.id} className="border-b border-gray-700">
                                <td className="py-2">{payment.id}</td>
                                <td>{payment.user}</td>
                                <td>${payment.amount}</td>
                                <td>
                                    <button className="text-blue-400 mr-2">Edit</button>
                                    <button onClick={() => handleDelete('payments', payment.id)} className="text-red-400">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;