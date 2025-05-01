'use client';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useUserContext } from '@/contexts/user';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiOutlineClipboardCopy, HiOutlinePencil } from 'react-icons/hi';
import { LuTrash } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React from 'react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Page = () => {
    const { isLoading, token, user } = useUserContext();
    const [files, setFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState('');
    const [originalExtension, setOriginalExtension] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [expandedRow, setExpandedRow] = useState(null);
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
                console.log(response.data.data.files);
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

    const updateFile = async (id) => {
        if (!token || !newName.trim()) return;
        try {
            const updatedName = newName.trim() + originalExtension;
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/files/${id}`, {
                originalName: updatedName,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('File name updated successfully');
            setFiles(files.map(file => 
                file.id === id ? { ...file, originalName: updatedName } : file
            ));
            setEditingId(null);
            setNewName('');
            setOriginalExtension('');
        } catch (error) {
            toast.error('Failed to update file name');
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

    const truncateFileName = (name, maxLength = 20) => {
        if (name.length <= maxLength) return name;
        return `${name.substring(0, maxLength)}...`;
    };

    const getSortedFiles = () => {
        const filesToSort = [...files];
        
        switch (sortOption) {
            case 'downloads_high':
                return filesToSort.sort((a, b) => b.downloads - a.downloads);
            case 'downloads_low':
                return filesToSort.sort((a, b) => a.downloads - b.downloads);
            case 'newest':
                return filesToSort.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            case 'oldest':
                return filesToSort.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
            default:
                return filesToSort;
        }
    };

    const prepareChartData = (downloadedAt) => {
        const downloadsByDate = {};
        
        downloadedAt?.forEach((dateString) => {
            const date = new Date(dateString);
            const dateKey = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            downloadsByDate[dateKey] = (downloadsByDate[dateKey] || 0) + 1;
        });

        const sortedDates = Object.keys(downloadsByDate).sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime();
        });

        return {
            labels: sortedDates,
            datasets: [
                {
                    label: 'Downloads',
                    data: sortedDates.map(date => downloadsByDate[date]),
                    borderColor: '#ff4262eb',
                    backgroundColor: 'rgba(255, 66, 98, 0.1)',
                    tension: 0.3,
                    pointBackgroundColor: '#ff4262eb',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#ff4262eb',
                    pointHoverBorderColor: '#fff',
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.parsed.y} download${context.parsed.y !== 1 ? 's' : ''}`;
                    },
                    title: (context) => {
                        return context[0].label;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                },
                grid: {
                    drawBorder: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    callback: function(value) {
                        const date = new Date(this.getLabelForValue(value));
                        return date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        });
                    },
                    maxRotation: 45,
                    minRotation: 45
                }
            },
        },
    };

    const toggleRowExpansion = (fileId) => {
        setExpandedRow(expandedRow === fileId ? null : fileId);
    };

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/upload');
            return;
        }
        fetchFiles();
    }, [user, router]);

    const sortedFiles = getSortedFiles();
    const totalPages = Math.ceil(sortedFiles.length / itemsPerPage);
    const currentFiles = sortedFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='flex'>
            <Sidebar />
            <div className='w-full h-screen flex flex-col bg-gray-100'>
                <Navbar />
                <div className='p-6'>
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className='text-2xl font-semibold'>Files ({files.length})</h2>
                            <div className="flex gap-2">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="border px-3 py-1 rounded bg-white text-sm"
                                >
                                    <option value="newest">Newest Uploads</option>
                                    <option value="oldest">Oldest Uploads</option>
                                    <option value="downloads_high">Highest Downloads</option>
                                    <option value="downloads_low">Lowest Downloads</option>
                                </select>
                            </div>
                        </div>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-zinc-100 text-left'>
                                    <th className='px-6 py-4'>S.no</th>
                                    <th className='px-6 py-4'>Original Name</th>
                                    <th className='px-6 py-4'>Downloads</th>
                                    <th className='px-6 py-4'>Total Paid</th>
                                    <th className='px-6 py-4'>Pay Reward</th>
                                    <th className='px-6 py-4'>User</th>
                                    <th className='px-6 py-4'>Upload Date</th>
                                    <th className='px-6 py-4'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFiles.map((file, i) => {
                                    const claimableDownloads = file.downloads - file.claims;
                                    const claimableAmount = claimableDownloads > 0 ? formatRewardNumber(claimableDownloads * 0.007) : '0';
                                    const uploadDate = new Date(file.updatedAt).toLocaleDateString();
                                    const isExpanded = expandedRow === file.id;
                                    const chartData = prepareChartData(file.downloadedAt);

                                    return (
                                        <React.Fragment key={i}>
                                            <tr 
                                                className='border-b hover:bg-zinc-50 cursor-pointer'
                                                onClick={() => toggleRowExpansion(file.id)}
                                            >
                                                <td className='px-4 py-3'>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                                <td className='px-4 py-3'>
                                                    {editingId === file.id ? (
                                                        <input
                                                            type="text"
                                                            value={newName}
                                                            onChange={(e) => setNewName(e.target.value)}
                                                            className="border rounded px-2 py-1 w-full"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span title={file.originalName}>
                                                            {truncateFileName(file.originalName)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className='px-4 py-3'>{formatRewardNumber(file.downloads)}</td>
                                                <td className='px-4 py-3'>{formatRewardNumber(file.claims * 0.007)}$</td>
                                                <td className='px-4 py-3'>
                                                    <select
                                                        onChange={(e) => claimReward(file, e.target.value)}
                                                        className='border px-2 py-1 rounded'
                                                        value={0}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <option value='0'>0$</option>
                                                        {claimableDownloads > 0 && <option value={claimableDownloads}>{claimableAmount}$</option>}
                                                    </select>
                                                </td>
                                                <td className='px-4 py-3'>{file.user.email}</td>
                                                <td className='px-4 py-3'>{uploadDate}</td>
                                                <td className='px-4 py-3 flex gap-4 items-center'>
                                                    {editingId === file.id ? (
                                                        <>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateFile(file.id);
                                                                }}
                                                                className='px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                                                            >
                                                                Save
                                                            </button>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingId(null);
                                                                    setNewName('');
                                                                    setOriginalExtension('');
                                                                }}
                                                                className='px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600'
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    copyLink(file);
                                                                }} 
                                                                className='text-blue-500 hover:text-blue-700'
                                                                title="Copy link"
                                                            >
                                                                <HiOutlineClipboardCopy size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const lastDotIndex = file.originalName.lastIndexOf('.');
                                                                    if (lastDotIndex === -1) {
                                                                        setNewName(file.originalName);
                                                                        setOriginalExtension('');
                                                                    } else {
                                                                        setNewName(file.originalName.substring(0, lastDotIndex));
                                                                        setOriginalExtension(file.originalName.substring(lastDotIndex));
                                                                    }
                                                                    setEditingId(file.id);
                                                                }}
                                                                className='text-yellow-500 hover:text-yellow-700'
                                                                title="Edit file name"
                                                            >
                                                                <HiOutlinePencil size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteFile(file.id);
                                                                }}
                                                                className='text-red-500 hover:text-red-700'
                                                                title="Delete file"
                                                            >
                                                                <LuTrash size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="border-b">
                                                    <td colSpan={8} className="px-4 py-3">
                                                        <div className="h-[150px] w-full">
                                                            {file.downloadedAt?.length > 0 ? (
                                                                <Line data={chartData} options={chartOptions} />
                                                            ) : (
                                                                <div className="h-full flex items-center justify-center text-gray-400">
                                                                    No download activity recorded
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className='mt-4 flex justify-between items-center'>
                            <button 
                                disabled={currentPage === 1} 
                                onClick={() => setCurrentPage(currentPage - 1)} 
                                className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                Previous
                            </button>
                            <span className='text-gray-700'>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button 
                                disabled={currentPage === totalPages} 
                                onClick={() => setCurrentPage(currentPage + 1)} 
                                className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;