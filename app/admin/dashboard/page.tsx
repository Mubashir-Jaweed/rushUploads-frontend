'use client'
import Navbar from '../components/Navbar'
import { useUserContext } from '@/contexts/user';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { LuUsers, LuFiles, LuDownload } from "react-icons/lu";
import { BiMoneyWithdraw } from "react-icons/bi";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Sidebar from '../components/Sidebar';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const page = () => {
    const { isLoading, token, user } = useUserContext();
    const [totalData, setTotalData] = useState(null);
    const [topFiles, setTopFiles] = useState([]);
    const router = useRouter();

    const getData = async () => {
        if (!token) return;

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/kpis`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data) {
                setTotalData(response.data.data);
                console.log(response.data.data);
                setTopFiles(response.data.data.files.topDownloads || []);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push("/upload");
            return;
        }
        getData();
    }, []);

    const data = {
        labels: topFiles.map((file) => file.originalName),
        datasets: [
            {
                label: "Download Count",
                data: topFiles.map((file) => file.downloads),
                backgroundColor: "#ff4262",
                borderColor: "#fff",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: { title: { display: true, text: "Files" } },
            y: { title: { display: true, text: "Download Count" }, beginAtZero: true },
        },
    };

    const formatNumber = (num: number): string => {
        if (num < 1) return num.toFixed(3).replace(/\.?0+$/, ''); // Show up to 3 decimal places
        if (num < 1000) return num.toString(); // Show as is if less than 1000
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // Millions
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'; // Thousands
        return num.toString();
    };
    return (
        <div className='flex h-screen'>
            <Sidebar />
            <div className="w-full flex flex-col">
                <Navbar />
                {!totalData ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ff4262]"></div>
                        <button
                            className="mt-4 px-6 py-2 bg-[#ff4262] text-white rounded-lg shadow hover:bg-[#d93654]"
                            onClick={getData}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col p-10 space-y-10'>
                        <div className='grid grid-cols-4 gap-6'>
                            {[['Total users', totalData.counts.users  || 0, <LuUsers />],
                            ['Total files', totalData.counts.files  || 0, <LuFiles />],
                            ['Total downloads', totalData.counts.downloads  || 0, <LuDownload />],
                            ['Reward paid', totalData.counts.claims * 0.007  || 0, <BiMoneyWithdraw />]
                        ]
                                .map(([label, count, icon], idx) => (
                                    <div key={idx} className='bg-white p-6 shadow-lg rounded-lg flex items-center space-x-6'>
                                        <span className='bg-[#ff4262] p-4 text-white rounded-full text-3xl'>
                                            {icon}
                                        </span>
                                        <div>
                                            <span className='text-gray-600'>{label}</span>
                                            <h2 className='text-4xl font-bold text-gray-800'>{formatNumber(count)} {label.includes('paid') && '$'}</h2>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className=' bg-white p-6 shadow-lg rounded-lg w-auto overflow-hidden'>
                            <h2 className='text-xl font-semibold text-gray-700 mb-4'>Top 10 Downloaded Files</h2>
                            <div className="w-full overflow-x-auto">
                                <div className="w-[80%]">
                                    <Bar data={data} options={options} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default page;
