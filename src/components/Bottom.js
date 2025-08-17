import React from 'react'
import Right from './Right'
import Left from './Left'
import AIcontainer from './AIcontainer'
import IconContainer from './IconContainer'


const Bottom = () => {
  return (
    <>
    <Right/>
    <IconContainer/>
    <div className=''>
    <AIcontainer />
    </div>
    <Left/>
    
    
    
    </>
  )
}

export default Bottom