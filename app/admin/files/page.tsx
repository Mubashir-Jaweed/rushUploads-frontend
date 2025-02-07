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


    function formatNumber(num) {
		if (num < 1000) return num.toString(); // Show as is if less than 1000
		if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // Millions
		if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'; // Thousands
		return num.toString();
	  }

    return (
        <div className='flex'>
            <Sidebar/>
            <div className="w-full h-screen flex flex-col justify-start items-start">
               <Navbar/>
              
            </div>
        </div>
    );
};

export default Page;





 