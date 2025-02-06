'use client'
import Navbar from '../components/Navbar'
import { useUserContext } from '@/contexts/user';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { LuUsers, LuFiles, LuDownload } from "react-icons/lu";
import { HiOutlineCloudDownload } from "react-icons/hi";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Sidebar from '../components/Sidebar';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Page = () => {
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
                setTopFiles(response.data.data.files.topDownloads || []); // Ensure it's an array
                console.log(response.data);
            }
        } catch (error) {
            console.error("Error :", error);
        }
    };

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push("/upload");
            return;
        }
        getData();
    }, []);

    // Fix: Use file names for labels
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
        barThickness:20 ,
        borderRadius:10 ,
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

    return (
        <div className='flex'>
            <Sidebar/>
            <div className="w-full h-screen flex flex-col justify-start items-start">
               <Navbar/>
               {!totalData ? (
                    <div className="w-full  flex justify-center">
                        <svg width="50px" height="50px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" fill="none">
                            <circle cx="25" cy="25" r="20" stroke="#ff4262" strokeWidth="4" strokeLinecap="round" fill="none"
                                strokeDasharray="100" strokeDashoffset="0">
                                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25"
                                    dur="0.5s" repeatCount="indefinite" />
                                <animate attributeName="stroke-dashoffset" values="100;0" dur="1s" repeatCount="indefinite" />
                            </circle>
                        </svg>
                        <button onClick={getData}>Retry</button>
                    </div>
                ) : (
                    <div className='w-full bg-zinc-100 h-[90.5%] flex flex-col justify-between p-10'>
                        <div className='w-full flex justify-center gap-5 items-center'>
                            <div className='h-40 w-72 rounded-[8px] shadow p-2 flex justify-center items-center gap-5 bg-white bg-opacity-85'>
                                <span className='bg-[#ff4262] rounded-full p-4'><LuUsers className='size-10 text-white' /></span>
                                <div className='flex flex-col'>
                                    <span className='text-xl font-medium text-stone-600'>Total users</span>
                                    <span className='text-7xl font-semibold text-stone-800'>{totalData.counts.users || 0}</span>
                                </div>
                            </div>
                            <div className='h-40 w-72 rounded-[8px] shadow p-2 flex justify-center items-center gap-5 bg-white bg-opacity-85'>
                                <span className='bg-[#ff4262] rounded-full p-4'><LuFiles className='size-10 text-white' /></span>
                                <div className='flex flex-col'>
                                    <span className='text-xl font-medium text-stone-600'>Total files</span>
                                    <span className='text-7xl font-semibold text-stone-800'>{totalData.counts.files || 0}</span>
                                </div>
                            </div>
                            <div className='h-40 w-72 rounded-[8px] shadow p-2 flex justify-center items-center gap-5 bg-white bg-opacity-85'>
                                <span className='bg-[#ff4262] rounded-full p-4'><LuDownload className='size-10 text-white' /></span>
                                <div className='flex flex-col'>
                                    <span className='text-xl font-medium text-stone-600'>Total downloads</span>
                                    <span className='text-7xl font-semibold text-stone-800'>{totalData.counts.downloads || 0}</span>
                                </div>
                            </div>
                            <div className='h-40 w-72 rounded-[8px] shadow p-2 flex justify-center items-center gap-5 bg-white bg-opacity-85'>
                                <span className='bg-[#ff4262] rounded-full p-4'><HiOutlineCloudDownload className='size-10 text-white' /></span>
                                <div className='flex flex-col'>
                                    <span className='text-xl font-medium text-stone-600'>Max downloads</span>
                                    <span className='text-7xl font-semibold text-stone-800'>48</span>
                                </div>
                            </div>
                        </div>
                        <div className='h-[70%] overflow-hidden flex justify-center items-center'>
                            <Bar  data={data} options={options} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;





 