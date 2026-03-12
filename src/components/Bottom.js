import React from 'react'
import Right from './Right'
import Left from './Left'
import AIcontainer from './AIcontainer'


const Bottom = ({
  rightCircles = [],
  onRightScrollDown,
  onRightScrollUp,
  isLoading = false,
  activePostImg,
  onRightCircleClick,
}) => {
  return (
    <section className='relative h-[calc(100%-4rem)] w-full'>
     
      <div className='relative flex h-[calc(100%-3rem)] w-full'>
       
        <Left isLoading={isLoading} activePostImg={activePostImg} />
        <Right
          circles={rightCircles}
          onScrollDown={onRightScrollDown}
          onScrollUp={onRightScrollUp}
          isLoading={isLoading}
          onCircleClick={onRightCircleClick}
        />
      </div>
      <AIcontainer />
    </section>
  )
}

export default Bottom
