import React from 'react'
import '../pages/SplashScreen.css'
import hlogo2 from '../assets/hlogo2.png'
import { Link } from 'react-router-dom'

const SplashScreen = () => {
  return (
    <div className='body h-screen bg-white-500 md:bg-blue-500 lg:bg-green-500 bg-center flex justify-center items-center'>
    <div className='h-screen flex flex-col justify-center items-center'>
            <Link to='/home'>
              <div className=''>
                  <img
                    src={hlogo2}
                    width={180}
                    height={180}
                    alt='logo'
                  />
              </div>
           </Link>
                <h1 className="w-full text-4xl font-bold">Hender Xender</h1>
    </div>
    
    </div>
  )
}

export default SplashScreen


