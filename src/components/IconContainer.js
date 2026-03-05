import React from 'react'
import {AiOutlineLike,AiOutlineMessage,AiOutlineHome,AiOutlinePhone,AiOutlineSearch } from 'react-icons/ai'
import { FaVideo } from "react-icons/fa6";
import { Link } from 'react-router-dom';


const IconContainer = () => {
  return (
    <nav className='flex h-12 items-center justify-between border-b border-[#b6b6b6] bg-white px-2 text-black'>
      <Link to='/home/likes'><AiOutlineLike size={24} /></Link>
      <Link to='/home/userId'><AiOutlineMessage size={24} /></Link>
      <Link to='/home/left'><AiOutlineHome size={24} /></Link>
      <Link to='/home/call'><AiOutlinePhone size={24} /></Link>
      <Link to='/home/search'><AiOutlineSearch size={24} /></Link>
      <Link to='/home/video'><FaVideo size={21} /></Link>
      <p className='border border-[#2b5da9] px-2 text-base leading-7'>re-xend</p>
    </nav>
  )
}

export default IconContainer
