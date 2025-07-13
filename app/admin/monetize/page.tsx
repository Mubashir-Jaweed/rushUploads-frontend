'use client';
import Navbar from '../components/Navbar';
import { useUserContext } from '@/contexts/user';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { LuEye, LuMousePointerClick, LuLink, LuSettings, LuToggleLeft, LuToggleRight } from 'react-icons/lu';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';

const MonetizationPage = () => {
  const { token } = useUserContext();
  
  const [settings, setSettings] = useState({
    value: 'OFF',
    redirectUrl: '',
    bannerUrl: ''
  });
  const [stats, setStats] = useState({ views: 0, clicks: 0 });
    const [isMonetization, setIsMonetization] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchMonetizationSettings()
}, [token]);

const fetchSettings = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ads/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
           
            setStats(response.data.data)
          } catch (error) {
            // toast.error('Failed to fetch monetization');
            console.error('Failed to fetch data:', error);
        }
    };
   const fetchMonetizationSettings = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/settings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsMonetization(response.data.data.value === 'ON' ? true : false);
                setSettings(e =>({
                  ...e,
                  value: response.data.data.value,
                  bannerUrl: response.data.data.bannerUrl,
                  redirectUrl: response.data.data.redirectUrl,
                }))
            } catch (error) {
                // toast.error('Failed to fetch monetization');
                console.error('Failed to fetch monetization:', error);
            }
        };

  const handleUrlUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/settings/monetization`,
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('URLs updated successfully!');
    } catch (error) {
      console.error('Error updating URLs:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
  };


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="w-full flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="p-4 md:p-6 space-y-6 flex-grow overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div className="bg-white p-4 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="bg-[#ff4262]/10 p-3 text-[#ff4262] rounded-xl">
                <LuEye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Views</p>
                <h2 className="text-xl font-semibold text-gray-800">
                  {formatNumber(stats.views)}
                </h2>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="bg-[#ff4262]/10 p-3 text-[#ff4262] rounded-xl">
                <LuMousePointerClick className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Clicks</p>
                <h2 className="text-xl font-semibold text-gray-800">
                  {formatNumber(stats.clicks)}
                </h2>
              </div>
            </div>
          </div>

          {/* URL Settings */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <LuLink className="text-[#ff4262]" /> Ad URLs Configuration
            </h2>
            
            <form onSubmit={handleUrlUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redirect URL
                </label>
                <input
                  type="url"
                  value={settings.redirectUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, redirectUrl: e.target.value }))}
                  className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-[#ff4262] focus:border-transparent"
                  placeholder="Enter redirect URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner URL
                </label>
                <input
                  type="url"
                  value={settings.bannerUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, bannerUrl: e.target.value }))}
                  className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-[#ff4262] focus:border-transparent"
                  placeholder="Enter banner URL"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-[#ff4262] text-white rounded-xl hover:bg-[#d93654] transition-colors"
              >
                Update URLs
              </button>
            </form>
          </div>


           <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <LuLink className="text-[#ff4262]" /> Current monetization setting 
            </h2>
            
            <div  className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monetization is {settings.value}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redirect URL
                </label>
                <div
                 
                  className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-[#ff4262] focus:border-transparent"
                >{settings.redirectUrl}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner URL
                </label>
               <div
                 
                  className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-[#ff4262] focus:border-transparent"
                >{settings.bannerUrl}</div>
              </div>

             
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default MonetizationPage;