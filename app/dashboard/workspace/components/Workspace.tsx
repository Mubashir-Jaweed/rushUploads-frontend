'use client'
import React, { useEffect, useRef, useState } from 'react'

const Workspace = () => {

    const tabs = ['Sent', 'Recieved'];

    const [selectedTab, setSelectedTab] = useState(0)
    const [underlineStyle, setUnderlineStyle] = useState({});
    const tabRefs = useRef([]);

    useEffect(() => {
        const currentTab = tabRefs.current[selectedTab];
        if (currentTab) {
            setUnderlineStyle({
              left: currentTab.offsetLeft,
              width: currentTab.clientWidth,
            });
          }
    }, [selectedTab]);
    return (

        <div className=' border-black w-[60%] h-[80vh] flex flex-col gap-2 justify-start items-start p-5'>
            <span className='text-base font-medium text-zinc-600'>helloworld@rushuploads.com</span>
            <span className='text-stone-800 text-3xl font-semibold' >My Workspace</span>
            <div className='relative w-full border-b my-5 border-zinc-400 flex justify-between items-center'>
                <div className='flex gap-5'>
                    {tabs.map((val, i) => (
                        <span key={i} ref={(el) => (tabRefs.current[i] = el)} onClick={() => setSelectedTab(i)} className={`cursor-pointer text-lg ${selectedTab == i ? 'font-medium text-zinc-800':'font-normal text-zinc-700'}`}>{val}</span>

                    ))}
                </div>
                {/* Underline Element */}
                <div
                    className="absolute bottom-0 h-[1.5px] bg-zinc-700 transition-all duration-300 ease-in-out"
                    style={{ ...underlineStyle }}
                ></div>
                <div>
                    <span>Sort by</span>
                </div>
            </div>

        </div>
    )
}

export default Workspace
