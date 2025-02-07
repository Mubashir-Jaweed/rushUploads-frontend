'use client';
import Navbar from '../components/Navbar';
import { useUserContext } from '@/contexts/user';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LuUsers, LuFiles, LuDownload } from 'react-icons/lu';
import { HiOutlineCloudDownload } from 'react-icons/hi';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/Sidebar';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Page = () => {
    const { isLoading, token, user } = useUserContext();
    const [totalData, setTotalData] = useState([]);
    const [totalDataLength, setTotalDataLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const router = useRouter();

    const getUsers = async () => {
        if (!token) return;

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data) {
                setTotalData(response.data.data.users);
                setTotalDataLength(response.data.data.users.length);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/upload');
            return;
        }
        getUsers();
    }, []);

    const totalPages = Math.ceil(totalDataLength / itemsPerPage);
    const currentData = totalData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='flex'>
            <Sidebar />
            <div className='w-full h-screen flex flex-col justify-start items-start bg-gray-100'>
                <Navbar />
                <div className='flex flex-col w-full h-full px-6 py-4'>
                    {!totalData.length ? (
                        <div className='flex flex-col justify-center items-center w-full h-full'>
                            <svg width='50px' height='50px' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg' fill='none'>
                                <circle cx='25' cy='25' r='20' stroke='#ff4262' strokeWidth='4' strokeLinecap='round' fill='none'
                                    strokeDasharray='100' strokeDashoffset='0'>
                                    <animateTransform attributeName='transform' type='rotate' from='0 25 25' to='360 25 25'
                                        dur='0.5s' repeatCount='indefinite' />
                                    <animate attributeName='stroke-dashoffset' values='100;0' dur='1s' repeatCount='indefinite' />
                                </circle>
                            </svg>
                            <button onClick={getUsers} className='mt-4'>Retry</button>
                        </div>
                    ) : (
                        <div className='bg-white p-6 rounded-lg shadow-lg w-full'>
                            <table className='w-full border-collapse'>
                                <thead>
                                    <tr className='bg-zinc-100 text-left'>
                                        <th className='text-xl font-medium px-6 py-4'>S.no</th>
                                        <th className='text-xl font-medium px-6 py-4'>Name</th>
                                        <th className='text-xl font-medium px-6 py-4'>Email</th>
                                        <th className='text-xl font-medium px-6 py-4'>Tier</th>
                                        <th className='text-xl font-medium px-6 py-4'>Role</th>
                                        <th className='text-xl font-medium px-6 py-4'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((user, i) => (
                                        <tr key={i} className='cursor-pointer hover:bg-zinc-50 border-b'>
                                            <td className='text-lg font-normal px-4 py-3'>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                            <td className='text-lg font-normal px-4 py-3'>{user.email.split('@')[0]}</td>
                                            <td className='text-lg font-normal px-4 py-3'>{user.email}</td>
                                            <td className='text-lg font-normal px-4 py-3'>{user.tier}</td>
                                            <td className='text-lg font-normal px-4 py-3'>{user.role}</td>
                                            <td className='text-lg font-normal px-4 py-3'>Action</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='flex justify-between items-center mt-4'>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50'
                                >
                                    Previous
                                </button>
                                <span className='text-lg font-medium'>Page {currentPage} of {totalPages}</span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50'
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
