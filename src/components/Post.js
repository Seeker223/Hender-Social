import React from 'react'
import {AiOutlineLike,AiOutlineMessage,AiOutlineHome,AiOutlinePhone,AiOutlineSearch } from 'react-icons/ai'

const Post = (props) => {
  return (
    <article className='w-full border-b border-[#d4d4d4] bg-[#efefef] pb-2'>
      <div className='flex items-center gap-2 px-1 py-1'>
        <div className='h-10 w-10 rounded-full border border-[#c2c2c2]'>
          <img
            src={props.img}
            className='h-full w-full rounded-full object-cover'
            alt='profile'
            loading="lazy"
            decoding="async"
          />
        </div>
        <p className='text-[27px] font-bold leading-none text-[#e30072]'>hh</p>
        <p className='text-base font-semibold text-black'>{props.name}</p>
      </div>

      <div className='mx-1 mb-1 rounded border border-black bg-white px-1 text-sm leading-5 text-black'>
        {props.text}
      </div>

      <div className='mx-1 overflow-hidden border border-[#d3d3d3] bg-[#efefef]'>
        <img
          src={props.img}
          className='h-[240px] w-full object-cover'
          alt='post'
          loading="lazy"
          decoding="async"
        />
      </div>

      <p className='px-1 pt-1 text-lg font-bold leading-6 text-black'>you and {props.react} reacted</p>

      <div className='flex items-center justify-between px-1 pt-1 text-black'>
        <AiOutlineLike size={30} />
        <AiOutlineMessage size={30} />
        <AiOutlineHome size={30} />
        <AiOutlinePhone size={30} />
        <AiOutlineSearch size={30} />
        <p className='border border-[#2b5da9] px-2 text-base leading-7'>re-xend</p>
      </div>

      <p className='px-1 text-lg leading-6 text-black'>Post-most-comment</p>
    </article>
  )
}

export default Post
