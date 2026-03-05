import React from 'react'
import Top from '../components/Top'
import Bottom from '../components/Bottom'

const Home = () => {
  return (
    <section className='min-h-screen w-full bg-[#e9e9e9] py-2 sm:py-4'>
      <div className='mx-auto h-[100dvh] max-h-[760px] w-full max-w-[390px] overflow-hidden border border-[#e4006e] bg-[#f4f4f4] shadow-lg'>
        <Top />
        <Bottom />
      </div>
    </section>
  )
}

export default Home
