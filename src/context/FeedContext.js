import React from 'react'

const FeedContext = React.createContext({
  activePostImg: null,
  activePostBadgeCount: 0,
})

export const FeedProvider = FeedContext.Provider

export const useFeed = () => React.useContext(FeedContext)

