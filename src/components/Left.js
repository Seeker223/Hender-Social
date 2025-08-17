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

import { Outlet } from "react-router-dom"
import LeftRoutes from "../components/LeftRoutes"

const Left = () => {
  return (
    <>
    <div className=' w-[100vw] h-[100vh]'>
    <Outlet/>
    </div>
    </>
    // <>
    // <div className="relative overflow-y-scroll h-[41rem]  w-[80%]">
        
    //     <Post name='ztsambad' img={hlogo2} text='efjfhjkfvdzjhnmcckn,mcn,xnc.xjfkllcjdxcnnfdk,.fdfffffffd' react='21'/>
    //     <Post name=''  img={p1} text='' react='4'/>
    //     <Post name='' img={avatar} text='' react='44'/>
    //     <Post name='' img={p2} text='' react='34'/>
    //     <Post name='' img={p3} text='' react='78'/>
    //     <Post name='' img={p4} text='' react='68'/>
    //     <Post name='' img={p5} text='' react='999'/>
    //     <Post name='' img={p6} text='' react='766'/>
    //     <Post name='' img={p7} text='' react='5555'/>
    //     <Post name='' img={p8} text='' react='457'/>
    //     <Post name='' img={p1} text='' react='455'/>
    //     <Post name='' img={p2} text='' react='665'/>
    //     <Post name='' img={p3} text='' react='554'/>
    //     <Post name='' img={p4} text='' react='677'/>
    //     </div>
        
    //     </>
  )
}

export default Left