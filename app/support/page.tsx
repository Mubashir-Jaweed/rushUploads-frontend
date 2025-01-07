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
  </div>
  )
}

export default page
