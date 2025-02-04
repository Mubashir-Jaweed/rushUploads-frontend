'use client'
import Navbar from '@/components/Navbar'
import { useUserContext } from '@/contexts/user';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {




    const { isLoading, token, user } = useUserContext();
    const [totalData, setTotalData] = useState();
    const router = useRouter();



    const getData = async () => {
        console.log('object')
        if (!token) {
            return
        }

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

            if (response) {
                setTotalData(response.data.data);
                console.log(response.data.data)
            }
        } catch (error) {
            console.error("Error :", error);
        }
    }

    useEffect(() => {
        // if (user?.role != 'ADMIN') {
        //     router.push("/upload");
        //     return
        // }
        getData()
    }, []);


    return (
        <div>
            <Navbar />
            <div className=" w-full h-screen auth-bg flex justify-center items-center pt-24">
                {/* {!totalData ?
                    <div className="w-full h-[100%] flex justify-center">
                        <svg width="50px" height="50px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" fill="none">
                            <circle cx="25" cy="25" r="20" stroke="#ff4262" stroke-width="4" stroke-linecap="round" fill="none"
                                stroke-dasharray="100" stroke-dashoffset="0">
                                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25"
                                    dur="0.5s" repeatCount="indefinite" />
                                <animate attributeName="stroke-dashoffset" values="100;0" dur="1s" repeatCount="indefinite" />
                            </circle>
                        </svg>
                        <button onClick={
                            () => getData()
                        }>retry</button>
                    </div>
                    : */}
                    <div className='border-2 h-full w-[80%] p-10'>
                        <div className='  w-full flex justify-center gap-5 items-center'>
                            <div className='h-40 w-72 rounded-xl bg-zinc-50 bg-opacity-55'>
                                <span>Total users</span>
                            </div>
                            <div className='h-40 w-72 rounded-xl bg-zinc-50 bg-opacity-55'>
                                <span>Total users</span>
                            </div> <div className='h-40 w-72 rounded-xl bg-zinc-50 bg-opacity-55'>
                                <span>Total users</span>
                            </div> <div className='h-40 w-72 rounded-xl bg-zinc-50 bg-opacity-55'>
                                <span>Total users</span>
                            </div> <div className='h-40 w-72 rounded-xl bg-zinc-50 bg-opacity-55'>
                                <span>Total users</span>
                            </div>
                        </div>
                    </div>
                {/* } */}
            </div>
        </div>
    )
}

export default page
