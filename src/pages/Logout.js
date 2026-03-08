import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearCurrentMockUser } from '../mock/authMock'

const Logout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    clearCurrentMockUser()
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <h1 className='text-lg font-semibold'>Signing out...</h1>
    </div>
  )
}

export default Logout
