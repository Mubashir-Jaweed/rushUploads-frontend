'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUserContext } from '@/contexts/user'
import axios from 'axios'
import { toast } from 'react-toastify'
import { formatFileSize } from '@/lib/utils'
import { FiDownload, FiDollarSign, FiFile, FiArrowLeft, FiChevronDown, FiChevronUp, FiCopy, FiTrash2 } from 'react-icons/fi'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const UserProfilePage = () => {
    const { id } = useParams()
    const router = useRouter()
    const { token, user: currentUser } = useUserContext()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [expandedFileId, setExpandedFileId] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                router.push('/login')
                return
            }

            try {
                setLoading(true)
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (response.data?.data?.users) {
                    const foundUser = response.data.data.users.find(u => u.id === id)
                    if (foundUser) {
                        setUser(foundUser)
                    } else {
                        toast.error('User not found')
                        router.push('/admin/users')
                    }
                }
            } catch (error) {
                toast.error('Failed to fetch user data')
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }

        if (currentUser?.role !== 'ADMIN') {
            router.push('/upload')
            return
        }

        fetchUserData()
    }, [id, token, currentUser, router])

    const copyLink = (fileId) => {
        const link = `https://rushuploads.com/${fileId}`
        navigator.clipboard.writeText(link)
        toast.success('Link copied to clipboard')
    }

    const deleteFile = async (fileId) => {
        if (!token) return
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/files/${fileId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success('File deleted successfully')
            setUser({
                ...user,
                files: user.files.filter(file => file.id !== fileId)
            })
        } catch (error) {
            toast.error('Failed to delete file')
            console.error('Error:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <p className="text-xl mb-4">User not found</p>
                    <button
                        onClick={() => router.push('/admin/users')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-[8px] hover:bg-blue-600"
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        )
    }

    const prepareChartData = (downloadedAt) => {
        const downloadsByDate = {}

        downloadedAt?.forEach((dateString) => {
            const date = new Date(dateString)
            const dateKey = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })

            downloadsByDate[dateKey] = (downloadsByDate[dateKey] || 0) + 1
        })

        const sortedDates = Object.keys(downloadsByDate).sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime()
        })

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
        }
    }

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
                        return `${context.parsed.y} download${context.parsed.y !== 1 ? 's' : ''}`
                    },
                    title: (context) => {
                        return context[0].label
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
                    callback: function (value) {
                        const date = new Date(this.getLabelForValue(value))
                        return date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })
                    },
                    maxRotation: 45,
                    minRotation: 45
                }
            },
        },
    }

    const totalDownloads = user.files?.reduce((sum, file) => sum + (file.downloads || 0), 0) || 0
    const totalClaims = user.files?.reduce((sum, file) => sum + (file.claims || 0), 0) || 0

    return (
        <div className='flex'>
            <Sidebar />
            <div className='w-full h-screen flex flex-col bg-gray-100'>
                <Navbar />
                <div className='p-6 overflow-auto'>
                    <div className='bg-white p-6 rounded-[8px] shadow-lg'>
                        <div className='flex items-center gap-4 mb-6'>
                            <button
                                onClick={() => router.push('/admin/users')}
                                className="flex items-center text-blue-500 hover:text-blue-700"
                            >
                                <FiArrowLeft className="mr-2" />
                            </button>
                            <h1 className='text-2xl font-semibold'>{user.email}</h1>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                            <div className='bg-white border border-gray-200 p-4 rounded-[8px] shadow-sm'>
                                <h3 className='text-sm font-medium text-gray-500'>Tier</h3>
                                <p className='text-lg font-semibold capitalize'>{user.tier?.toLowerCase() || 'free'}</p>
                            </div>

                            <div className='bg-white border border-gray-200 p-4 rounded-[8px] shadow-sm'>
                                <h3 className='text-sm font-medium text-gray-500'>Storage</h3>
                                <p className='text-lg font-semibold'>
                                    {formatFileSize(user.usedStorage || 0)} /{' '}
                                    {user.totalStorage === -1 ? 'Unlimited' : formatFileSize(user.totalStorage || 0)}
                                </p>
                            </div>

                            <div className='bg-white border border-gray-200 p-4 rounded-[8px] shadow-sm'>
                                <h3 className='text-sm font-medium text-gray-500'>Files</h3>
                                <p className='text-lg font-semibold'>{user.files?.length || 0}</p>
                            </div>

                            <div className='bg-white border border-gray-200 p-4 rounded-[8px] shadow-sm'>
                                <h3 className='text-sm font-medium text-gray-500'>Downloads</h3>
                                <p className='text-lg font-semibold'>{totalDownloads}</p>
                            </div>

                            <div className='bg-white border border-gray-200 p-4 rounded-[8px] shadow-sm'>
                                <h3 className='text-sm font-medium text-gray-500'>Claims</h3>
                                <p className='text-lg font-semibold'>${totalClaims * 0.007}</p>
                            </div>

                            <div className={`bg-white border p-4 rounded-[8px] shadow-sm ${user.isDeleted ? 'border-red-200' : 'border-green-200'
                                }`}>
                                <h3 className='text-sm font-medium text-gray-500'>Status</h3>
                                <p className={`text-lg font-semibold ${user.isDeleted ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                    {user.isDeleted ? 'Disabled' : 'Active'}
                                </p>
                            </div>


                        </div>

                        <h2 className='text-xl font-semibold mb-4'>Files</h2>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-4 py-3 text-left text-sm font-medium text-gray-500 rounded-tl-[8px]'>File</th>
                                        <th className='px-4 py-3 text-left text-sm font-medium text-gray-500'>Type</th>
                                        <th className='px-4 py-3 text-left text-sm font-medium text-gray-500'>Size</th>
                                        <th className='px-4 py-3 text-left text-sm font-medium text-gray-500'>
                                            <FiDownload className='inline mr-1' /> Downloads
                                        </th>
                                        <th className='px-4 py-3 text-left text-sm font-medium text-gray-500'>
                                            <FiDollarSign className='inline mr-1' /> Claims
                                        </th>
                                        <th className='px-4 py-3 text-left text-sm font-medium text-gray-500'>Uploaded</th>
                                        <th className='px-4 py-3 text-left text-sm font-medium text-gray-500 rounded-tr-[8px]'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {user.files?.length > 0 ? (
                                        user.files.map((file) => (
                                            <React.Fragment key={file.id}>
                                                <tr
                                                    className={`hover:bg-gray-50 ${expandedFileId === file.id ? 'bg-gray-50' : ''}`}
                                                >
                                                    <td
                                                        className='px-4 py-3 cursor-pointer'
                                                        onClick={() => setExpandedFileId(expandedFileId === file.id ? null : file.id)}
                                                    >
                                                        <div className='flex items-center'>
                                                            <div className='flex-shrink-0 h-10 w-10 bg-gray-100 rounded-[8px] flex items-center justify-center'>
                                                                <FiFile className='text-gray-400' />
                                                            </div>
                                                            <div className='ml-4'>
                                                                <div className='text-sm font-medium text-gray-900'>
                                                                    {file.originalName?.length > 30
                                                                        ? `${file.originalName.substring(0, 30)}...`
                                                                        : file.originalName || 'Untitled'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className='px-4 py-3 text-sm text-gray-500 cursor-pointer'
                                                        onClick={() => setExpandedFileId(expandedFileId === file.id ? null : file.id)}
                                                    >
                                                        {file.type || 'N/A'}
                                                    </td>
                                                    <td
                                                        className='px-4 py-3 text-sm text-gray-500 cursor-pointer'
                                                        onClick={() => setExpandedFileId(expandedFileId === file.id ? null : file.id)}
                                                    >
                                                        {formatFileSize(file.size || 0)}
                                                    </td>
                                                    <td
                                                        className='px-4 py-3 text-sm text-gray-500 cursor-pointer'
                                                        onClick={() => setExpandedFileId(expandedFileId === file.id ? null : file.id)}
                                                    >
                                                        {file.downloads || 0}
                                                    </td>
                                                    <td
                                                        className='px-4 py-3 text-sm text-gray-500 cursor-pointer'
                                                        onClick={() => setExpandedFileId(expandedFileId === file.id ? null : file.id)}
                                                    >
                                                        ${(file.claims * 0.007 || 0)}
                                                    </td>
                                                    <td
                                                        className='px-4 py-3 text-sm text-gray-500 cursor-pointer'
                                                        onClick={() => setExpandedFileId(expandedFileId === file.id ? null : file.id)}
                                                    >
                                                        {new Date(file.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-500'>
                                                        <div className='flex gap-3'>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    copyLink(file.id)
                                                                }}
                                                                className='text-blue-500 hover:text-blue-700'
                                                                title="Copy link"
                                                            >
                                                                <FiCopy size={18} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    if (confirm('Are you sure you want to delete this file?')) {
                                                                        deleteFile(file.id)
                                                                    }
                                                                }}
                                                                className='text-red-500 hover:text-red-700'
                                                                title="Delete file"
                                                            >
                                                                <FiTrash2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => setExpandedFileId(expandedFileId === file.id ? null : file.id)}
                                                                className='text-gray-500 hover:text-gray-700'
                                                            >
                                                                {expandedFileId === file.id ? <FiChevronUp /> : <FiChevronDown />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedFileId === file.id && (
                                                    <tr>
                                                        <td colSpan="7" className='px-4 py-4 bg-gray-50'>
                                                            <div className='h-[150px] w-full'>
                                                                {file.downloadedAt?.length > 0 ? (
                                                                    <Line
                                                                        data={prepareChartData(file.downloadedAt)}
                                                                        options={chartOptions}
                                                                    />
                                                                ) : (
                                                                    <div className='flex items-center justify-center h-full text-gray-500'>
                                                                        No download data available
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className='px-6 py-4 text-center text-gray-500'>
                                                No files found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage