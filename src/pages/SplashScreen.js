import React from 'react'
import '../pages/SplashScreen.css'
import hlogo2 from '../assets/hlogo2.png'
import hender_xender from '../assets/hender_xender.png'
import { Link } from 'react-router-dom'

const SplashScreen = () => {
  return (
    <div className='body text-white h-screen md:bg-blue-500 lg:bg-green-500 bg-center flex justify-center items-center'>
    <div className='h-screen flex flex-col justify-center items-center'>
            <Link to='/home'>
              <div className=''>
                  <img
                    src={hender_xender}
                    width={90}
                    height={90}
                    alt='logo'
                  />
              </div>
           </Link>
                <h1 className="w-full text-xl font-bold">Hender Xender</h1>
    </div>
    
    </div>
  )
}

export default SplashScreen









