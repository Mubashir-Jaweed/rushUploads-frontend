import Navbar from '@/components/Navbar'
import React from 'react'
import SupportHero from './components/SupportHero'
import SupportFaq from './components/SupportFaq'

const page = () => {
  return (
    <div className='auth-bg '>
    <Navbar/>
    <SupportHero/>
    <SupportFaq/>
    <div id='supp-l' className="fixed bottom-0 right-0 bg-blue-600 opacity-90 w-[350px] h-[800px] rounded"/>
			<div id='supp-r' className="fixed bottom-0 left-0 bg-blue-600 opacity-90 w-[350px] h-[800px] rounded"/>
  </div>
  )
}

export default page
