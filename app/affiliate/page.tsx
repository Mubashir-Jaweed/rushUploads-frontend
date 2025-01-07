import React from 'react'
import HowItWorks from './components/HowItWorks'
import Navbar from '@/components/Navbar'
import AffiliateHero from './components/AffiliateHero'

const page = () => {
  return (
    <div className='auth-bg'>
        <Navbar/>
      <HowItWorks/>
    </div>
  )
}

export default page
