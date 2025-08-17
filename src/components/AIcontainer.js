import React from 'react'
import { useState } from "react"


const AIcontainer = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <>
    <div className='text-4xl font-bold absolute z-40 text-orange-600 bottom-9 right-16 transition-all delay-200'>
    <div className={`${toggleMenu? 'bg-white' : 'hidden'}`}>
    <p className=''>hot friends</p>
    <p className=''>cool friends</p>
    <p className=''>doo friends</p>
    <p className=''>Edge is ai</p>
    <p className=''>Edge is Apps</p>
    </div>
        
    </div>
    <div className='text-4xl font-bold absolute z-40 text-orange-600 bottom-1 right-16 transition-all delay-200'>
    <a onClick={() => setToggleMenu(!toggleMenu) }>
        AI
        </a>
        </div>
        </>


  )
}

export default AIcontainer