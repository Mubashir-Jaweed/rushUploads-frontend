'use client';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useUserContext } from '@/contexts/user';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiOutlineClipboardCopy } from 'react-icons/hi';
import { LuTrash } from 'react-icons/lu';
import { toast } from 'react-toastify';

const page = () => {
    const { isLoading, token, user } = useUserContext();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const router = useRouter();

    const fetchUsers = async () => {
        if (!token) return;

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                setUsers(response.data.data.users);
                console.log(response.data.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const updateUser = async (id, field, value) => {
        if (!token) return;

        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${id}`, {
                [field]: value,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('User updated successfully');
            setUsers(users.map(user => user.id === id ? { ...user, [field]: value } : user));
        } catch (error) {
            toast.error('Failed to update user');
            console.error('Error:', error);
        }
    };


    const deleteUser = async (id) => {
        if (!token) return;
    
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('User deleted successfully');
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            toast.error('Failed to delete user');
            console.error('Error:', error);
        }
    };
    

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/upload');
            return;
        }
        fetchUsers();
    }, []);

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const currentUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='flex'>
            <Sidebar />
            <div className='w-full h-screen flex flex-col bg-gray-100'>
                <Navbar />
                <div className='p-6'>
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <h2 className='text-2xl font-semibold mb-4'>Users ({users.length})</h2>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-zinc-100 text-left'>
                                    <th className='px-6 py-4'>S.no</th>
                                    <th className='px-6 py-4'>Name</th>
                                    <th className='px-6 py-4'>Email</th>
                                    <th className='px-6 py-4'>Tier</th>
                                    <th className='px-6 py-4'>Role</th>
                                    <th className='px-6 py-4'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, i) => (
                                    <tr key={i} className='border-b hover:bg-zinc-50'>
                                        <td className='px-4 py-3'>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                        <td className='px-4 py-3'>{user.email.split('@')[0]}</td>
                                        <td className='px-4 py-3'>{user.email}</td>
                                        <td className='px-4 py-3'>
                                            <select
                                                className='border px-2 py-1 rounded'
                                                value={user.tier}
                                                onChange={(e) => updateUser(user.id, 'tier', e.target.value)}
                                            >
                                                <option value={user.tier} disabled>{user.tier}</option>
                                                {['FREE', 'PRO', 'PREMIUM'].map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className='px-4 py-3'>
                                            <select
                                                className='border px-2 py-1 rounded'
                                                value={user.role}
                                                onChange={(e) => updateUser(user.id, 'role', e.target.value)}
                                            >
                                                <option value={user.role} disabled>{user.role}</option>
                                                {['ADMIN', 'USER'].map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className='px-4 py-3 flex gap-4'>
                                            <button onClick={() => deleteUser(user.id)} className='text-red-500 hover:text-red-700'>
                                                <LuTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-4 flex justify-between items-center'>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                        >
                            Previous
                        </button>
                        <span className='text-gray-700'>Page {currentPage} of {totalPages}</span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
