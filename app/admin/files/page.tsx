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
    const [files, setFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    const fetchFiles = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/files`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data) {
                setFiles(response.data.data.files);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const deleteFile = async (id) => {
        if (!token) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/files/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('File deleted successfully');
            setFiles(files.filter(file => file.id !== id));
        } catch (error) {
            toast.error('Failed to delete file');
            console.error('Error:', error);
        }
    };

    const copyLink = (file) => {
        const link = `https://rushuploads.com/${file.link.id}/${file.id}`;
        navigator.clipboard.writeText(link);
        toast.success('Link copied to clipboard');
    };

    const claimReward = async (file, claimAmount) => {
        if (!token || claimAmount <= 0) return;

        console.log(claimAmount)
        console.log(file.id)
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rewards/claim/${file.id}`, {
                claims: claimAmount,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Reward Paid successfully');
            fetchFiles();
        } catch (error) {
            toast.error('Failed to pay reward');
            console.error('Error:', error);
        }
    };

    const formatRewardNumber = (num) => {
        if (num < 1) return num.toFixed(3).replace(/\.0+$/, '');
        if (num < 1000) return num.toString();
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        return num.toString();
    };

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/upload');
            return;
        }
        fetchFiles();
    }, []);

    const totalPages = Math.ceil(files.length / itemsPerPage);
    const currentFiles = files.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='flex'>
            <Sidebar />
            <div className='w-full h-screen flex flex-col bg-gray-100'>
                <Navbar />
                <div className='p-6'>
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <h2 className='text-2xl font-semibold mb-4'>Files ({files.length})</h2>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-zinc-100 text-left'>
                                    <th className='px-6 py-4'>S.no</th>
                                    <th className='px-6 py-4'>Original Name</th>
                                    <th className='px-6 py-4'>Downloads</th>
                                    <th className='px-6 py-4'>Total Paid</th>
                                    <th className='px-6 py-4'>Pay Reward</th>
                                    <th className='px-6 py-4'>User</th>
                                    <th className='px-6 py-4'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFiles.map((file, i) => {
                                    const claimableDownloads = file.downloads - file.claims;
                                    const claimableAmount = claimableDownloads > 0 ? formatRewardNumber(claimableDownloads * 0.007) : '0';
                                    return (
                                        <tr key={i} className='border-b hover:bg-zinc-50'>
                                            <td className='px-4 py-3'>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                            <td className='px-4 py-3'>{file.originalName}</td>
                                            <td className='px-4 py-3'>{formatRewardNumber(file.downloads)}</td>
                                            <td className='px-4 py-3'>{formatRewardNumber(file.claims * 0.007)}$</td>
                                            <td className='px-4 py-3'>
                                                <select
                                                    onChange={(e) => claimReward(file, e.target.value)}
                                                    className='border px-2 py-1 rounded'
                                                >
                                                    <option value='0'>0$</option>
                                                    {claimableDownloads > 0 && <option value={claimableDownloads}>{claimableAmount}$</option>}
                                                </select>
                                            </td>
                                            <td className='px-4 py-3'>{file.user.email}</td>
                                            <td className='px-4 py-3 flex gap-4'>
                                                <button onClick={() => copyLink(file)} className='text-blue-500 hover:text-blue-700'>
                                                    <HiOutlineClipboardCopy size={18} />
                                                </button>
                                                <button onClick={() => deleteFile(file.id)} className='text-red-500 hover:text-red-700'>
                                                    <LuTrash size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-4 flex justify-between items-center'>
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}>Previous</button>
                        <span className='text-gray-700'>Page {currentPage} of {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
