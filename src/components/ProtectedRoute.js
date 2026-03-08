import React from 'react'
import { Navigate } from 'react-router-dom'
import { isMockAuthenticated } from '../mock/authMock'

const ProtectedRoute = ({ children }) => {
  if (!isMockAuthenticated()) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute
