import React from 'react'
import {AiOutlineLike,AiOutlineMessage,AiOutlineHome,AiOutlinePhone,AiOutlineSearch } from 'react-icons/ai'
import { FaVideo } from "react-icons/fa6";
import { Link } from 'react-router-dom';


const IconContainer = () => {
  return (
    <div className='flex relative flex items-center bg-white justify-around'>
                    
                    
                    <Link to='/home/likes'>
                    <AiOutlineLike size={30}/>
                    </Link>
                    <Link to='/home/messages'>
                    <AiOutlineMessage size={30}/>
                    </Link>
                    <Link to='/home/left'>
                    <AiOutlineHome size={30}/>
                    </Link>
                    <Link to='/home/call'>
                    <AiOutlinePhone size={30}/>
                    </Link>
                    <Link to='/home/search'>
                    <AiOutlineSearch size={30}/>
                    </Link>
                    <Link to='/home/video'>
                    <FaVideo size={30}/>
                    </Link>
                    
                    
                    
                   
                    <p className='border-2 border-blue-500 pl-2 pr-2'>re-xend</p>
                </div>
  )
}

export default IconContainer