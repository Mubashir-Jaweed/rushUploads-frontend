'use client'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import axios from 'axios';
import { useUserContext } from '@/contexts/user';

const Page = () => {
  const { isLoading, token, user } = useUserContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.data.notifications)
        console.log(response.data.data.notifications)
        setLoading(false)
      } catch (error) {
        // toast.error('Failed to fetch monetization');
        setLoading(false)
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchSettings();
  }, [token]);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the date format as needed
  };

  return (
    <div className='flex'>
      <Sidebar />
      <div className='w-full h-screen flex flex-col bg-gray-100'>
        <Navbar />
        <div className='p-6 overflow-y-auto'>
          <h1 className='text-2xl font-bold mb-6'>Notifications</h1>
          
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className='flex justify-center items-center h-64'>
              <p>No notifications found</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {notifications.map((notification) => (
                <div key={notification.id} className='bg-white p-4 rounded-lg shadow'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-medium'>{notification.description}</h3>
                      <p className='text-sm text-gray-500'>{notification.email}</p>
                    </div>
                    <span className='text-xs text-gray-400'>
                      {formatDate(notification.dateTime)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page