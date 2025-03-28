'use client';
import Navbar from '../components/Navbar';
import { useUserContext } from '@/contexts/user';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LuUsers, LuFiles, LuDownload, LuMonitor, LuMousePointerClick } from 'react-icons/lu';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/Sidebar';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const { isLoading, token, user } = useUserContext();
  const [totalData, setTotalData] = useState(null);
  const [topFiles, setTopFiles] = useState([]);
  const [adsStats, setAdsStats] = useState({ views: 0, clicks: 0 });
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/upload');
      return;
    }
    getData();
  }, [user, router]);

  const getData = async () => {
    if (!token) return;

    try {
      const [kpisResponse, adsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/kpis`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ads/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (kpisResponse.data) {
        setTotalData(kpisResponse.data.data);
        setTopFiles(kpisResponse.data.data.files.topDownloads || []);
      }
      if (adsResponse.data) setAdsStats(adsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';
    if (num < 1) return num.toFixed(3).replace(/\.0+$/, '');
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="w-full flex flex-col overflow-hidden">
        <Navbar />
        
        {!totalData ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ff4262]"></div>
            <button
              className="mt-4 px-6 py-2 bg-[#ff4262] text-white rounded-lg shadow-md hover:bg-[#d93654] transition-all"
              onClick={getData}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex-grow overflow-y-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              {[
                ['Total Users', totalData.counts.users || 0, <LuUsers className="w-6 h-6 md:w-8 md:h-8" />],
                ['Total Files', totalData.counts.files || 0, <LuFiles className="w-6 h-6 md:w-8 md:h-8" />],
                ['Total Downloads', totalData.counts.downloads || 0, <LuDownload className="w-6 h-6 md:w-8 md:h-8" />],
                ['Reward Paid', totalData.counts.claims * 0.007 || 0, <BiMoneyWithdraw className="w-6 h-6 md:w-8 md:h-8" />],
              ].map(([label, count, Icon], idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-[#ff4262]/10 p-2 md:p-3 text-[#ff4262] rounded-lg">
                    {Icon}
                  </div>
                  <div>
                    <p className="text-sm md:text-base text-gray-500 mb-1">{label}</p>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                      {formatNumber(count)}
                      {label === 'Reward Paid' && <span className="text-sm md:text-base ml-1">$</span>}
                    </h2>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
              {/* Main Chart */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm flex-1">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                  Top 10 Downloaded Files
                </h2>
                <div className="h-64 sm:h-72 md:h-80 lg:h-96">
                  <Bar
                    data={{
                      labels: topFiles.map((file) => file.originalName),
                      datasets: [
                        {
                          label: 'Downloads',
                          data: topFiles.map((file) => file.downloads),
                          backgroundColor: '#ff4262',
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { 
                            font: {
                              size: window.innerWidth < 768 ? 10 : 12
                            } 
                          }
                        },
                        y: {
                          beginAtZero: true,
                          ticks: { 
                            font: {
                              size: window.innerWidth < 768 ? 10 : 12
                            } 
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          labels: {
                            font: {
                              size: 14
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Ads Performance */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm lg:max-w-md w-full">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                  Ads Performance
                </h2>
                <div className="flex flex-col gap-3 md:gap-4">
                  {[
                    ['Total Views', adsStats.views, <LuMonitor className="w-6 h-6 md:w-8 md:h-8" />],
                    ['Total Clicks', adsStats.clicks, <LuMousePointerClick className="w-6 h-6 md:w-8 md:h-8" />],
                  ].map(([label, count, Icon], idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                      <div className="bg-[#ff4262]/10 p-2 md:p-3 text-[#ff4262] rounded-lg">
                        {Icon}
                      </div>
                      <div>
                        <p className="text-sm md:text-base text-gray-500">{label}</p>
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                          {formatNumber(count)}
                        </h2>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;