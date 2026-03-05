// import React from 'react'
// import Post from '../components/Post'
// import hlogo2 from '../assets/hlogo2.png'
// import p1 from '../assets/male/p1.jpg'
// import p2 from '../assets/male/p2.jpg'
// import p3 from '../assets/male/p3.jpg'
// import p4 from '../assets/male/p4.jpg'
// import p5 from '../assets/male/p5.jpg'
// import p6 from '../assets/male/p6.jpg'
// import p7 from '../assets/male/p7.jpg'
// import p8 from '../assets/male/p8.jpg'
// import avatar from '../assets/avatar.png'

import { useOutlet } from "react-router-dom"
import LeftRoutes from "../components/LeftRoutes"

const Left = () => {
  const outlet = useOutlet()

  return (
    <div className='h-full w-[calc(100%-58px)] overflow-y-auto bg-[#efefef]'>
      {outlet || <LeftRoutes />}
    </div>
  )
}

export default Left
