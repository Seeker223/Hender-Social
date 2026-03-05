import React from 'react'
import Right from './Right'
import Left from './Left'
import AIcontainer from './AIcontainer'
import IconContainer from './IconContainer'


const Bottom = () => {
  return (
    <section className='relative h-[calc(100%-4rem)] w-full'>
      <IconContainer />
      <div className='relative flex h-[calc(100%-3rem)] w-full'>
       
        <Left />
        <Right />
      </div>
      <AIcontainer />
    </section>
  )
}

export default Bottom
