'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '@/assets/logo3.png';
import { useUserContext } from '@/contexts/user';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const [isMonetization, setIsMonetization] = useState(false);
    const { isLoading, token, user } = useUserContext();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/settings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsMonetization(response.data.data.value === 'ON' ? true : false);
            } catch (error) {
                // toast.error('Failed to fetch monetization');
                console.error('Failed to fetch monetization:', error);
            }
        };

        fetchSettings();
    }, [token]);

    const handleToggle = async () => {
        

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/settings/monetization`, {
                value: isMonetization ? "OFF" : "ON"
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(response.data.data)
            setIsMonetization(response.data.data.value === 'ON' ? true : false);
        } catch (error) {
            toast.error('Failed to update monetization');
            console.error('Failed to update monetization:', error);
        }
    };

    return (
        <div className='w-[300px] h-screen shadow-lg bg-white flex flex-col justify-between p-5'>
            <div>
                <Link href={'/'} className='flex items-center justify-center mb-10'>
                    <Image alt='logo' src={logo} className='h-[50px] w-[150px]' />
                </Link>
                <nav className='space-y-4'>
                    {[
                        { href: '/admin/dashboard', label: 'Dashboard' },
                        { href: '/admin/users', label: 'All Users' },
                        { href: '/admin/files', label: 'All Files' },
                        { href: '/admin/monetize', label: 'Monetization' }
                    ].map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className='block text-lg text-gray-800 rounded hover:bg-gray-100  py-3 px-6 transition'
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            
            {/* Toggle Switch */}
            <div className='flex justify-between items-center bg-gray-100 p-3 rounded-lg'>
                <span className='text-gray-800 font-medium'>Monetization</span>
                <button 
                    onClick={handleToggle} 
                    className={`relative w-14 h-7 flex items-center rounded-full p-1 transition ${isMonetization ? 'bg-[#ff4262eb]' : 'bg-gray-400'}`}
                >
                    <div 
                        className={`h-5 w-5 bg-white rounded-full shadow-md transform transition ${isMonetization ? 'translate-x-7' : ''}`} 
                    />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
