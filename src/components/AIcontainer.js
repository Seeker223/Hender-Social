import React from 'react'
import { useState } from "react"


const AIcontainer = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <>
      <div className='absolute bottom-12 right-[72px] z-40 transition-all delay-200'>
        <div className={`${toggleMenu ? 'block' : 'hidden'} rounded border border-[#d8d8d8] bg-white p-2 text-sm font-semibold text-black`}>
          <p>hot friends</p>
          <p>cool friends</p>
          <p>doo friends</p>
          <p>Edge is ai</p>
          <p>Edge is Apps</p>
        </div>
      </div>
      <button
        type='button'
        onClick={() => setToggleMenu(!toggleMenu)}
        className='absolute bottom-2 right-[72px] z-40 text-4xl font-bold text-orange-600'
      >
        AI
      </button>
    </>
  )
}

export default AIcontainer
