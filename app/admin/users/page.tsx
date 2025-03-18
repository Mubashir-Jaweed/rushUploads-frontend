'use client';
import { formatFileSize } from '@/lib/utils';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useUserContext } from '@/contexts/user';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
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
        console.log(id)
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

    const toggleUserStatus = async (id, isDeleted) => {
        if (!token) return;

        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${id}`, {
                isDeleted: !isDeleted,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(`User ${isDeleted ? 'enabled' : 'disabled'} successfully`);
            setUsers(users.map(user => user.id === id ? { ...user, isDeleted: !isDeleted } : user));
        } catch (error) {
            toast.error(`Failed to ${isDeleted ? 'enable' : 'disable'} user`);
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

    const storageOptions = [
        { value: 200 * 1024 ** 3, label: '200 GB' },
        { value: 400 * 1024 ** 3, label: '400 GB' },
        { value: 800 * 1024 ** 3, label: '800 GB' },
        { value: 1500 * 1024 ** 3, label: '1500 GB' },
        { value: -1, label: 'Unlimited' },
    ];


    const [expandedUserId, setExpandedUserId] = useState(null);

    const toggleExpand = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    

    return (
        <div className='flex'>
            <Sidebar />
            <div className='w-full h-screen flex flex-col bg-gray-100'>
                <Navbar />
                <div className='p-6 overflow-auto'>
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <h2 className='text-2xl font-semibold mb-6'>User Management ({users.length})</h2>
                        
                        {/* Desktop Table */}
                        <div className='hidden md:block'>
                            <table className='w-full'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        {['User', 'Tier', 'Storage', 'Files', 'Role', 'Status', 'Actions'].map((header, idx) => (
                                            <th key={idx} className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {currentUsers.map((currentUser) => (
                                        <tr key={currentUser.id} className='hover:bg-gray-50'>
                                            <td className='px-4 py-3'>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium'>{currentUser.email.split('@')[0]}</span>
                                                    <span className='text-sm text-gray-500'>{currentUser.email}</span>
                                                </div>
                                            </td>
                                            <td className='px-4 py-3'>
                                                <select
                                                    className='block w-full rounded-md border border-gray-300 px-2 py-1 text-sm'
                                                    value={currentUser.tier}
                                                    onChange={(e) => updateUser(currentUser.id, 'tier', e.target.value)}
                                                >
                                                    {['FREE', 'PRO', 'PREMIUM'].map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className='px-4 py-3'>
                                                <div className='flex flex-col'>
                                                    <select
                                                        className='rounded-md border border-gray-300 px-2 py-1 text-sm'
                                                        value={currentUser.totalStorage}
                                                        onChange={(e) => updateUser(currentUser.id, 'totalStorage', parseInt(e.target.value))}
                                                    >
                                                        {storageOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span className='text-xs text-gray-500 mt-1'>
                                                        Used: {formatFileSize(currentUser.usedStorage)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='px-4 py-3 text-sm'>{currentUser._count?.files || 0}</td>
                                            <td className='px-4 py-3'>
                                                <select
                                                    className={`rounded-md border px-2 py-1 text-sm ${
                                                        currentUser.role === 'ADMIN' 
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : 'border-gray-300'
                                                    }`}
                                                    value={currentUser.role}
                                                    onChange={(e) => updateUser(currentUser.id, 'role', e.target.value)}
                                                >
                                                    {['ADMIN', 'USER'].map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className='px-4 py-3'>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                                                    currentUser.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {currentUser.isDeleted ? 'Disabled' : 'Active'}
                                                </span>
                                            </td>
                                            <td className='px-4 py-3'>
                                                {currentUser.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => toggleUserStatus(currentUser.id, currentUser.isDeleted)}
                                                        className={`text-sm px-3 py-1 rounded ${
                                                            currentUser.isDeleted 
                                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}
                                                    >
                                                        {currentUser.isDeleted ? 'Enable' : 'Disable'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className='md:hidden space-y-4'>
                            {currentUsers.map((currentUser) => (
                                <div key={currentUser.id} className='bg-white rounded-lg border border-gray-200 shadow-sm'>
                                    <div className='p-4 flex items-center justify-between'>
                                        <div>
                                            <div className='font-medium'>{currentUser.email.split('@')[0]}</div>
                                            <div className='text-sm text-gray-500'>{currentUser.email}</div>
                                        </div>
                                        <button 
                                            onClick={() => toggleExpand(currentUser.id)}
                                            className='text-gray-500 hover:text-gray-700'
                                        >
                                            {expandedUserId === currentUser.id ? <FiChevronUp /> : <FiChevronDown />}
                                        </button>
                                    </div>
                                    
                                    {expandedUserId === currentUser.id && (
                                        <div className='p-4 border-t border-gray-200 space-y-3'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Tier:</span>
                                                <select
                                                    className='rounded-md border border-gray-300 px-2 py-1 text-sm'
                                                    value={currentUser.tier}
                                                    onChange={(e) => updateUser(currentUser.id, 'tier', e.target.value)}
                                                >
                                                    {['FREE', 'PRO', 'PREMIUM'].map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div className='flex justify-between items-center'>
                                                <span className='text-gray-600'>Status:</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    currentUser.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {currentUser.isDeleted ? 'Disabled' : 'Active'}
                                                </span>
                                            </div>
                                            
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Storage:</span>
                                                <select
                                                    className='rounded-md border border-gray-300 px-2 py-1 text-sm'
                                                    value={currentUser.totalStorage}
                                                    onChange={(e) => updateUser(currentUser.id, 'totalStorage', parseInt(e.target.value))}
                                                >
                                                    {storageOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Used Storage:</span>
                                                <span className='text-sm'>{formatStorage(currentUser.usedStorage)}</span>
                                            </div>
                                            
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Files:</span>
                                                <span className='text-sm'>{currentUser._count?.files || 0}</span>
                                            </div>
                                            
                                            <div className='flex justify-between items-center'>
                                                <span className='text-gray-600'>Role:</span>
                                                <select
                                                    className={`rounded-md border px-2 py-1 text-sm ${
                                                        currentUser.role === 'ADMIN' 
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : 'border-gray-300'
                                                    }`}
                                                    value={currentUser.role}
                                                    onChange={(e) => updateUser(currentUser.id, 'role', e.target.value)}
                                                >
                                                    {['ADMIN', 'USER'].map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            {currentUser.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => toggleUserStatus(currentUser.id, currentUser.isDeleted)}
                                                    className={`w-full mt-2 text-sm px-3 py-1.5 rounded-md ${
                                                        currentUser.isDeleted 
                                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {currentUser.isDeleted ? 'Enable User' : 'Disable User'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination remains same */}
                        <div className='mt-6 flex justify-between items-center'>
                        <div className='text-sm text-gray-600'>
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} users
                        </div>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${
                                    currentPage === 1 
                                        ? 'bg-gray-200 cursor-not-allowed' 
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-md ${
                                        currentPage === page 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md ${
                                    currentPage === totalPages 
                                        ? 'bg-gray-200 cursor-not-allowed' 
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default page;